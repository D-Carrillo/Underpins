import {BaseNote} from "../notes/BaseNote.ts";
import {describe, it, expect, test} from "vitest";
import { any } from "./anyType.ts";
import {ImageNote} from "../notes/ImageNote.ts";

type Constructor<T> = new (content: string, x_coordinate: number, y_coordinate: number) => T;

export function BaseNoteSharedTests<T extends BaseNote>(NoteClass: Constructor<T>)  {
    describe('Standard test for all notes derived from BaseNote', () => {

        it("StickyNote loads information", () => {
            const note = new NoteClass("Information", any<number>(), any<number>());

            expect(note.content).toBe("Information");
        });

        it("Created at the right time", () =>{
            const before = Date.now();
            const note = new NoteClass(any<string>(), any<number>(), any<number>());
            const after = Date.now();

            expect(note.create_at).toBeGreaterThanOrEqual(before);
            expect(note.create_at).toBeLessThanOrEqual(after);
        });


        it("Constructor makes unique IDs", () => {
            const note1 = new NoteClass(any<string>(), any<number>(), any<number>());
            const note2 = new NoteClass(any<string>(), any<number>(), any<number>());

            expect(note1.id).not.toBe(note2.id);
        });

        test.each([
            [0,0],
            [-1,-1],
            [1,1],
            [1,-1],
            [-1,1],
        ])("Creates coordinates (%i, %i)", (x,y) => {
            const note = new NoteClass(any<string>(), x, y);

            expect(note.position.x).toBe(x);
            expect(note.position.y).toBe(y);
        });

        test.each([
            [2,-1],
            [0.43, 333],
            [0,0],
            [-2323333,3333],
            [-12,-44,]
        ])("Change the note's coordinates (%i, %i)", (x,y) => {
            const note = new NoteClass(any<string>(), any<number>(), any<number>());

            note.changeCoordinate(x,y);

            expect(note.position).toEqual({ x, y });
        });

        it("Note z_position is initialized correctly", () => {
           const note = new NoteClass(any<string>(), any<number>(), any<number>());

           expect(note.getZAxisPosition()).toBe(-1);
        });

        it("Note z_position is updated correctly", () => {
           const note = new NoteClass(any<string>(), any<number>(), any<number>());

           note.moveZAxis(2);

           expect(note.getZAxisPosition()).toBe(2);
        });
    });
}