import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { UrlPreviewResponse } from '@/features/urls/types';
import { HTTP_STATUS } from '@/constants';

const UrlPreviewRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
});

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { url } = UrlPreviewRequestSchema.parse(body);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URL-Shortener-Bot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Failed to fetch URL: ${response.status} ${response.statusText}`,
            code: 'FETCH_ERROR',
          },
        } satisfies UrlPreviewResponse,
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const html = await response.text();
    const metadata = extractMetadata(html, url);

    return NextResponse.json({
      success: true,
      data: metadata,
    } satisfies UrlPreviewResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.errors[0]?.message || 'Invalid request data',
            code: 'VALIDATION_ERROR',
          },
        } satisfies UrlPreviewResponse,
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Request timeout - the website took too long to respond',
              code: 'TIMEOUT_ERROR',
            },
          } satisfies UrlPreviewResponse,
          { status: HTTP_STATUS.REQUEST_TIMEOUT }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            message: error.message || 'Failed to fetch URL preview',
            code: 'UNKNOWN_ERROR',
          },
        } satisfies UrlPreviewResponse,
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
        },
      } satisfies UrlPreviewResponse,
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};

const extractMetadata = (html: string, url: string) => {

  const getMetaContent = (property: string): string | undefined => {
    const ogRegex = new RegExp(
      `<meta\\s+property=["']og:${property}["']\\s+content=["']([^"']*?)["'][^>]*>`,
      'i'
    );
    const ogMatch = html.match(ogRegex);
    if (ogMatch?.[1]) return ogMatch[1];

    const twitterRegex = new RegExp(
      `<meta\\s+name=["']twitter:${property}["']\\s+content=["']([^"']*?)["'][^>]*>`,
      'i'
    );
    const twitterMatch = html.match(twitterRegex);
    if (twitterMatch?.[1]) return twitterMatch[1];

    if (property === 'description') {
      const descRegex = /<meta\s+name=["']description["']\s+content=["']([^"']*?)["'][^>]*>/i;
      const descMatch = html.match(descRegex);
      if (descMatch?.[1]) return descMatch[1];
    }

    return undefined;
  };

  let title = getMetaContent('title');
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    title = titleMatch?.[1]?.trim();
  }

  const description = getMetaContent('description');

  let image = getMetaContent('image');
  if (image && !image.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl).href;
    } catch {
      // If URL parsing fails, keep the original
    }
  }

  let favicon: string | undefined;
  const faviconRegex = /<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']*?)["'][^>]*>/i;
  const faviconMatch = html.match(faviconRegex);
  if (faviconMatch?.[1]) {
    favicon = faviconMatch[1];
    if (favicon && !favicon.startsWith('http')) {
      try {
        const baseUrl = new URL(url);
        favicon = new URL(favicon, baseUrl).href;
      } catch {
        // If URL parsing fails, keep the original
      }
    }
  }

  const siteName = getMetaContent('site_name');

  return {
    title: title || undefined,
    description: description || undefined,
    image: image || undefined,
    favicon: favicon || undefined,
    siteName: siteName || undefined,
    url,
  };
};