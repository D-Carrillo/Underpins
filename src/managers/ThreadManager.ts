import {makeAutoObservable} from "mobx";
import {AdjacencyGraph} from "../threads/AdjacencyGraph.ts";
import {NotesManager} from "./NoteManager.ts";
import {BaseThread} from "../threads/BaseThread.ts";

class ManagerForThreads{
    private threadGraph = new AdjacencyGraph();
    private deletedThreads: {ID: string, thread: BaseThread}[] = [];

    constructor() {
        makeAutoObservable(this);
        this.loadThreadGraph();
    }

    private loadThreadGraph() {
        this.threadGraph.addEdge(NotesManager.getNotes()[0].id, NotesManager.getNotes()[1].id);
    }

    public getThreadGraph() {
        return this.threadGraph;
    }

    public getSeparateIDs(threadID: string): {originID: string, destinationID: string} {
        const parts = threadID.split("_");
        return {originID: parts[0], destinationID: parts[1]};
    }

    public deleteThread(threadID: string) {
        const parts = this.getSeparateIDs(threadID);

        this.deletedThreads.push({ID: threadID, thread: this.threadGraph.returnVertexMap(parts.originID)?.get(parts.destinationID)!});

        this.threadGraph.removeEdge(parts.originID, parts.destinationID);
    }

    public getDeletedThreads = ():{ID: string, thread: BaseThread}[] => this.deletedThreads;
}

export const ThreadManager = new ManagerForThreads();
