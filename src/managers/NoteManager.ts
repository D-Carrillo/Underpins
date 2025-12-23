import {TextNote} from "../notes/TextNote.ts";
import NoteFactory from "../factories/NoteFactory.ts";
import { makeAutoObservable } from "mobx";

class ManagerForNotes{
    private notes: TextNote[];

    constructor() {
        this.notes = this.loadNotes();
        makeAutoObservable(this);
    }

    public getNotes(): TextNote[] {
        return this.notes;
    }

    // Functions to implement

    // LoadNotesFromJSON()


    AddANote(newNote : TextNote){
        this.notes.push(newNote);
    }

    // SaveNoteToJSON()

    deleteNote(id: string) {
        const deletingNoteIndex = this.notes.findIndex(note => note.id === id);
        if (deletingNoteIndex !== -1) {
            this.notes.splice(deletingNoteIndex,1);
        }

        //For the note that is being deleted, you have to call the database or JSON to delete from its system by passing the ID
        // Might not need, for a JSON we could just remake the json with the new notes array, maybe on a database the implementation might be different.
    }

    // DeleteNoteFromJSON()
    // UpdateNoteInformation() - highly polymorphic

    createNote(x: number, y: number, type: string) {
        const newNote = NoteFactory.makeNote(x, y, type);
        this.AddANote(newNote);
        return newNote;
    }

    //Only for when we don't have JSON
    loadNotes(): TextNote[] {
        return [new TextNote("Type Here", 100, 200), new TextNote("Type here \n and here", 400, 100)];
    }

}

export const NotesManager = new ManagerForNotes();