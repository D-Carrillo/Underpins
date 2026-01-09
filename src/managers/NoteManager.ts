import NoteFactory from "../factories/NoteFactory.ts";
import {makeAutoObservable} from "mobx";
import {BaseNote} from "../notes/BaseNote.ts";
import {BlurFilter, Container, ContainerChild, Graphics} from "pixi.js";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import {invoke} from "@tauri-apps/api/core";

class ManagerForNotes{
    private readonly notes: BaseNote[] = [];
    private deletedNotes: {note: BaseNote, date: number}[]= [];

    constructor() {
        makeAutoObservable(this);
        this.loadNotes().then(results => results.forEach(note => this.makeNotes(note)));
    }

    public createNote(x: number, y: number, type: NoteTypes, content: string) {
        const newNote = NoteFactory.makeNote(x, y, type, content);
        this.AddANote(newNote);
        return newNote;
    }

    private makeNotes(note: {type: string, create_at: number, content: string, id: string, position: {x: number, y: number}, size: {height: number, width:number}}) {
        const loadedNote = NoteFactory.loadNote(note.type, note.position.x, note.position.y, note.content, note.id, note.create_at);
        this.notes.push(loadedNote);
    }

    public getNotes(): BaseNote[] {
        return this.notes;
    }

    public AddANote(newNote : BaseNote){
        this.notes.push(newNote);
    }

    public async SaveNoteToJSON() {
        try {
            await invoke('save_notes_to_json', {data: this.notes});
        } catch (error) {
            console.error("Could not save notes to JSON", error);
        }
    }

    public deleteNote(id: string) {
        const deletingNoteIndex = this.notes.findIndex(note => note.id === id);
        if (deletingNoteIndex !== -1) {
            const deletedNote = this.notes.splice(deletingNoteIndex,1);

            if (deletedNote.length === 1) {
                this.deletedNotes.push({note: deletedNote[0],  date:  Date.now()});
            }
        }
    }

    public async loadNotes() {
        try {
            return await invoke<{
                type: string,
                create_at: number,
                content: string,
                id: string,
                position: { x: number, y: number },
                size: { height: number, width: number }
            }[]>('load_notes_from_json');
        } catch (error) {
            console.error("Failed to load notes: ", error);
            return [];
        }
    }

    public destroyVisualNote(noteVisual: Container<ContainerChild>) {
        noteVisual.destroy({children: true});
    }

    public notesLightUpForSelection(noteMap: Map<string, Container>, originNoteID: string) {
        //Don't really like the blur, but it can be fixed on the aesthetication process
        noteMap.forEach((visual, ID) => {
           if (originNoteID !== ID) {
               const glow = new Graphics().rect(visual.getLocalBounds().x, visual.getLocalBounds().y, visual.width, visual.height).fill("0x000000");

               glow.filters = new BlurFilter({strength: 15});

               visual.addChildAt(glow, 0);
           }
        });
    }

    public notesStopLightingUp(noteMap: Map<string, Container>, originNoteID: string) {
        noteMap.forEach((visual, ID) => {
            if(originNoteID !== ID) {
                const glowChild = visual.getChildAt(0);
                visual.removeChild(glowChild);
                glowChild.destroy({children: true});
            }
        });
    }

    public redoDeletedNote(): number | null {
        const lastDeletedNote = this.deletedNotes.pop();

        if (lastDeletedNote) {
            this.makeNotes({type: lastDeletedNote.note.type, create_at: lastDeletedNote.note.create_at, content: lastDeletedNote.note.content, id: lastDeletedNote.note.id, position: lastDeletedNote.note.position, size: lastDeletedNote.note.sizes});
        }

        return lastDeletedNote?.date || null;
    }
}

export const NotesManager = new ManagerForNotes();
