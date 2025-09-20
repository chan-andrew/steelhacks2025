'use client';

import { useState, useEffect, useCallback } from 'react';

interface MobileOptimizationState {
  isMobile: boolean;
  isTouch: boolean;
  screenSize: 'sm' | 'md' | 'lg' | 'xl';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  reducedMotion: boolean;
}

export const useMobileOptimization = () => {
  const [state, setState] = useState<MobileOptimizationState>({
    isMobile: false,
    isTouch: false,
    screenSize: 'md',
    orientation: 'portrait',
    pixelRatio: 1,
    reducedMotion: false,
  });

  const updateState = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // Detect mobile/touch devices
    const isMobile = width < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Determine screen size
    let screenSize: MobileOptimizationState['screenSize'] = 'sm';
    if (width >= 1280) screenSize = 'xl';
    else if (width >= 1024) screenSize = 'lg';
    else if (width >= 768) screenSize = 'md';

    // Determine orientation
    const orientation: MobileOptimizationState['orientation'] = 
      height > width ? 'portrait' : 'landscape';

    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setState({
      isMobile,
      isTouch,
      screenSize,
      orientation,
      pixelRatio,
      reducedMotion,
    });
  }, []);

  useEffect(() => {
    updateState();

    const handleResize = () => updateState();
    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(updateState, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => updateState();
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [updateState]);

  // Performance optimization settings based on device
  const getPerformanceSettings = useCallback(() => {
    const isLowEnd = state.pixelRatio < 2 && state.isMobile;
    const isHighEnd = state.pixelRatio >= 2 && !state.isMobile;

    return {
      // 3D rendering settings
      shadowMapSize: isHighEnd ? 2048 : isLowEnd ? 512 : 1024,
      antialias: !isLowEnd,
      pixelRatio: Math.min(state.pixelRatio, isLowEnd ? 1 : 2),
      
      // Animation settings
      animationQuality: isHighEnd ? 'high' : isLowEnd ? 'low' : 'medium',
      reducedMotion: state.reducedMotion,
      
      // Interaction settings
      touchTarget: state.isTouch ? 44 : 32, // Minimum touch target size
      hoverEnabled: !state.isTouch,
    };
  }, [state]);

  // Viewport calculations for 3D scene
  const getViewportSettings = useCallback(() => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    
    return {
      fov: state.isMobile ? (state.orientation === 'portrait' ? 70 : 60) : 60,
      near: 0.1,
      far: 1000,
      aspectRatio,
      cameraDistance: state.isMobile ? 25 : 20,
    };
  }, [state]);

  return {
    ...state,
    performance: getPerformanceSettings(),
    viewport: getViewportSettings(),
    updateState,
  };
};
