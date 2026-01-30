import { useEffect, useRef, useCallback, useState, RefObject } from 'react';

/**
 * Lazy loading hook using Intersection Observer
 */
export function useLazyLoad<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!ref.current || hasLoadedRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            hasLoadedRef.current = true;
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    );

    observerRef.current.observe(ref.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, callback, options]);
}

/**
 * Debounce hook - delays function execution
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );
}

/**
 * Throttle hook - limits function execution rate
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  const inThrottleRef = useRef(false);
  const lastRunRef = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (!inThrottleRef.current || now - lastRunRef.current >= limit) {
        func(...args);
        lastRunRef.current = now;
        inThrottleRef.current = true;
        setTimeout(() => {
          inThrottleRef.current = false;
        }, limit);
      }
    },
    [func, limit]
  );
}

/**
 * Virtual scrolling hook for large lists
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 2 } = options;
  const [startIndex, setStartIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + overscan * 2, items.length);
  const visibleItems = items.slice(Math.max(0, startIndex - overscan), endIndex);
  const offsetY = Math.max(0, startIndex - overscan) * itemHeight;
  const totalHeight = items.length * itemHeight;

  const handleScroll = useThrottle((scrollTop: number) => {
    setScrollTop(scrollTop);
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  }, 16); // ~60fps

  return {
    visibleItems,
    offsetY,
    totalHeight,
    startIndex: Math.max(0, startIndex - overscan),
    endIndex,
    handleScroll
  };
}

/**
 * Memoization hook with cache size limit
 */
export function useMemoized<T>(
  computeFn: () => T,
  deps: React.DependencyList,
  cacheSize: number = 10
) {
  const cacheRef = useRef<Map<string, T>>(new Map());
  const depsKey = JSON.stringify(deps);

  if (!cacheRef.current.has(depsKey)) {
    if (cacheRef.current.size >= cacheSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
    cacheRef.current.set(depsKey, computeFn());
  }

  return cacheRef.current.get(depsKey)!;
}

/**
 * Request animation frame hook for smooth animations
 */
export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback]);
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    renderCountRef.current += 1;

    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      if (renderTime > 16) { // Warn if render takes longer than 16ms (60fps)
        console.warn(`[${componentName}] Slow render: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCountRef.current
  };
}

/**
 * Image lazy loading hook
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    imgRef.current = img;

    return () => {
      img.onload = null;
    };
  }, [src]);

  return { imageSrc, isLoaded, imgRef };
}

/**
 * Resize observer hook
 */
export function useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (entries: ResizeObserverEntry[]) => void
) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(callback);
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);
}

/**
 * Intersection observer hook
 */
export function useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}
