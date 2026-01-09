import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";
import {NotesManager} from "../managers/NoteManager.ts";
import {any} from "./anyType.ts";
import {TextNote} from "../notes/TextNote.ts";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import {ImageNote} from "../notes/ImageNote.ts";
import {BaseNote} from "../notes/BaseNote.ts";

function setupLoadNotesSpy(mockData: BaseNote[]) {
    return vi.spyOn(Object.getPrototypeOf(NotesManager), 'loadNotes').mockReturnValue(mockData);
}

function resetManagerNotes(notes: BaseNote[]) {
    (NotesManager as any).notes = notes;
    (NotesManager as any).deletedNotes = [];
}

describe("NotesManager Test Suite", () => {
    let spy: any;

    beforeEach(() => {
        const mockNotes = [
            new TextNote(any<string>(), any<number>(), any<number>()),
            new TextNote(any<string>(), any<number>(), any<number>())
        ];

        spy = setupLoadNotesSpy(mockNotes);
        resetManagerNotes(mockNotes);
    });

    afterEach(() => {
        spy.mockRestore();
    });

    test("Manager creates the correct note type", () => {
        const note = NotesManager.createNote(any<number>(), any<number>(), NoteTypes.TEXT, any<string>());

        expect(note).toBeInstanceOf(TextNote);
    });

    test("Manager creates the correct image note type", () => {
        const note = NotesManager.createNote(any<number>(), any<number>(), NoteTypes.IMAGE, any<string>());

        expect(note).toBeInstanceOf(ImageNote);
    });

    test("Note manager deletes correct note", () => {
        const initialNotes = NotesManager.getNotes();
        const targetID = initialNotes[0].id;
        const initialLength = initialNotes.length;

        NotesManager.deleteNote(targetID);

        const updatedNotes = NotesManager.getNotes();
        expect(updatedNotes.length).toBe(initialLength - 1);
        expect(updatedNotes.some(n => n.id === targetID)).toBe(false);
    });

    test("NoteManager adds correct note to the array", () => {
        const newNote = new TextNote(any<string>(), any<number>(), any<number>());
        const initialLength = NotesManager.getNotes().length;

        NotesManager.AddANote(newNote);

        expect(NotesManager.getNotes().length).toBe(initialLength + 1);
        expect(NotesManager.getNotes()).toContain(newNote);
    });

    test("Manager uses mocked notes instead of hardcoded production notes", () => {
        const mockNotes = [
            new TextNote(any<string>(), any<number>(), any<number>()),
            new TextNote(any<string>(), any<number>(), any<number>())
        ];

        resetManagerNotes(mockNotes);

        const notes = NotesManager.getNotes();

        expect(notes.length).toBe(2);
        expect(notes).toEqual(mockNotes);
    });

    test("Redo function returns null if the is no notes in the deleted note array", () => {
        const restoredNote = NotesManager.redoDeletedNote();
        expect(restoredNote).toBe(null);
    });

    test("The Redo function returns the last deleted note", () => {
        const newNoteToDelete = NotesManager.createNote(any<number>(),  any<number>(), NoteTypes.TEXT,  any<string>());

        const before =  Date.now();
        NotesManager.deleteNote(newNoteToDelete.id);
        const after =  Date.now();

        const restoredNote = NotesManager.redoDeletedNote();

        expect(restoredNote).not.toBe(null);
        expect(restoredNote).toBeGreaterThanOrEqual(before);
        expect(restoredNote).toBeLessThanOrEqual(after);
    });
});
