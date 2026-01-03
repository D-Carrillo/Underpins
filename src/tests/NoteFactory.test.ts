import {expect, test} from "vitest";
import {any} from "./anyType.ts";
import {TextNote} from "../notes/TextNote.ts";
import NoteFactory from "../factories/NoteFactory.ts";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import {ImageNote} from "../notes/ImageNote.ts";

test("Note factory makes a TextNote", () => {
    const note = NoteFactory.makeNote(any<number>(), any<number>(), NoteTypes.TEXT);

    expect(note).toBeInstanceOf(TextNote);
});

test("Note factory makes a TextNote", () => {
    const note = NoteFactory.makeNote(any<number>(), any<number>(), NoteTypes.IMAGE);

    expect(note).toBeInstanceOf(ImageNote);
});

test("Note factory throws an error trying to make a undefined note type", () => {
   expect(() => NoteFactory.makeNote(any<number>(), any<number>(), any<NoteTypes>())).toThrowError("Not implemented");
});
