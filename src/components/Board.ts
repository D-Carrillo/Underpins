import {Application, Container, ContainerChild} from "pixi.js";
import {TextNoteComponent} from "./TextNoteComponent.ts";
import {TextNote} from "../notes/TextNote.ts";
import {NotesManager} from "../managers/NoteManager.ts";
import { observe } from "mobx";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {BoardMenu} from "../menus/BoardMenu.ts";

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
        this.observerFunction();

        // app.renderer.on('resize', () => this.OnResize());
    }

    private loadSavedNotes(){
        NotesManager.getNotes().forEach(note => this.createVisualNote(note));
    }

    private observerFunction() {
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

    private loadMenu() {
        this.stage.on('rightclick', (event) => {
            if (event.target === this.stage) {
                useContextMenu(event.nativeEvent as MouseEvent, BoardMenu, 'text');
            }
        })
    }
}

