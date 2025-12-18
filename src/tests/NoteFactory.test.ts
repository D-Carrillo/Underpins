import {test, expect} from "vitest";
import {any} from "./anyType.ts";
import {TextNote} from "../notes/TextNote.ts";
import NoteFactory from "../factories/NoteFactory.ts";

test("Note factory makes a TextNote", () => {
    const note = NoteFactory.makeNote(any<number>(), any<number>(), "text");

    expect(note).toBeInstanceOf(TextNote);
});

test("Note factory throws an error trying to make a undefined note type", () => {
   expect(() => NoteFactory.makeNote(any<number>(), any<number>(), "Not-Implemented")).toThrowError("Not implemented");
});
