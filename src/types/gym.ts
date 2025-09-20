export interface Machine {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'functional' | 'free-weights';
  position: [number, number, number]; // x, y, z coordinates
  rotation: [number, number, number]; // rotation in radians
  isInUse: boolean;
  dimensions: [number, number, number]; // width, height, depth
}

export interface GymFloor {
  id: number;
  name: string;
  level: number; // 1-5 for the 5 floors
  machines: Machine[];
  color: string;
  opacity: number;
  isSelected: boolean;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface ViewMode {
  type: 'overview' | 'floor-detail';
  selectedFloor?: number;
  cameraState: CameraState;
}

export interface GymState {
  floors: GymFloor[];
  currentView: ViewMode;
  isTransitioning: boolean;
  selectedMachine?: string;
}

export interface TouchGesture {
  type: 'tap' | 'pinch' | 'pan';
  position: [number, number];
  delta?: [number, number];
  scale?: number;
}

export interface FloorConfig {
  spacing: number; // vertical spacing between floors
  baseHeight: number; // height of each floor
  width: number; // floor width
  depth: number; // floor depth
}
