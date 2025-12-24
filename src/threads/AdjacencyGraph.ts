import {BaseThread} from "./BaseThread.ts";

export class AdjacencyGraph {
    private adjacentList: Map<string, Map<string, BaseThread>>;

    constructor() {
        this.adjacentList = new Map<string, Map<string, BaseThread>>();
    }

    private addVertex(vertexID: string) {
        if (!this.adjacentList.has(vertexID)) {
            this.adjacentList.set(vertexID, new Map<string, BaseThread>());
        }
    }

    public addEdge(vertexID: string, destinationVertexID: string) {
        if (!this.adjacentList.has(vertexID)) {
            this.addVertex(vertexID);
        }

        if (this.adjacentList.get(vertexID)?.has(destinationVertexID)){ return }

        this.adjacentList.get(vertexID)?.set(destinationVertexID, new BaseThread(vertexID + '_' + destinationVertexID));
    }

    public removeEdge = (vertexID: string, destinationID: string) => this.adjacentList.get(vertexID)?.delete(destinationID);

    public removeVertex(vertexID: string) {
        this.adjacentList.delete(vertexID);
    }

    public getVertexesAmount = (): number => this.adjacentList.size;

    public containsVertex = (vertexID: string ): boolean => this.adjacentList.has(vertexID);

    public returnVertexMap = (vertexID: string)  => this.adjacentList.get(vertexID);
}
