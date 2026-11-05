const INF = Infinity;

// Section 8.6: diagonal zero means we may stay at a vertex without taking an edge.
export const BOOK_GRAPH = [
  [0, 6, INF, 3, INF, INF, INF],
  [INF, 0, INF, INF, 2, 10, INF],
  [7, INF, 0, INF, INF, INF, INF],
  [INF, INF, 5, 0, INF, 4, INF],
  [INF, INF, INF, INF, 0, INF, 3],
  [INF, INF, 6, INF, 7, 0, 8],
  [INF, 9, INF, INF, INF, INF, 0],
];

export interface RouteDistance {
  distance: number;
  path: number[];
}
export type DistanceMatrix = RouteDistance[][];
export interface RouteCandidate extends RouteDistance {
  via: number;
  left: number;
  right: number;
}

export const nodeLabel = (node: number) => String.fromCharCode(65 + node);
export const routeLabel = (path: number[]) => path.map(nodeLabel).join(' → ');
export const distanceLabel = (value: number) => Number.isFinite(value) ? String(value) : '∞';

export function candidateRoutes(left: DistanceMatrix, right: DistanceMatrix, from: number, to: number): RouteCandidate[] {
  return left.map((_, via) => {
    const a = left[from][via];
    const b = right[via][to];
    const distance = a.distance + b.distance;
    return {
      via, left: a.distance, right: b.distance, distance,
      path: Number.isFinite(distance) ? [...a.path, ...b.path.slice(1)] : [],
    };
  });
}

function multiply(left: DistanceMatrix, right: DistanceMatrix): DistanceMatrix {
  return left.map((_, from) => right.map((__, to) => {
    const candidates = candidateRoutes(left, right, from, to);
    // Prefer fewer edges on a tie so zero diagonal entries never create fake loops.
    const best = candidates.reduce((best, candidate) =>
      candidate.distance < best.distance ||
      (candidate.distance === best.distance && candidate.path.length < best.path.length)
        ? candidate : best);
    return { distance: best.distance, path: [...best.path] };
  }));
}

export function minPlusPower(graph: number[][], power: number): DistanceMatrix {
  if (!Number.isInteger(power) || power < 0) throw new RangeError('Power must be a non-negative integer');
  let result: DistanceMatrix = graph.map((row, from) => row.map((_, to) => ({
    distance: from === to ? 0 : INF, path: from === to ? [from] : [],
  })));
  let base: DistanceMatrix = graph.map((row, from) => row.map((distance, to) => ({
    distance, path: Number.isFinite(distance) ? (from === to ? [from] : [from, to]) : [],
  })));
  // The same halving/squaring skeleton as numeric exponentiation, with min-plus product.
  let exponent = power;
  while (exponent > 0) {
    if (exponent % 2 === 1) result = multiply(result, base);
    exponent = Math.floor(exponent / 2);
    if (exponent > 0) base = multiply(base, base);
  }
  return result;
}

export function buildDistanceLayers(graph: number[][]): DistanceMatrix[] {
  // Display every power for teaching; each is computed by repeated squaring.
  return Array.from({ length: graph.length - 1 }, (_, index) => minPlusPower(graph, index + 1));
}
