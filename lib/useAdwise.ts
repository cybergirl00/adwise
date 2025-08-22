import { useEffect, useState, useCallback } from 'react';
import AdwiseClient from './adwise-sdk';


interface Campaign {
  _id: string;
  title: string;
  description?: string;
  mediaUrls: string[];
  destinationUrl?: string;
  audience?: string;
  mediaTitle?: string;
  width?: number;
  height?: number;
}

interface DisplayAd extends Omit<Campaign, 'mediaUrls'> {
  currentMediaUrl: string;
  mediaIndex: number;
  totalMedia: number;
  displayWidth: number;
  displayHeight: number;
}

export function useAdwise(config: {
  apiKey: string;
  baseUrl?: string;
  rotationInterval?: number;
  width?: number;
  height?: number;
}) {
  const [adClient, setAdClient] = useState<AdwiseClient | null>(null);
  const [currentAd, setCurrentAd] = useState<DisplayAd | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = new AdwiseClient(config);
    setAdClient(client);

    const handleAdChange = (ad: DisplayAd | null) => {
      setCurrentAd(ad);
    };

    client.subscribe(handleAdChange);

    const initializeClient = async () => {
      try {
        const success = await client.initialize();
        if (!success) {
          setError('No ads available');
        }
      } catch (err) {
        setError('Failed to initialize ad client');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeClient();

    return () => {
      client.unsubscribe(handleAdChange);
      client.destroy();
    };
  }, [config.apiKey, config.baseUrl, config.rotationInterval]);

  const rotateMedia = useCallback(() => {
    if (adClient) {
      adClient.rotateMedia();
    }
  }, [adClient]);

  const updateDimensions = useCallback((width: number, height: number) => {
    if (adClient) {
      adClient.updateDimensions(width, height);
    }
  }, [adClient]);

  const showRandomAd = useCallback(() => {
    if (adClient) {
      adClient.initiateRandomAd();
    }
  }, [adClient]);

  return {
    currentAd,
    isLoading,
    error,
    rotateMedia,
    updateDimensions,
    showRandomAd
  };
}