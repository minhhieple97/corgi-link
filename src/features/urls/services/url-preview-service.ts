import type { UrlPreviewMetadata, UrlPreviewResponse } from '../types';

export const urlPreviewService = {
 
  async fetchPreview(url: string): Promise<UrlPreviewMetadata> {
    if (!url || !url.trim()) {
      throw new Error('URL is required');
    }

    try {
      const response = await fetch('/api/url-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: UrlPreviewResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || `HTTP error! status: ${response.status}`
        );
      }

      if (!data.success || !data.data) {
        throw new Error(
          data.error?.message || 'Failed to fetch URL preview'
        );
      }

      return data.data;
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw with more context for common errors
        if (error.message.includes('fetch')) {
          throw new Error('Network error: Unable to fetch URL preview');
        }
        if (error.message.includes('timeout')) {
          throw new Error('Timeout: The website took too long to respond');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching URL preview');
    }
  },


  isValidPreviewUrl(url: string): boolean {
    if (!url || !url.trim()) {
      return false;
    }

    try {
      const urlObj = new URL(url.trim());
      // Only allow http and https protocols
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  },

 
  extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url.trim());
      return urlObj.hostname;
    } catch {
      return null;
    }
  },


  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + '...';
  },


  async validateImageUrl(imageUrl: string): Promise<boolean> {
    if (!imageUrl) return false;

    try {
      const response = await fetch(imageUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      return response.ok && response.headers.get('content-type')?.startsWith('image/') === true;
    } catch {
      return false;
    }
  },
};