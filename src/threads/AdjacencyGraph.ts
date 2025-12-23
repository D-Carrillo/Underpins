import {BaseThread} from "./BaseThread.ts";

export class AdjacencyGraph {
    private adjacentList: Map<string, Set<BaseThread>>;

    constructor() {
        this.adjacentList = new Map<string, Set<BaseThread>>();
    }

    private addVertex(vertexID: string) {
        if (!this.adjacentList.has(vertexID)) {
            this.adjacentList.set(vertexID, new Set<BaseThread>());
        }
    }

    public addEdge(vertexID: string, destinationVertexID: string) {
        if (!this.adjacentList.has(vertexID)) {
            this.addVertex(vertexID);
        }

        if (Array.from(this.adjacentList.get(vertexID)!).some(thread => thread.getDestination() === destinationVertexID)){ return }

        this.adjacentList.get(vertexID)?.add(new BaseThread(destinationVertexID));
    }

    public removeEdge = (vertexID: string, destinationID: string) => this.adjacentList.get(vertexID)?.delete(this.getDestinationThreadByID(vertexID, destinationID));

    private getDestinationThreadByID(vertexID: string, destinationID: string):BaseThread{
        return Array.from(this.adjacentList.get(vertexID)!).filter((thread => thread.getDestination() === destinationID))[0];
    }

    public removeVertex(vertexID: string) {
        if (!this.adjacentList.has(vertexID)){
            return;
        }

        this.adjacentList.get(vertexID)?.forEach((thread: BaseThread) => this.removeEdge(vertexID, thread));

        this.adjacentList.delete(vertexID);
    }

    public getVertexesAmount = (): number => this.adjacentList.size;

    public containsVertex = (vertexID: string ): boolean => this.adjacentList.has(vertexID);

    public returnVertexSet = (vertexID: string): Set<BaseThread> | undefined => this.adjacentList.get(vertexID);
}
