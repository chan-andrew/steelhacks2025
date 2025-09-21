import clientPromise from "@/lib/mongodb";

export type MachineNode = {
  id: number;
  name: string;
  floor: number;
  x: number;
  y: number;
  in_use?: boolean;
  muscles?: string[];
};

async function getMachinesByName(name: string): Promise<MachineNode[]> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Use regex for case-insensitive partial matching
    const machines = await db
      .collection("Machines")
      .find({
        name: { $regex: name, $options: "i" },
      })
      .toArray();

    // Convert MongoDB documents to MachineNode objects
    return machines.map((machine) => ({
      id: machine.id || parseInt(machine._id?.toString()) || 0,
      name: machine.name || "",
      floor: machine.floor || 1,
      x: machine.x || 0,
      y: machine.y || 0,
      in_use: machine.in_use || machine.isInUse || false,
      muscles: machine.muscles || [],
    })) as MachineNode[];
  } catch (error) {
    console.error("Error finding machines by name:", error);
    return [];
  }
}

/**
 
Find the nearest available machine based on XY distance
with a floor-change penalty so same-floor options win.*/
export async function findNearest(
  name: string,
  current: MachineNode,
  floorPenalty = 100, // "cost" of each floor change
  topK = 1
) {
  const machines = await getMachinesByName(name);

  // Filter only available & matching
  const candidates = machines.filter((m) => {
    if (m.in_use) return false;
    return true;
  });

  if (candidates.length === 0) {
    return { nearest: null as MachineNode | null, top: [] as MachineNode[] };
  }

  // Rank by XY distance + floor penalty
  const ranked = candidates
    .map((m) => {
      const dx = current.x - m.x;
      const dy = current.y - m.y;
      const horiz = Math.hypot(dx, dy);
      const floorDiff = Math.abs(current.floor - m.floor);
      const score = horiz + floorPenalty * floorDiff;
      return { m, score };
    })
    .sort((a, b) => a.score - b.score)
    .map((r) => r.m);

  return { nearest: ranked[0], top: ranked.slice(0, topK) };
}
