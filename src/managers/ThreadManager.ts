import {makeAutoObservable} from "mobx";
import {AdjacencyGraph} from "../threads/AdjacencyGraph.ts";
import {NotesManager} from "./NoteManager.ts";

class ManagerForThreads{
    private threadGraph = new AdjacencyGraph();

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
}

export const ThreadManager = new ManagerForThreads();
