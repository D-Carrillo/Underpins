import {expect, test} from "vitest";
import {NotesManager} from "../managers/NoteManager.ts";
import {any} from "./anyType.ts";
import {TextNote} from "../notes/TextNote.ts";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import {ImageNote} from "../notes/ImageNote.ts";

test("Manager creates the correct note type", () => {
    const note = NotesManager.createNote(any<number>(), any<number>(), NoteTypes.TEXT);

    expect(note).toBeInstanceOf(TextNote);
});

test("Manager creates the correct note type", () => {
    const note = NotesManager.createNote(any<number>(), any<number>(), NoteTypes.IMAGE);

    expect(note).toBeInstanceOf(ImageNote);
});

test("Exception is passed to the Manager", () => {
    expect(() => NotesManager.createNote(any<number>(), any<number>(), any<NoteTypes>())).toThrowError("Not implemented");
});

test(" Note manager deletes correct note", () => {
    const ID = NotesManager.getNotes()[1].id;
    const noteArrayLength = NotesManager.getNotes().length;

    NotesManager.deleteNote(ID);
    const noteArrayLengthAfterDeletion = NotesManager.getNotes().length;

    expect(noteArrayLength - 1).toBe(noteArrayLengthAfterDeletion);

    const noteIsOnTheNoteArray = NotesManager.getNotes().some(note => note.id === ID);

    expect(noteIsOnTheNoteArray).toBe(false);
});

test("NoteManager add correct note to the Note Array", () => {
    const newNote = new TextNote(any<string>(), any<number>(), any<number>());

    const noteArrayLength = NotesManager.getNotes().length;
    NotesManager.AddANote(newNote);
    const noteArrayLengthAfterAddition = NotesManager.getNotes().length;

    expect(noteArrayLength + 1).toBe(noteArrayLengthAfterAddition);

    const noteArrayContainsNewNote = NotesManager.getNotes().includes(newNote);

    expect(noteArrayContainsNewNote).toBe(true);
});
