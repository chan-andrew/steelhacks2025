import machineDataJson from '@/app/pittrec_layout_final_capitalized.json';

export interface JsonMachine {
  id: number;
  name: string;
  floor: number;
  in_use: boolean;
  x: number;
  y: number;
  muscles: string[];
}

export interface ProcessedMachine extends JsonMachine {
  gridPosition: [number, number]; // [row, col] in 16x16 grid
  position3D: [number, number, number]; // 3D world position
}

// Convert JSON coordinates to 16x16 grid coordinates
export const jsonToGridCoordinates = (jsonX: number, jsonY: number): [number, number] => {
  // JSON coords (4,8,12,16) map to grid positions
  // Formula: ((JSON_coord / 4) - 1) * 4 + 2 for the starting position
  const startRow = ((jsonY / 4) - 1) * 4 + 2;
  const startCol = ((jsonX / 4) - 1) * 4 + 2;
  
  return [startRow, startCol];
};

// Convert 16x16 grid coordinates to 3D world coordinates
export const gridTo3DCoordinates = (gridRow: number, gridCol: number, floorSize: number = 12): [number, number, number] => {
  // Convert from 16x16 grid to world coordinates
  // Use smaller effective area (6x6) to make machines closer together
  const effectiveSize = 6;
  const worldX = ((gridCol - 8.5) / 8) * effectiveSize;
  const worldZ = ((gridRow - 8.5) / 8) * effectiveSize;
  
  return [worldX, 0, worldZ];
};

// Load and process all machine data
export const loadMachineData = (): ProcessedMachine[] => {
  const rawData = machineDataJson as JsonMachine[];
  
  return rawData.map(machine => {
    const [gridRow, gridCol] = jsonToGridCoordinates(machine.x, machine.y);
    const position3D = gridTo3DCoordinates(gridRow, gridCol);
    
    return {
      ...machine,
      gridPosition: [gridRow, gridCol],
      position3D
    };
  });
};

// Get machines for a specific floor
export const getMachinesForFloor = (floorNumber: number): ProcessedMachine[] => {
  const allMachines = loadMachineData();
  return allMachines.filter(machine => machine.floor === floorNumber);
};
