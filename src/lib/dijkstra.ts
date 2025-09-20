// types.ts
export type MachineNode = {
    id: number;
    name: string;
    floor: number;
    x: number;
    y: number;
    in_use?: boolean;
    muscles?: string[];
  };
  
  export type Edge = { to: number; costSec: number };
  
  export type Graph = Map<number, Edge[]>;
  
  export type CostOptions = {
    walkSpeedMps?: number;       // default 1.3 m/s
    floorPenaltySec?: number;    // e.g., 20 sec per floor gap
    excludeBusy?: boolean;       // if true, skip nodes with in_use === true
  };
  
  const DEFAULTS: Required<CostOptions> = {
    walkSpeedMps: 1.3,
    floorPenaltySec: 20,
    excludeBusy: true,
  };
  
  function euclid(a: MachineNode, b: MachineNode): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy); // meters if your coordinates are meters
  }
  
  function travelTimeSec(a: MachineNode, b: MachineNode, opt: Required<CostOptions>): number {
    const horizSec = euclid(a, b) / opt.walkSpeedMps;
    const floors = Math.abs(a.floor - b.floor);
    const verticalSec = floors * opt.floorPenaltySec;
    return horizSec + verticalSec;
  }
  
  /**
   * Build a dense graph (complete graph) over all available machines.
   * If excludeBusy=true, nodes marked in_use are excluded entirely.
   */
  export function buildGraph(
    nodes: MachineNode[],
    options: CostOptions = {}
  ): { graph: Graph; index: Map<number, MachineNode> } {
    const opt = { ...DEFAULTS, ...options };
    const index = new Map<number, MachineNode>();
    for (const n of nodes) {
      if (opt.excludeBusy && n.in_use) continue;
      index.set(n.id, n);
    }
  
    const ids = Array.from(index.keys());
    const graph: Graph = new Map();
  
    for (const id of ids) {
      const a = index.get(id)!;
      const edges: Edge[] = [];
      for (const id2 of ids) {
        if (id2 === id) continue;
        const b = index.get(id2)!;
        const costSec = travelTimeSec(a, b, opt);
        edges.push({ to: id2, costSec });
      }
      graph.set(id, edges);
    }
  
    return { graph, index };
  }
  
  /**
   * Dijkstra on the built graph.
   * Returns the shortest path (list of node ids) and total cost in seconds.
   */
  export function dijkstra(
    graph: Graph,
    startId: number,
    targetId: number
  ): { path: number[]; costSec: number } {
    const dist = new Map<number, number>();
    const prev = new Map<number, number | null>();
    const visited = new Set<number>();
  
    for (const v of Array.from(graph.keys())) {
      dist.set(v, Infinity);
      prev.set(v, null);
    }
    dist.set(startId, 0);
  
    // min-heap substitute using array (OK for 80 nodes)
    const pq: Array<{ id: number; d: number }> = [{ id: startId, d: 0 }];
  
    while (pq.length) {
      // extract-min
      pq.sort((a, b) => a.d - b.d);
      const { id: u } = pq.shift()!;
      if (visited.has(u)) continue;
      visited.add(u);
  
      if (u === targetId) break;
  
      const edges = graph.get(u) || [];
      for (const { to, costSec } of edges) {
        if (visited.has(to)) continue;
        const alt = (dist.get(u) ?? Infinity) + costSec;
        if (alt < (dist.get(to) ?? Infinity)) {
          dist.set(to, alt);
          prev.set(to, u);
          pq.push({ id: to, d: alt });
        }
      }
    }
  
    // reconstruct path
    const path: number[] = [];
    let cur: number | null = targetId;
    if (!dist.has(targetId) || dist.get(targetId) === Infinity) {
      return { path: [], costSec: Infinity };
    }
    while (cur !== null) {
      path.push(cur);
      cur = prev.get(cur) ?? null;
    }
    path.reverse();
    return { path, costSec: dist.get(targetId)! };
  }
  
  /**
   * Strict-order multi-leg routing: A -> B -> C -> ...
   * Chains Dijkstra between consecutive goals and concatenates paths.
   * Automatically avoids busy nodes (if you built the graph with excludeBusy=true).
   */
  export function planStrictOrder(
    nodes: MachineNode[],
    goals: number[],               // sequence of machine ids: [startId, idA, idB, ...]
    options: CostOptions = {}
  ): { path: number[]; costSec: number } {
    if (goals.length < 2) return { path: goals.slice(), costSec: 0 };
  
    const { graph } = buildGraph(nodes, options);
  
    const fullPath: number[] = [];
    let total = 0;
  
    for (let i = 0; i < goals.length - 1; i++) {
      const a = goals[i];
      const b = goals[i + 1];
      const { path, costSec } = dijkstra(graph, a, b);
      if (path.length === 0) return { path: [], costSec: Infinity };
      // avoid duplicating the junction node between legs
      if (i === 0) fullPath.push(...path);
      else fullPath.push(...path.slice(1));
      total += costSec;
    }
  
    return { path: fullPath, costSec: total };
  }
  