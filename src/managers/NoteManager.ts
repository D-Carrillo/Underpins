import {TextNote} from "../notes/TextNote.ts";
import NoteFactory from "../factories/NoteFactory.ts";
import { makeAutoObservable } from "mobx";
import {BaseNote} from "../notes/BaseNote.ts";
import {BlurFilter, Container, ContainerChild, Graphics} from "pixi.js";

class ManagerForNotes{
    private notes: BaseNote[];

    constructor() {
        this.notes = this.loadNotes();
        makeAutoObservable(this);
    }

    public getNotes(): BaseNote[] {
        return this.notes;
    }

    // Functions to implement

    // LoadNotesFromJSON()


    public AddANote(newNote : BaseNote){
        this.notes.push(newNote);
    }

    // SaveNoteToJSON()

    public deleteNote(id: string) {
        const deletingNoteIndex = this.notes.findIndex(note => note.id === id);
        if (deletingNoteIndex !== -1) {
            this.notes.splice(deletingNoteIndex,1);
        }

        //For the note that is being deleted, you have to call the database or JSON to delete from its system by passing the ID
        // Might not need, for a JSON we could just remake the json with the new notes array, maybe on a database the implementation might be different.
    }

    // DeleteNoteFromJSON()
    // UpdateNoteInformation() - highly polymorphic

    public createNote(x: number, y: number, type: string) {
        const newNote = NoteFactory.makeNote(x, y, type);
        this.AddANote(newNote);
        return newNote;
    }

    //Only for when we don't have JSON
    public loadNotes(): BaseNote[] {
        return [new TextNote("Type Here", 100, 200), new TextNote("Type here \n and here", 400, 100), new TextNote("This is the third \n note", 400, 300)];
    }

    public destroyVisualNote(noteVisual: Container<ContainerChild>) {
        noteVisual.destroy({children: true});
    }

    public notesLightUpForSelection(noteMap: Map<string, Container>, originNoteID: string) {
        //Don't really like the blur, but it can be fixed on the aesthetication process
        noteMap.forEach((visual, ID) => {
           if (originNoteID !== ID) {
               const glow = new Graphics().rect(visual.getBounds().x, visual.getBounds().y, visual.width, visual.height).fill("80400B");

               glow.filters = new BlurFilter({strength: 15});

               visual.addChildAt(glow, 0);
           }
        });
    }
}

export const NotesManager = new ManagerForNotes();
