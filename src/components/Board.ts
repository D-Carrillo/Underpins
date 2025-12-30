import {Application, Container, ContainerChild} from "pixi.js";
import {TextNoteComponent} from "./TextNoteComponent.ts";
import {TextNote} from "../notes/TextNote.ts";
import {NotesManager} from "../managers/NoteManager.ts";
import {observe, reaction} from "mobx";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {BoardMenu} from "../menus/BoardMenu.ts";
import {ThreadComponent} from "./ThreadComponent.ts";
import { ThreadManager } from "../managers/ThreadManager.ts";
import {BaseThread} from "../threads/BaseThread.ts";
import {BoardManager} from "../managers/BoardManager.ts";

export class Board {
    private readonly stage: Container<ContainerChild>
    private noteMap = new Map<string, Container>();
    private threadMap = new Map<string, Container>();

    constructor(app: Application) {
        this.stage = app.stage;
        this.stage.eventMode = 'static';
        this.stage.hitArea = app.screen;

        app.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        this.loadMenu();
        this.loadSavedNotes();
        this.loadThreads();
        this.observerFunctionForNotes();
        this.observerFunctionForThreads();

        BoardManager.setNoteMap(() => this.noteMap);
        BoardManager.setStage(this.stage);

        // app.renderer.on('resize', () => this.OnResize());
    }

    private loadSavedNotes(){
        NotesManager.getNotes().forEach(note => this.createVisualNote(note));
    }

    private loadThreads() {
        NotesManager.getNotes().forEach(note => {ThreadManager.getThreadGraph().returnVertexMap(note.id)?.forEach((threadType, destinationID) => { if(!this.threadMap.has(threadType.getThreadID())) this.makeThreadVisual(note.id, destinationID, threadType);})});
    }

    private observerFunctionForNotes() {
        observe(NotesManager.getNotes(), (change) => {
            if (change.type === "splice") {
                change.added.forEach((note) => {
                    this.createVisualNote(note)
                });

                change.removed.forEach((note) => {
                    const visualNote = this.noteMap.get(note.id);
                    ThreadManager.deleteThread(note.id);

                    if(visualNote) {
                        NotesManager.destroyVisualNote(visualNote);
                        this.noteMap.delete(note.id);
                    }
                });
            }
        });
    }

    private observerFunctionForThreads() {
        reaction(() => ThreadManager.getDeletedThreads().length, (_, oldLength) => {
            const newlyDeletedID = Array.from(ThreadManager.getDeletedThreads()).slice(oldLength);
            console.log("Delete thread observer has been called");

            newlyDeletedID.forEach((thread) => {
                const threadID= thread.ID;
                const visualThread = this.threadMap.get(threadID);

                if (visualThread) {
                    ThreadManager.destroyVisualThread(visualThread, this.stage);
                    this.threadMap.delete(threadID)
                }
            });
        });

        reaction(() => ThreadManager.getRecentlyAddedThreads().length, () => {
           this.loadThreads();
        });
    }

    public update() {
    }

    private createVisualNote(note: TextNote) {
        const singularNoteContainer = new TextNoteComponent(note).makeNote(this.stage);
        this.noteMap.set(note.id, singularNoteContainer);
    }

    private makeThreadVisual(originID: string, destinationID: string, threadType: BaseThread) {
        const singularThreadContainer = new ThreadComponent(this.noteMap.get(originID)!, this.noteMap.get(destinationID)!, threadType).makeThreadWithPins(this.stage)
        this.threadMap.set(threadType.getThreadID(), singularThreadContainer);
    }

    private loadMenu() {
        this.stage.on('rightclick', (event) => {
            if (event.target === this.stage) {
                useContextMenu(event.nativeEvent as MouseEvent, BoardMenu, 'text');
            }
        })
    }
}
