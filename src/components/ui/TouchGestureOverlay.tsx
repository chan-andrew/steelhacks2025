'use client';

import { useRef, useEffect } from 'react';
import { createTouchGestureHandler } from '@/utils/touchGestures';
import { TouchGesture } from '@/types/gym';

interface TouchGestureOverlayProps {
  onGesture: (gesture: TouchGesture) => void;
  className?: string;
  children?: React.ReactNode;
}

export const TouchGestureOverlay = ({
  onGesture,
  className = '',
  children,
}: TouchGestureOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const gestureHandlerRef = useRef(createTouchGestureHandler());

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const gestureHandler = gestureHandlerRef.current;

    const handleTouchStart = (event: TouchEvent) => {
      const gesture = gestureHandler.handleTouchStart(event);
      if (gesture) {
        onGesture(gesture);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault(); // Prevent scrolling
      const gesture = gestureHandler.handleTouchMove(event);
      if (gesture) {
        onGesture(gesture);
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const gesture = gestureHandler.handleTouchEnd(event);
      if (gesture) {
        onGesture(gesture);
      }
    };

    // Add passive: false to prevent default behaviors
    overlay.addEventListener('touchstart', handleTouchStart, { passive: false });
    overlay.addEventListener('touchmove', handleTouchMove, { passive: false });
    overlay.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      overlay.removeEventListener('touchstart', handleTouchStart);
      overlay.removeEventListener('touchmove', handleTouchMove);
      overlay.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onGesture]);

  return (
    <div
      ref={overlayRef}
      className={`touch-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
};
