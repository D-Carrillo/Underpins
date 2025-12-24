import {Application, Container, ContainerChild} from "pixi.js";
import {TextNoteComponent} from "./TextNoteComponent.ts";
import {TextNote} from "../notes/TextNote.ts";
import {NotesManager} from "../managers/NoteManager.ts";
import { observe } from "mobx";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {BoardMenu} from "../menus/BoardMenu.ts";
import {ThreadComponent} from "./ThreadComponent.ts";
import { ThreadManager } from "../managers/ThreadManager.ts";

export class Board {
    private readonly stage: Container<ContainerChild>
    private noteMap = new Map<string, Container>();

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
        NotesManager.getNotes().forEach(note => this.makeNoteVisual(note));
    }

    private loadThreads() {
        NotesManager.getNotes().forEach(note => {this.makeThreadVisual(note.id);});
    }

    private observerFunctionForNotes() {
        observe(NotesManager.getNotes(), (change) => {
            if (change.type === "splice") {
                change.added.forEach((note) => {
                    this.makeNoteVisual(note)
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

    private makeNoteVisual(note: TextNote) {
        const singularNoteContainer = new TextNoteComponent(note).makeNote(this.stage);
        this.noteMap.set(note.id, singularNoteContainer);
    }

    private makeThreadVisual(originID: string) {
        ThreadManager.getThreadGraph().returnVertexMap(originID)?.forEach((threadType, destinationID) => {
            new ThreadComponent(this.noteMap.get(originID)!, this.noteMap.get(destinationID)!, threadType).makeThread(this.stage)
        })
    }

    private loadMenu() {
        this.stage.on('rightclick', (event) => {
            if (event.target === this.stage) {
                useContextMenu(event.nativeEvent as MouseEvent, BoardMenu, 'text');
            }
        })
    }
}
