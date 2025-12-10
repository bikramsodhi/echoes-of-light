import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SignedUrlCache {
  url: string;
  expiresAt: number;
}

const EXPIRATION_SECONDS = 3600; // 1 hour
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 minutes before expiry

const urlCache = new Map<string, SignedUrlCache>();

export function useSignedUrl(filePath: string | null) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!filePath) {
      setSignedUrl(null);
      return;
    }

    const fetchSignedUrl = async () => {
      // Check cache first
      const cached = urlCache.get(filePath);
      const now = Date.now();
      
      if (cached && cached.expiresAt - REFRESH_BUFFER_MS > now) {
        setSignedUrl(cached.url);
        return;
      }

      setIsLoading(true);
      setError(null);

      const { data, error: signError } = await supabase.storage
        .from('message-media')
        .createSignedUrl(filePath, EXPIRATION_SECONDS);

      if (!mountedRef.current) return;

      if (signError) {
        setError(signError.message);
        setIsLoading(false);
        return;
      }

      if (data?.signedUrl) {
        // Cache the URL
        urlCache.set(filePath, {
          url: data.signedUrl,
          expiresAt: now + (EXPIRATION_SECONDS * 1000),
        });
        setSignedUrl(data.signedUrl);
      }
      
      setIsLoading(false);
    };

    fetchSignedUrl();
  }, [filePath]);

  return { signedUrl, isLoading, error };
}

export function useSignedUrls(filePaths: string[]) {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (filePaths.length === 0) {
      setSignedUrls({});
      return;
    }

    const fetchUrls = async () => {
      setIsLoading(true);
      const now = Date.now();
      const results: Record<string, string> = {};
      const pathsToFetch: string[] = [];

      // Check cache first
      for (const path of filePaths) {
        const cached = urlCache.get(path);
        if (cached && cached.expiresAt - REFRESH_BUFFER_MS > now) {
          results[path] = cached.url;
        } else {
          pathsToFetch.push(path);
        }
      }

      // Fetch missing URLs
      if (pathsToFetch.length > 0) {
        const { data, error } = await supabase.storage
          .from('message-media')
          .createSignedUrls(pathsToFetch, EXPIRATION_SECONDS);

        if (!error && data) {
          for (const item of data) {
            if (item.signedUrl && item.path) {
              urlCache.set(item.path, {
                url: item.signedUrl,
                expiresAt: now + (EXPIRATION_SECONDS * 1000),
              });
              results[item.path] = item.signedUrl;
            }
          }
        }
      }

      setSignedUrls(results);
      setIsLoading(false);
    };

    fetchUrls();
  }, [filePaths.join(',')]);

  return { signedUrls, isLoading };
}
