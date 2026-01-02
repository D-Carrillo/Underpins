import { test, expect, describe } from 'vitest';
import { TextNote } from '../notes/TextNote.ts';
import { any } from "./anyType.ts";
import {BaseNoteSharedTests} from "./BaseNote.SharedTests.ts";

describe('Test from parent', () => {
   BaseNoteSharedTests(TextNote);
});

describe("Changing the TextNoteComponent content test", () => {
    test.each([
        ["Let's update"],
        [""],
        ["This".repeat(10)],
        ["x".repeat(270)]
    ])("Changing the TextNoteComponent content", (content) => {
        const note = new TextNote(any<string>(), any<number>(), any<number>());

        note.updateContent(content);

        expect(note.content).toBe(content);
    });
});

test("Content char limit is more than it should be test", () => {
    const note = new TextNote(any<string>(), any<number>(), any<number>());

    const content = "x".repeat(301);

    expect(() => note.updateContent(content)).toThrowError("Overreach char limit in a note");
}); 

test("Note should be initialized to 150x250", () => {
    const note = new TextNote(any<string>(), any<number>(), any<number>());
    
    expect(note.sizes).toEqual({ height:150, width:250 });
}); 
