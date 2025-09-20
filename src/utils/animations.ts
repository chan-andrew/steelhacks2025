import { CameraState } from '@/types/gym';

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutQuart = (t: number): number => {
  return 1 - Math.pow(1 - t, 4);
};

export const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
};

export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const lerpVector3 = (
  start: [number, number, number],
  end: [number, number, number],
  factor: number
): [number, number, number] => {
  return [
    lerp(start[0], end[0], factor),
    lerp(start[1], end[1], factor),
    lerp(start[2], end[2], factor),
  ];
};

export const animateCameraTransition = (
  startState: CameraState,
  endState: CameraState,
  duration: number,
  onUpdate: (state: CameraState) => void,
  onComplete?: () => void
): (() => void) => {
  const startTime = Date.now();
  let animationId: number;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    const currentState: CameraState = {
      position: lerpVector3(startState.position, endState.position, easedProgress),
      target: lerpVector3(startState.target, endState.target, easedProgress),
      fov: lerp(startState.fov, endState.fov, easedProgress),
    };

    onUpdate(currentState);

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };

  animate();

  // Return cancel function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
};

export const createSpringAnimation = (
  from: number,
  to: number,
  stiffness: number = 0.1,
  damping: number = 0.8
) => {
  let position = from;
  let velocity = 0;

  return {
    update: (deltaTime: number): number => {
      const force = (to - position) * stiffness;
      velocity = (velocity + force) * damping;
      position += velocity * deltaTime;
      return position;
    },
    getPosition: () => position,
    isAtRest: (threshold: number = 0.001): boolean => {
      return Math.abs(to - position) < threshold && Math.abs(velocity) < threshold;
    },
  };
};

// Predefined animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};
