import { describe, expect, it } from 'vitest';
import { BOOK_GRAPH, buildDistanceLayers, candidateRoutes, minPlusPower } from './shortest_path';

describe('matrix powers with route witnesses', () => {
  it('explains A to F by comparing the actual two-edge routes', () => {
    const layers = buildDistanceLayers(BOOK_GRAPH);
    expect(layers[0][0][5].distance).toBe(Infinity);
    expect(layers[1][0][5]).toEqual({ distance: 7, path: [0, 3, 5] });
    const candidates = candidateRoutes(layers[0], layers[0], 0, 5);
    expect(candidates[1]).toMatchObject({ via: 1, left: 6, right: 10, distance: 16, path: [0, 1, 5] });
    expect(candidates[3]).toMatchObject({ via: 3, left: 3, right: 4, distance: 7, path: [0, 3, 5] });
  });

  it('finds A to G only when the budget reaches three edges', () => {
    const layers = buildDistanceLayers(BOOK_GRAPH);
    expect(layers[1][0][6].distance).toBe(Infinity);
    expect(layers[2][0][6]).toEqual({ distance: 11, path: [0, 1, 4, 6] });
    expect(candidateRoutes(layers[1], layers[0], 0, 6)[5].distance).toBe(15);
  });

  it('represents staying put and disconnected pairs without fictional edges', () => {
    const graph = [[0, 2, Infinity], [Infinity, 0, Infinity], [Infinity, Infinity, 0]];
    expect(minPlusPower(graph, 0)[0][0]).toEqual({ distance: 0, path: [0] });
    expect(minPlusPower(graph, 4)[0][1]).toEqual({ distance: 2, path: [0, 1] });
    expect(minPlusPower(graph, 4)[0][2]).toEqual({ distance: Infinity, path: [] });
  });

  it('matches exhaustive simple-path distances and retains valid witnesses at every power', () => {
    const layers = buildDistanceLayers(BOOK_GRAPH);
    function enumerate(from: number, to: number, visited = [from]): number {
      if (from === to) return 0;
      return Math.min(Infinity, ...BOOK_GRAPH[from].map((weight, next) =>
        Number.isFinite(weight) && !visited.includes(next)
          ? weight + enumerate(next, to, [...visited, next]) : Infinity));
    }
    layers.forEach((matrix, layer) => matrix.forEach((row, from) => row.forEach((cell, to) => {
      if (layer > 0) expect(cell.distance).toBeLessThanOrEqual(layers[layer - 1][from][to].distance);
      if (Number.isFinite(cell.distance)) {
        expect(cell.path[0]).toBe(from);
        expect(cell.path[cell.path.length - 1]).toBe(to);
        expect(cell.path.length - 1).toBeLessThanOrEqual(layer + 1);
        expect(cell.path.slice(1).reduce((sum, node, index) => sum + BOOK_GRAPH[cell.path[index]][node], 0)).toBe(cell.distance);
      } else expect(cell.path).toEqual([]);
      if (layer === layers.length - 1) expect(cell.distance).toBe(enumerate(from, to));
    })));
  });
});
