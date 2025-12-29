import {makeAutoObservable} from "mobx";
import {AdjacencyGraph} from "../threads/AdjacencyGraph.ts";
import {NotesManager} from "./NoteManager.ts";
import {BaseThread} from "../threads/BaseThread.ts";
import {Container, ContainerChild} from "pixi.js";

class ManagerForThreads{
    private threadGraph = new AdjacencyGraph();
    private deletedThreads = new Map<string, BaseThread>();

    constructor() {
        makeAutoObservable(this);
        this.loadThreadGraph();
    }

    private loadThreadGraph() {
        this.threadGraph.addEdge(NotesManager.getNotes()[0].id, NotesManager.getNotes()[1].id);
        this.threadGraph.addEdge(NotesManager.getNotes()[2].id, NotesManager.getNotes()[1].id);
    }

    public addThread(originID: string, destinationID: string) {
      this.threadGraph.addEdge(originID, destinationID);
    }

    public getThreadGraph() {
        return this.threadGraph;
    }

    public getSeparateIDs(threadID: string): {originID: string, destinationID: string} {
        const parts = threadID.split('_');

        if(parts.includes('')) {
            throw Error("No Origin or Destination in the thread");
        }

        return {originID: parts[0], destinationID: parts[1]};
    }

    public deleteThread(ID: string){
        if (ID.includes('_')) {
            this.deleteThreadWithThreadID(ID);
        }

        else{
            this.deleteThreadsWithOnlyNoteID(ID);
        }
    }

    public getDeletedThreads = (): Map<string, BaseThread> => this.deletedThreads;

    private deleteThreadsWithOnlyNoteID(noteID: string) {
        const threadID = this.threadGraph.getAllThreadIDsThatConnectTo(noteID);

        threadID.forEach(ID => this.deleteThreadWithThreadID(ID));
    }

    private deleteThreadWithThreadID(threadID: string) {
        const parts = this.getSeparateIDs(threadID);

        this.deletedThreads.set(threadID,  this.threadGraph.returnVertexMap(parts.originID)?.get(parts.destinationID)!);

        this.threadGraph.removeEdge(parts.originID, parts.destinationID);
    }

    //This class is only for testing
    public reset() {
        this.threadGraph.destroyGraph();
        this.deletedThreads.clear();
        this.loadThreadGraph();
    }

    public destroyVisualThread(threadVisual: Container<ContainerChild>, stage: Container<ContainerChild>) {
        stage.removeChild(threadVisual);

        threadVisual.destroy({
            children: true,
            texture: false,
        });
    }
}

export const ThreadManager = new ManagerForThreads();
