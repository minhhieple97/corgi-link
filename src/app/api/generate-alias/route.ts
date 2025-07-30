import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';
import { crawlWebContent, generateAliasesWithLLM, isValidUrl, ensureHttps } from '@/features/urls/services';
import { ALIAS_GENERATION, HTTP_STATUS } from '@/constants';

const requestSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  options: z.object({
    count: z.number().min(1).max(10).optional(),
    maxLength: z.number().min(3).max(12).optional(),
    excludeWords: z.array(z.string()).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: HTTP_STATUS.UNAUTHORIZED },
      );
    }

    const startTime = Date.now();
    
    const body = await request.json();
    const parseResult = requestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
            details: parseResult.error.flatten()
          }
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { url, options = {} } = parseResult.data;
    
    const normalizedUrl = ensureHttps(url);
    
    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_URL', 
            message: 'Invalid URL format' 
          }
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }
    
    const crawledContent = await crawlWebContent(normalizedUrl);
    
    const aliasResponse = await generateAliasesWithLLM(crawledContent, {
      count: options.count || ALIAS_GENERATION.DEFAULT_COUNT,
      maxLength: options.maxLength || ALIAS_GENERATION.MAX_LENGTH,
      excludeWords: options.excludeWords || [],
    });
    
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      data: {
        aliases: aliasResponse.aliases,
        metadata: {
          originalUrl: normalizedUrl,
          title: crawledContent.title,
          description: crawledContent.description,
          generatedAt: new Date().toISOString(),
          processingTime,
        },
      },
    });
    
  } catch (error) {
    console.error('Error generating aliases:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate aliases. Please try again.',
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
} 