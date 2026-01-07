import NoteFactory from "../factories/NoteFactory.ts";
import {makeAutoObservable} from "mobx";
import {BaseNote} from "../notes/BaseNote.ts";
import {BlurFilter, Container, ContainerChild, Graphics} from "pixi.js";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import {invoke} from "@tauri-apps/api/core";

class ManagerForNotes{
    private readonly notes: BaseNote[];

    constructor() {
        this.notes = [];
        this.loadNotes().then(results => results.forEach(note => this.makeNotes(note)));
        makeAutoObservable(this);
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
            console.error("Could not save to JSON", error);
        }

        // This function should return something to continue on the program.
    }

    public deleteNote(id: string) {
        const deletingNoteIndex = this.notes.findIndex(note => note.id === id);
        if (deletingNoteIndex !== -1) {
            this.notes.splice(deletingNoteIndex,1);
        }

        //For the note that is being deleted, you have to call the database or JSON to delete from its system by passing the ID
        // Might not need, for a JSON we could just remake the json with the new notes array, maybe on a database the implementation might be different.
    }

    // DeleteNoteFromJSON()

    public createNote(x: number, y: number, type: NoteTypes, content: string) {
        const newNote = NoteFactory.makeNote(x, y, type, content);
        this.AddANote(newNote);
        return newNote;
    }

    public async loadNotes() {
        try {
            const result =  await invoke<{type: string, create_at: number, content: string, id: string, position: {x: number, y: number}, size: {height: number, width:number}}[]>('load_notes_from_json');
            console.log(result);
            return result;
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
}

export const NotesManager = new ManagerForNotes();
