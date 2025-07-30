'server-only';

import * as cheerio from 'cheerio';
import puppeteer, { Browser } from 'puppeteer';
import { ALIAS_GENERATION } from '@/constants';

export type CrawledContent = {
  title: string;
  description: string;
  keywords: string[];
  url: string;
};

export type CrawlerOptions = {
  timeout?: number;
  userAgent?: string;
  waitTime?: number;
};

export class WebCrawler {
  private static readonly DEFAULT_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private static readonly DEFAULT_OPTIONS: Required<CrawlerOptions> = {
    timeout: ALIAS_GENERATION.CRAWLER_TIMEOUT,
    userAgent: WebCrawler.DEFAULT_USER_AGENT,
    waitTime: 2000,
  };

  static async crawl(
    url: string,
    options: CrawlerOptions = {},
  ): Promise<CrawledContent> {
    const config = { ...WebCrawler.DEFAULT_OPTIONS, ...options };

    try {
      return await WebCrawler.crawlStatic(url, config);
    } catch (error) {
      console.warn('Static crawling failed, trying dynamic:', error);
      try {
        return await WebCrawler.crawlDynamic(url, config);
      } catch (dynamicError) {
        console.error('Dynamic crawling also failed:', dynamicError);
        // If both methods fail, return a basic fallback
        return {
          title: new URL(url).hostname || 'Unknown Site',
          description: 'Content could not be extracted from this URL',
          keywords: [],
          url,
        };
      }
    }
  }

  private static async crawlStatic(
    url: string,
    options: Required<CrawlerOptions>,
  ): Promise<CrawledContent> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': options.userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(options.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const content = WebCrawler.extractContentFromHtml(html, url);

    if (
      !content.title ||
      content.title === 'Untitled' ||
      content.title.length <= 3
    ) {
      throw new Error('Insufficient content extracted');
    }

    return content;
  }

  private static async crawlDynamic(
    url: string,
    options: Required<CrawlerOptions>,
  ): Promise<CrawledContent> {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });

      const page = await browser.newPage();
      await page.setUserAgent(options.userAgent);

      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: options.timeout,
      });

      // Wait for dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, options.waitTime));

      const content = await page.evaluate(() => {
        const getMetaContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element?.getAttribute('content') || '';
        };

        const title =
          document.title ||
          getMetaContent('meta[property="og:title"]') ||
          getMetaContent('meta[name="title"]') ||
          document.querySelector('h1')?.textContent ||
          'Untitled';

        const description =
          getMetaContent('meta[name="description"]') ||
          getMetaContent('meta[property="og:description"]') ||
          getMetaContent('meta[name="twitter:description"]') ||
          document.querySelector('p')?.textContent ||
          '';

        const keywords =
          getMetaContent('meta[name="keywords"]')
            ?.split(',')
            .map((k) => k.trim()) || [];

        return { title, description, keywords };
      });

      return {
        title: content.title.substring(0, 200),
        description: content.description.substring(0, 500),
        keywords: content.keywords.slice(0, 10),
        url,
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private static extractContentFromHtml(
    html: string,
    url: string,
  ): CrawledContent {
    const $ = cheerio.load(html);

    const title =
      $('title').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('h1').first().text().trim() ||
      'Untitled';

    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('p').first().text().trim() ||
      '';

    const keywords =
      $('meta[name="keywords"]')
        .attr('content')
        ?.split(',')
        .map((k) => k.trim()) || [];

    return {
      title: title.substring(0, 200),
      description: description.substring(0, 500),
      keywords: keywords.slice(0, 10),
      url,
    };
  }
}
