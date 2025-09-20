'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { CameraState } from '@/types/gym';

interface CameraControllerProps {
  targetState: CameraState;
  isTransitioning: boolean;
  transitionDuration?: number;
}

export const CameraController = ({ 
  targetState, 
  isTransitioning,
  transitionDuration = 1200 
}: CameraControllerProps) => {
  const { camera } = useThree();
  const startTime = useRef<number>(0);
  const startPosition = useRef(new Vector3());
  const startTarget = useRef(new Vector3());
  const controlsRef = useRef<any>();

  useEffect(() => {
    if (isTransitioning) {
      startTime.current = Date.now();
      startPosition.current.copy(camera.position);
      
      // Get current target from controls if available
      if (controlsRef.current) {
        startTarget.current.copy(controlsRef.current.target);
      }
    }
  }, [isTransitioning, camera]);

  useFrame(() => {
    if (isTransitioning && startTime.current > 0) {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      // Cubic-bezier easing function: cubic-bezier(0.25, 0.46, 0.45, 0.94)
      const cubicBezierEase = (t: number): number => {
        // Approximation of cubic-bezier(0.25, 0.46, 0.45, 0.94)
        return t * t * (3 - 2 * t); // Smooth step function as approximation
      };
      
      const easeProgress = cubicBezierEase(progress);

      // Interpolate camera position
      const targetPos = new Vector3(...targetState.position);
      const currentPos = startPosition.current.clone().lerp(targetPos, easeProgress);
      camera.position.copy(currentPos);

      // Interpolate camera target (look-at point)
      const targetLookAt = new Vector3(...targetState.target);
      const currentTarget = startTarget.current.clone().lerp(targetLookAt, easeProgress);
      
      if (controlsRef.current) {
        controlsRef.current.target.copy(currentTarget);
        controlsRef.current.update();
      } else {
        camera.lookAt(currentTarget);
      }

      // Interpolate FOV
      camera.fov = camera.fov + (targetState.fov - camera.fov) * easeProgress * 0.1;
      camera.updateProjectionMatrix();

      // Reset when transition is complete
      if (progress >= 1) {
        startTime.current = 0;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={targetState.target}
      enablePan={true}
      enableZoom={true}
      enableRotate={!isTransitioning} // Disable rotation during transitions
      maxPolarAngle={Math.PI / 2}
      minDistance={5}
      maxDistance={50}
      enableDamping
      dampingFactor={0.05}
    />
  );
};
