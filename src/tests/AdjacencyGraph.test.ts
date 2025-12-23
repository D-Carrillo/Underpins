import {beforeAll, describe, expect, it} from 'vitest';
import {AdjacencyGraph} from "../threads/AdjacencyGraph.ts";
import {BaseThread} from "../threads/BaseThread.ts";

describe("Adjacency Graph tests", () => {
    let graph = new AdjacencyGraph();
    const origin = "VertexID";
    const dest = "DestinationID"
    let edges: Set<BaseThread> | undefined;

    beforeAll(() => {
        graph.addEdge(origin, dest);
        edges = graph.returnVertexSet(origin)
    })

    it('should contain only one vertex', () => {
        expect(graph.containsVertex(origin)).toBe(true);
        expect(graph.getVertexesAmount()).toBe(1);
    });

    it('should have a set with only one element for the origin vertex', () => {
        expect(edges).toBeDefined();
        expect(edges?.size).toBe(1);
    });

    it('should create the right thread with the right destination', () => {
        const hasDestination = Array.from(edges!).some((thread: BaseThread) => thread.getDestination() === dest);

        expect(hasDestination).toBe(true);
    });
});
