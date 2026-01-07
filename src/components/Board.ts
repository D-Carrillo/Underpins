import {Application, Container, ContainerChild, Graphics} from "pixi.js";
import {TextNoteComponent} from "./TextNoteComponent.ts";
import {NotesManager} from "../managers/NoteManager.ts";
import {observe, reaction} from "mobx";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {BoardMenu} from "../menus/BoardMenu.ts";
import {ThreadComponent} from "./ThreadComponent.ts";
import { ThreadManager } from "../managers/ThreadManager.ts";
import {BaseThread} from "../threads/BaseThread.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseNote} from "../notes/BaseNote.ts";
import {TextNote} from "../notes/TextNote.ts";
import {ImageNoteComponent} from "./ImageNoteComponent.ts";
import {ImageNote} from "../notes/ImageNote.ts";

export class Board {
    private readonly stage: Container<ContainerChild>
    private noteMap = new Map<string, Container>();
    private threadMap = new Map<string, Container>();

    constructor(app: Application) {
        this.stage = app.stage;
        this.stage.eventMode = 'static';
        this.stage.hitArea = app.screen;

        app.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        BoardManager.setNoteMap(() => this.noteMap);
        BoardManager.setStage(this.stage);

        this.loadMenu();
        this.loadSavedNotes();
        this.loadThreads();
        this.saveButton();
        this.observerFunctionForNotes();
        this.observerFunctionForThreads();
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

    private createVisualNote(note: BaseNote) {
        let singularNoteContainer: Container;

        // Need to make a factory for the components - One
        if (note instanceof TextNote) {
            singularNoteContainer = new TextNoteComponent(note, this.stage).makeNote();
        } else if (note instanceof ImageNote){
            singularNoteContainer = new ImageNoteComponent(note, this.stage).makeNote();
        }
        else {
            throw Error("Instance was not of any know type of note");
        }

        this.noteMap.set(note.id, singularNoteContainer);
    }

    private makeThreadVisual(originID: string, destinationID: string, threadType: BaseThread) {
        const singularThreadContainer = new ThreadComponent(this.noteMap.get(originID)!, this.noteMap.get(destinationID)!, threadType).makeThreadWithPins(this.stage)
        this.threadMap.set(threadType.getThreadID(), singularThreadContainer);
    }

    private loadMenu() {
        this.stage.on('rightclick', (event) => {
            if (event.target === this.stage) {
                useContextMenu(event.nativeEvent as MouseEvent, BoardMenu, "note");
            }
        })
    }

    private saveButton() {
        const circle = new Graphics().circle(100, 100, 20).fill(0x00000);

        circle.eventMode = 'static';
        circle.cursor = 'pointer';

        circle.on('pointertap', (event) => {
            event.stopPropagation();
            event.preventDefault();
            NotesManager.SaveNoteToJSON().then(() => alert("Board has been saved"));
            ThreadManager.SaveThreadToJSON().then(() => {});
        });

        this.stage.addChild(circle);
    }
}
