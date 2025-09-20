'use client';

import dynamic from 'next/dynamic';
import { LoadingScreen } from './ui/LoadingSpinner';

const GymFloorVisualization = dynamic(
  () => import('./3d/GymFloorVisualization').then(mod => ({ default: mod.GymFloorVisualization })),
  {
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

interface ClientOnly3DProps {
  className?: string;
}

export const ClientOnly3D = ({ className }: ClientOnly3DProps) => {
  return <GymFloorVisualization className={className} />;
};
