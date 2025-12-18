import {test, expect} from "vitest";
import {NotesManager} from "../managers/NoteManager.ts";
import {any} from "./anyType.ts";
import {TextNote} from "../notes/TextNote.ts";


test("Manager creates the correct note type", () => {
    const note = NotesManager.createNote(any<number>(), any<number>(), "text");

    expect(note).toBeInstanceOf(TextNote);
});

test("Exception is passed to the Manager", () => {
    expect(() => NotesManager.createNote(any<number>(), any<number>(), "Not-Implemented")).toThrowError("Not implemented");
});
