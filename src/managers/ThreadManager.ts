import {makeAutoObservable} from "mobx";
import {AdjacencyGraph} from "../threads/AdjacencyGraph.ts";
import {BaseThread} from "../threads/BaseThread.ts";
import {Container, ContainerChild} from "pixi.js";
import {invoke} from "@tauri-apps/api/core";

class ManagerForThreads{
    private threadGraph = new AdjacencyGraph();
    private deletedThreads : {ID: string, threadType: BaseThread}[] = [];
    private recentlyAdded : string[] = [];

    constructor() {
        makeAutoObservable(this);
        this.loadThreadGraphFromJSON().then(threads => threads.forEach(thread => this.loadThread(thread)));
    }

    private async loadThreadGraphFromJSON() {
        try {
            return await invoke<{
                color: string,
                id: string,
            }[]>("load_threads_from_json");
        } catch (error) {
            console.error("Failed to load threads: ", error);
            return [];
        }
    }

    public async SaveThreadToJSON() {
        try {
            await invoke('save_threads_to_json', {data: this.threadGraph.getBaseThreads()})
        } catch (error) {
            console.error("Could not save threads to JSON", error);
        }
    }

    private loadThread(thread: {color: string, id: string}) {
        const connectedNotes = this.getSeparateIDs(thread.id);
        this.addThread(connectedNotes.originID, connectedNotes.destinationID)
    }

    public addThread(originID: string, destinationID: string) {
      this.threadGraph.addEdge(originID, destinationID);
      this.recentlyAdded.push(originID + '_' + destinationID);
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

    public getDeletedThreads = (): {ID: string, threadType: BaseThread}[] => this.deletedThreads;

    public getRecentlyAddedThreads = (): string[] => this.recentlyAdded;

    private deleteThreadsWithOnlyNoteID(noteID: string) {
        const threadID = this.threadGraph.getAllThreadIDsThatConnectTo(noteID);

        if (threadID.length <= 0) {
            return;
        }

        threadID.forEach(ID => this.deleteThreadWithThreadID(ID));
    }

    private deleteThreadWithThreadID(threadID: string) {
        const parts = this.getSeparateIDs(threadID);

        this.deletedThreads.push({ID: threadID,  threadType: this.threadGraph.returnVertexMap(parts.originID)?.get(parts.destinationID)!});

        this.threadGraph.removeEdge(parts.originID, parts.destinationID);
    }

    //This class is only for testing
    public reset() {
        this.threadGraph.destroyGraph();
        this.deletedThreads.length = 0;
        this.loadThreadGraphFromJSON();
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
