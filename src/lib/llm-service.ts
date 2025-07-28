'server-only';

import { openaiClient } from './openai';
import { OPENAI_CONFIG, ALIAS_GENERATION } from '@/constants';
import type { CrawledContent } from './crawler';

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: 'safe' | 'suspicious' | 'malicious' | 'inappropriate' | 'unknown';
  confidence: number;
};

export type AliasGenerationOptions = {
  count?: number;
  maxLength?: number;
  excludeWords?: string[];
};

export type GeneratedAliases = {
  aliases: string[];
};

export class LLMService {
 
  static async checkUrlSafety(url: string): Promise<UrlSafetyCheck> {
    const prompt = LLMService.buildSafetyCheckPrompt(url);

    try {
      const response = await openaiClient.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a URL safety analyzer. Respond only with the requested JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: OPENAI_CONFIG.RESPONSE_FORMAT,
        temperature: OPENAI_CONFIG.TEMPERATURE,
      });

      const jsonResponse = JSON.parse(response.choices[0].message.content || '{}') as UrlSafetyCheck;
      return LLMService.validateSafetyResponse(jsonResponse);
    } catch (error) {
      console.error('Error checking URL safety:', error);
      // Return safe default to avoid blocking legitimate URLs
      return {
        isSafe: true,
        flagged: false,
        reason: null,
        category: 'unknown',
        confidence: 0,
      };
    }
  }

 
  static async generateAliases(
    content: CrawledContent,
    options: AliasGenerationOptions = {}
  ): Promise<GeneratedAliases> {
    const config = LLMService.buildAliasConfig(options);
    const prompt = LLMService.buildAliasPrompt(content, config);

    try {
      const response = await openaiClient.chat.completions.create({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating short, memorable URL aliases. Respond only with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: OPENAI_CONFIG.RESPONSE_FORMAT,
        temperature: OPENAI_CONFIG.TEMPERATURE,
      });

      const jsonResponse = JSON.parse(response.choices[0].message.content || '{}') as GeneratedAliases;
      const validAliases = LLMService.validateAndFilterAliases(jsonResponse.aliases || [], config);

      // Fill with fallbacks if needed
      if (validAliases.length < config.count) {
        const fallbacks = LLMService.generateFallbackAliases(content, config.count - validAliases.length, config);
        validAliases.push(...fallbacks);
      }

      return {
        aliases: validAliases.slice(0, config.count),
      };
    } catch (error) {
      console.error('Error generating aliases with LLM:', error);
      // Fallback to non-LLM generation
      return {
        aliases: LLMService.generateFallbackAliases(content, config.count, config),
      };
    }
  }

 
  private static buildSafetyCheckPrompt(url: string): string {
    return `
      Analyze this URL for safety concerns: "${url}"
      
      Consider the following aspects:
      1. Is it a known phishing site?
      2. Does it contain malware or suspicious redirects?
      3. Is it associated with scams or fraud?
      4. Does it contain inappropriate content (adult, violence, etc.)?
      5. Is the domain suspicious or newly registered?
      
      Respond in JSON format with the following structure:
      {
        "isSafe": boolean,
        "flagged": boolean,
        "reason": string or null,
        "category": "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown",
        "confidence": number between 0 and 1
      }
      
      Only respond with the JSON object, no additional text.
    `;
  }

 
  private static buildAliasPrompt(content: CrawledContent, config: Required<AliasGenerationOptions>): string {
    return `
      You are an expert at creating short, memorable aliases for URLs based on their content.

      Rules:
      - Generate exactly ${config.count} unique aliases
      - Maximum ${config.maxLength} characters each
      - Use only: lowercase letters (a-z), numbers (0-9), hyphens (-)
      - Make aliases meaningful and related to content
      - Prioritize readability and memorability
      - Avoid generic words like "page", "site", "web", "link"
      - Avoid these excluded words: ${config.excludeWords.join(', ')}
      - Each alias should be between ${ALIAS_GENERATION.MIN_LENGTH} and ${config.maxLength} characters
      - Prefer shorter aliases when possible
      - Use hyphens sparingly and meaningfully

      Respond with valid JSON in this exact format:
      {
        "aliases": ["alias1", "alias2", "alias3", "alias4", "alias5"]
      }

      Content Analysis:
      Title: ${content.title}
      Description: ${content.description}
      Keywords: ${content.keywords.join(', ')}
      URL: ${content.url}
    `;
  }

  
  private static buildAliasConfig(options: AliasGenerationOptions): Required<AliasGenerationOptions> {
    return {
      count: Math.min(options.count || ALIAS_GENERATION.DEFAULT_COUNT, ALIAS_GENERATION.MAX_COUNT),
      maxLength: Math.min(options.maxLength || ALIAS_GENERATION.MAX_LENGTH, ALIAS_GENERATION.MAX_LENGTH),
      excludeWords: options.excludeWords || [],
    };
  }

  
  private static validateAndFilterAliases(
    aliases: string[],
    config: Required<AliasGenerationOptions>
  ): string[] {
    return aliases.filter(alias =>
      alias &&
      alias.length >= ALIAS_GENERATION.MIN_LENGTH &&
      alias.length <= config.maxLength &&
      ALIAS_GENERATION.ALLOWED_CHARS_REGEX.test(alias) &&
      !config.excludeWords.some(word => alias.includes(word.toLowerCase()))
    );
  }

 
  private static validateSafetyResponse(response: unknown): UrlSafetyCheck {
    const data = response as Record<string, unknown>;
    const validCategories = ['safe', 'suspicious', 'malicious', 'inappropriate', 'unknown'] as const;
    
    const isValidCategory = (value: unknown): value is UrlSafetyCheck['category'] => {
      return typeof value === 'string' && validCategories.includes(value as typeof validCategories[number]);
    };
    
    const category = isValidCategory(data.category) ? data.category : 'unknown';
      
    return {
      isSafe: Boolean(data.isSafe),
      flagged: Boolean(data.flagged),
      reason: (data.reason as string) || null,
      category,
      confidence: Math.max(0, Math.min(1, Number(data.confidence) || 0)),
    };
  }


  private static generateFallbackAliases(
    content: CrawledContent,
    count: number,
    config: Required<AliasGenerationOptions>
  ): string[] {
    const aliases: string[] = [];
    const baseWords = [
      ...content.title.toLowerCase().split(/\s+/).filter(w => w.length > 2),
      ...content.keywords.map(k => k.toLowerCase()).filter(w => w.length > 2),
    ]
      .filter(word =>
        word.length <= config.maxLength &&
        ALIAS_GENERATION.ALLOWED_CHARS_REGEX.test(word.replace(/[^a-z0-9-]/g, '')) &&
        !config.excludeWords.some(excluded => word.includes(excluded.toLowerCase()))
      )
      .map(word => word.replace(/[^a-z0-9-]/g, ''))
      .filter(word => word.length >= ALIAS_GENERATION.MIN_LENGTH);

    // Add single words
    aliases.push(...baseWords.slice(0, Math.ceil(count / 2)));

    // Add combinations
    for (let i = 0; i < baseWords.length - 1 && aliases.length < count; i++) {
      for (let j = i + 1; j < baseWords.length && aliases.length < count; j++) {
        const combo = `${baseWords[i]}-${baseWords[j]}`;
        if (combo.length <= config.maxLength) {
          aliases.push(combo);
        }
      }
    }

    // Add numbered variants if still need more
    for (let i = 1; aliases.length < count && i <= 99; i++) {
      if (baseWords[0]) {
        const numbered = `${baseWords[0]}${i}`;
        if (numbered.length <= config.maxLength) {
          aliases.push(numbered);
        }
      }
    }

    return [...new Set(aliases)].slice(0, count);
  }
} 