import {beforeAll, describe, expect, it, test} from 'vitest';
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
        const hasDestination = Array.from(edges!).some((thread) => thread.getDestination() === dest);

        expect(hasDestination).toBe(true);
    });
});

test("No duplicates occur when trying to add the same destination", () => {
    let graph = new AdjacencyGraph();
    const origin = "VertexID";
    const dest = "DestinationID"

    graph.addEdge(origin, dest);
    graph.addEdge(origin, dest);

    const edges = graph.returnVertexSet(origin);

    expect(edges?.size).toBe(1);

    const count = Array.from(edges!).filter((thread) => thread.getDestination() === dest).length;

    expect(count).toBe(1);
});
