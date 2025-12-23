import {beforeAll, describe, expect, it, test} from 'vitest';
import {AdjacencyGraph} from "../threads/AdjacencyGraph.ts";
import {BaseThread} from "../threads/BaseThread.ts";

describe("Adjacency Graph tests", () => {
    let graph: AdjacencyGraph;
    const origin = "VertexID";
    const dest = "DestinationID";
    let edges: Map<string, BaseThread> | undefined;

    beforeAll(() => {
        graph = new AdjacencyGraph();
        graph.addEdge(origin, dest);
        edges = graph.returnVertexMap(origin);
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
        const hasDestination = edges?.has(dest);

        expect(hasDestination).toBe(true);
    });
});

test("No duplicates occur when trying to add the same destination", () => {
    let graph = new AdjacencyGraph();
    const origin = "VertexID";
    const dest = "DestinationID"

    graph.addEdge(origin, dest);
    graph.addEdge(origin, dest);

    const edges = graph.returnVertexMap(origin);

    expect(edges?.size).toBe(1);

    const count = edges?.size;

    expect(count).toBe(1);
});

test("Remove edges function actually removes the wanted edges", () => {
    let graph = new AdjacencyGraph();
    const origin = "VertexID";
    const dest = "DestinationID"

    graph.addEdge(origin, dest);

    graph.removeEdge(origin, dest);

    const edges = graph.returnVertexMap(origin);

    expect(edges?.size).toBe(0);

    const count = edges?.size;

    expect(count).toBe(0);
})

test("Remove vertex function actually removes the wanted vertex", () => {
    let graph = new AdjacencyGraph();

    graph.addEdge("origin", "dest1");
    graph.addEdge("origin", "dest2");
    graph.addEdge("origin", "dest3");

    graph.removeVertex("origin");

    const edges = graph.returnVertexMap("origin");

    expect(edges?.size).toBe(undefined);

    expect(graph.containsVertex("origin")).toBe(false);
})
