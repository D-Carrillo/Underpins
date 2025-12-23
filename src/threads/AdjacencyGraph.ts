import {BaseThread} from "./BaseThread.ts";

export class AdjacencyGraph {
    private adjacentList: {[keyof: string]: Set<BaseThread>};

    constructor() {
        this.adjacentList = {};
    }

    private addVertex(vertexID: string) {
        if ( !this.adjacentList[vertexID]) {
            this.adjacentList[vertexID] = new Set<BaseThread>();
        }
    }

    public addEdge(vertexID: string, destinationVertexID: string) {
        if (!this.adjacentList[vertexID]) {
            this.addVertex(vertexID);
        }

        this.adjacentList[vertexID].add(new BaseThread(destinationVertexID));
    }

    public removeEdge = (vertexID: string, destinationVertex: BaseThread) => this.adjacentList[vertexID].delete(destinationVertex);

    public removeVertex(vertexID: string) {
        if (!this.adjacentList[vertexID]){
            return;
        }

        this.adjacentList[vertexID].forEach((thread: BaseThread) => this.removeEdge(vertexID, thread));

        delete this.adjacentList[vertexID];
    }
}
