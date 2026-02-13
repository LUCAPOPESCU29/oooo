'use client';

import { useEffect } from 'react';

/**
 * Performance Monitor Component
 * Tracks and logs performance metrics in development mode
 */
export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    // Track First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              console.log('🎨 First Contentful Paint:', Math.round(entry.startTime), 'ms');
            }
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('🖼️ Largest Contentful Paint:', Math.round(lastEntry.startTime), 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            console.log('⚡ First Input Delay:', Math.round(fid), 'ms');
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Track Cumulative Layout Shift (CLS)
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value;
            }
          }
          console.log('📐 Cumulative Layout Shift:', clsScore.toFixed(4));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Track Time to Interactive (TTI)
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            const tti = navTiming.domInteractive - navTiming.fetchStart;
            console.log('🚀 Time to Interactive:', Math.round(tti), 'ms');
            console.log('📊 DOM Content Loaded:', Math.round(navTiming.domContentLoadedEventEnd - navTiming.fetchStart), 'ms');
            console.log('✅ Page Load Complete:', Math.round(navTiming.loadEventEnd - navTiming.fetchStart), 'ms');
          }, 0);
        });

        // Cleanup observers on unmount
        return () => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (e) {
        // Browser doesn't support Performance Observer
      }
    }

    // Track memory usage (Chrome only)
    if ((performance as any).memory) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        console.log(`💾 Memory: ${usedMB}MB / ${totalMB}MB`);
      };

      // Check memory every 30 seconds
      const memoryInterval = setInterval(checkMemory, 30000);
      return () => clearInterval(memoryInterval);
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Utility function to measure render time
 */
export function measureRenderTime(componentName: string) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
    }
  };
}

/**
 * Hook to track component render performance
 */
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const endMeasure = measureRenderTime(componentName);
    return endMeasure;
  });
}
