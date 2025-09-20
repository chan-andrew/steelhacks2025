'use client';

import { Suspense } from 'react';
import { ClientOnly3D } from '@/components/ClientOnly3D';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { MachineStatusPanel } from '@/components/ui/MachineStatusPanel';
import { LoadingScreen } from '@/components/ui/LoadingSpinner';
import { useGymState } from '@/hooks/useGymState';

export default function Home() {
  const { gymState, selectedFloor, selectedMachine, actions } = useGymState();

  const isFloorDetailView = gymState.currentView.type === 'floor-detail';
  const showBackButton = isFloorDetailView;

  return (
    <main className="w-screen h-screen bg-black overflow-hidden relative">
      
      {/* Title */}
      {!isFloorDetailView && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-primary-white">
              Gym Floor Planner
            </h1>
            <p className="text-primary-white/70 text-lg">
              Tap a floor to explore
            </p>
          </div>
        </div>
      )}
      
      {/* 3D Visualization - Client-side only */}
      <Suspense fallback={<LoadingScreen />}>
        <ClientOnly3D className="w-full h-full" />
      </Suspense>

      {/* Navigation Controls */}
      <NavigationControls
        showBackButton={showBackButton}
        onBack={actions.returnToOverview}
        onHome={actions.returnToOverview}
        selectedFloor={selectedFloor?.id}
      />

      {/* Machine Status Panel */}
      {selectedMachine && (
        <MachineStatusPanel
          machine={selectedMachine}
          onToggleStatus={() => actions.toggleMachineStatus(selectedMachine.id)}
          onClose={() => actions.selectMachine(selectedMachine.id)}
        />
      )}

      {/* Legend */}
      {!isFloorDetailView && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Cardio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/70"></div>
              <span>Strength</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/40"></div>
              <span>Free Weights</span>
            </div>
          </div>
        </div>
      )}

      {/* Floor Detail Instructions */}
      {isFloorDetailView && selectedFloor && !gymState.isTransitioning && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-none">
          <div className="glass-effect p-4 rounded-xl text-center">
            <h2 className="text-lg font-semibold text-primary-white mb-1">
              {selectedFloor.name}
            </h2>
            <p className="text-primary-white/70 text-sm">
              Tap machines to view details • Double-tap to toggle status
            </p>
          </div>
        </div>
      )}

      {/* Performance Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 right-4 glass-effect p-2 rounded-lg text-xs text-primary-white/70">
          <div>View: {gymState.currentView.type}</div>
          <div>Floors: {gymState.floors.length}</div>
          <div>
            Machines: {gymState.floors.reduce((acc, floor) => acc + floor.machines.length, 0)}
          </div>
        </div>
      )}
    </main>
  );
}