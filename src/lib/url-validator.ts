import { URL_PROTOCOLS } from '@/constants';

export class UrlValidator {
  static isValid(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

 
  static ensureHttps(url: string): string {
    if (!url.startsWith(URL_PROTOCOLS.HTTPS) && !url.startsWith(URL_PROTOCOLS.HTTP)) {
      return `${URL_PROTOCOLS.HTTPS}${url}`;
    }

    if (url.startsWith(URL_PROTOCOLS.HTTP)) {
      return url.replace(URL_PROTOCOLS.HTTP, URL_PROTOCOLS.HTTPS);
    }

    return url;
  }

  
  static normalize(url: string): string {
    const normalizedUrl = this.ensureHttps(url);
    
    if (!this.isValid(normalizedUrl)) {
      throw new Error('Invalid URL format');
    }
    
    return normalizedUrl;
  }

 
  static extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      throw new Error('Cannot extract domain from invalid URL');
    }
  }
} 