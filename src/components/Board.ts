import {Application, Container, ContainerChild} from "pixi.js";
import {TextNoteComponent} from "./TextNoteComponent.ts";
import {TextNote} from "../notes/TextNote.ts";
import {NotesManager} from "../managers/NoteManager.ts";
import { observe } from "mobx";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {BoardMenu} from "../menus/BoardMenu.ts";
import {ThreadComponent} from "./ThreadComponent.ts";
import { ThreadManager } from "../managers/ThreadManager.ts";
import {BaseThread} from "../threads/BaseThread.ts";

export class Board {
    private readonly stage: Container<ContainerChild>
    private noteMap = new Map<string, Container>();
    private threadMap = new Map<string, Container>

    constructor(app: Application) {
        this.stage = app.stage;
        this.stage.eventMode = 'static';
        this.stage.hitArea = app.screen;

        app.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        this.loadMenu();
        this.loadSavedNotes();
        this.loadThreads();
        this.observerFunctionForNotes();

        // app.renderer.on('resize', () => this.OnResize());
    }

    private loadSavedNotes(){
        NotesManager.getNotes().forEach(note => this.createVisualNote(note));
    }

    private loadThreads() {
        NotesManager.getNotes().forEach(note => {ThreadManager.getThreadGraph().returnVertexMap(note.id)?.forEach((threadType, destinationID) => {this.makeThreadVisual(note.id, destinationID, threadType);})});
    }

    private observerFunctionForNotes() {
        observe(NotesManager.getNotes(), (change) => {
            if (change.type === "splice") {
                change.added.forEach((note) => {
                    this.createVisualNote(note)
                });

                change.removed.forEach((note) => {
                    const visualNote = this.noteMap.get(note.id);

                    if(visualNote) {
                        visualNote.destroy({children: true});

                        this.noteMap.delete(note.id);
                    }
                });
            }
        })
    }

    public update() {
    }

    private createVisualNote(note: TextNote) {
        const singularNoteContainer = new TextNoteComponent(note).makeNote(this.stage);
        this.noteMap.set(note.id, singularNoteContainer);
    }

    private makeThreadVisual(originID: string, destinationID: string, threadType: BaseThread) {
        const singularThreadContainer = new ThreadComponent(this.noteMap.get(originID)!, this.noteMap.get(destinationID)!, threadType).makeThread(this.stage)
        this.threadMap.set(originID + destinationID, singularThreadContainer);
    }

    private loadMenu() {
        this.stage.on('rightclick', (event) => {
            if (event.target === this.stage) {
                useContextMenu(event.nativeEvent as MouseEvent, BoardMenu, 'text');
            }
        })
    }
}

