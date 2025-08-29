import React, { useState, useCallback } from 'react';
import { getOptimizedImageUrl, getPlaceholderImage, ImageOptimizationOptions } from '@/lib/imageOptimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  optimization?: ImageOptimizationOptions;
  placeholder?: string;
  lazy?: boolean;
  onLoadComplete?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  optimization = {},
  placeholder,
  lazy = true,
  onLoadComplete,
  onError,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);

  const optimizedSrc = getOptimizedImageUrl(src, optimization);
  const placeholderSrc = placeholder || getPlaceholderImage(
    optimization.width || 400,
    optimization.height || 300
  );

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsInView(true);
    }
  }, []);

  // Intersection Observer for lazy loading
  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (!node || !lazy || isInView) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [lazy, isInView, handleIntersection]);

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        {...props}
      >
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Placeholder/Loading state */}
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt={`Loading ${alt}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          {...props}
        />
      )}
      
      {/* Actual image */}
      {(isInView || !lazy) && (
        <img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
