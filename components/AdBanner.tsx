'use client'

import React, { useEffect } from 'react';
import { useAdwise } from '@/lib/useAdwise';

interface AdBannerProps {
  apiKey: string;
  baseUrl?: string;
  rotationInterval?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onAdClick?: (ad: DisplayAd) => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  apiKey,
  baseUrl,
  rotationInterval,
  width,
  height,
  className,
  style,
  onAdClick
}) => {
  const { currentAd, isLoading, error } = useAdwise({
    apiKey,
    baseUrl,
    rotationInterval,
    width,
    height
  });

  const handleClick = () => {
    if (onAdClick && currentAd) {
      onAdClick(currentAd);
    } else if (currentAd?.destinationUrl) {
      window.open(currentAd.destinationUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className={className} style={style}>
        <div style={{ 
          width: width || 300, 
          height: height || 250, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0'
        }}>
          Loading ad...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className} style={style}>
        <div style={{ 
          width: width || 300, 
          height: height || 250, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: 'red'
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!currentAd) {
    return (
      <div className={className} style={style}>
        <div style={{ 
          width: width || 300, 
          height: height || 250, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f0f0f0'
        }}>
          No ads available
        </div>
      </div>
    );
  }

  return (
    <div 
      className={className}
      style={{
        width: currentAd.displayWidth,
        height: currentAd.displayHeight,
        overflow: 'hidden',
        position: 'relative',
        cursor: currentAd.destinationUrl ? 'pointer' : 'default',
        backgroundColor: '#f0f0f0',
        ...style
      }}
      onClick={handleClick}
    >
      <img
        key={`${currentAd._id}-${currentAd.mediaIndex}-${Date.now()}`}
        src={currentAd.currentMediaUrl}
        alt={currentAd.mediaTitle || currentAd.title || 'Advertisement'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/fallback-ad-image.jpg';
        }}
      />
      {currentAd.title && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '8px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {currentAd.title}
        </div>
      )}
    </div>
  );
};