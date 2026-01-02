import {describe, expect, test} from "vitest";
import {BaseNoteSharedTests} from "./BaseNote.SharedTests.ts";
import {ImageNote} from "../notes/ImageNote.ts";
import { any } from "./anyType.ts";


describe("Test from parent", () => {
    BaseNoteSharedTests(ImageNote);
});

test("Changing the ImageLocation", () => {
    const note = new ImageNote(any<string>(), any<number>(), any<number>());

    note.updateContent('NewImageURL');

    expect(note.content).toBe('NewImageURL');
});

test("Image note should be initialized to 250 x 400", () => {
    const note = new ImageNote(any<string>(), any<number>(), any<number>());

    expect(note.sizes).toEqual({ height: 250, width: 400});
});