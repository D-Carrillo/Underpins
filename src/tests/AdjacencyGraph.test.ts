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

    expect(edges).not.toBeDefined();
});

test("Remove edges function only removes the wanted edges", () => {
    let graph = new AdjacencyGraph();
    const origin = "VertexID";
    const dest = "DestinationID"
    const dest2 = "DestinationID2";

    graph.addEdge(origin, dest);
    graph.addEdge(origin, dest2);

    graph.removeEdge(origin, dest);

    const edges = graph.returnVertexMap(origin);

    expect(edges?.size).toBe(1);
    expect(edges?.has(dest2)).toBe(true);
});

test("Remove vertex function actually removes the wanted vertex", () => {
    let graph = new AdjacencyGraph();

    graph.addEdge("origin", "dest1");
    graph.addEdge("origin", "dest2");
    graph.addEdge("origin", "dest3");

    graph.removeVertex("origin");

    const edges = graph.returnVertexMap("origin");

    expect(edges?.size).toBe(undefined);

    expect(graph.containsVertex("origin")).toBe(false);
});

test( "getAllThreadIDsThatConnectTo a note ID should return a list of the correct ThreadIDs", () => {
    let graph = new AdjacencyGraph();

    graph.addEdge("target", "dest1");
    graph.addEdge("origin", "target");
    graph.addEdge("origin", "dest2");
    graph.addEdge("target", "dest3");

    const results = graph.getAllThreadIDsThatConnectTo("target");

    expect(results.length).toBe(3);

    expect(results).contains('target_dest1');
    expect(results).contains('origin_target');
    expect(results).contains('target_dest3');

    expect(results).not.contains("origin_dest2");
});

test("getAllThreadIDThatConnectTo would return a [] if the Note does not form part of any thread", () => {
    let graph = new AdjacencyGraph();

    graph.addEdge("target", "dest1");
    graph.addEdge("origin", "target");

    const results = graph.getAllThreadIDsThatConnectTo("NotInTheGraph");

    expect(results.length).toBe(0);
});
