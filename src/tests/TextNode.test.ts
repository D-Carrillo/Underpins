import { test, expect, describe } from 'vitest';
import { TextNode } from '../notes/TextNode.ts';

function any<T>(): T {
    return undefined as unknown as T;
}
test("SkickyNote loads information", () => {
    const note = new TextNode("Information", any<number>(), any<number>());

    expect(note.content).toBe("Information");
});

test("Created at the right time", () =>{
    const before = Date.now();
    const note = new TextNode(any<string>(), any<number>(), any<number>()); 
    const after = Date.now();

    expect(note.createAt).toBeGreaterThanOrEqual(before);
    expect(note.createAt).toBeLessThanOrEqual(after);
});

test("Constructor makes unique IDs", () => {
    const note1 = new TextNode(any<string>(), any<number>(), any<number>());
    const note2 = new TextNode(any<string>(), any<number>(), any<number>());

    expect(note1.id).not.toBe(note2.id);
});

describe("Coordinate loading test", () => {
    test.each([
    [0,0], 
    [-1,-1],
    [1,1],
    [1,-1],
    [-1,1],
])("Creates cordinates (%i, %i)", (x,y) => {
    const note = new TextNode(any<string>(), x, y); 

    expect(note.position.x).toBe(x);
    expect(note.position.y).toBe(y);
    });
});

describe("Changing the coodinates test", () => {
    test.each([
        [2,-1],
        [0.43, 333], 
        [0,0],
        [-2323333,3333],
        [-12,-44,]
    ])("Change the note's coordinates (%i, %i)", (x,y) => {
        const note = new TextNode(any<string>(), any<number>(), any<number>());

        note.changeCoordinate(x,y);

        expect(note.position).toEqual({ x, y });
    });
});

describe("Changing the TextNote content test", () => {
    test.each([
        ["Let's update"],
        [""],
        ["This".repeat(10)],
        ["x".repeat(300)]
    ])("Changing the TextNode content", (content) => {
        const note = new TextNode(any<string>(), any<number>(), any<number>());

        note.updateContent(content);

        expect(note.content).toBe(content);
    });
});

test("Content char limit is more than it should be test", () => {
    const note = new TextNode(any<string>(), any<number>(), any<number>());

    var content = "x".repeat(301);
    
    expect(() => note.updateContent(content)).toThrowError("Overreach char limit in a note");
}); 

test("Note should be initialized to 100x100", () => {
    const note = new TextNode(any<string>(), any<number>(), any<number>());
    
    expect(note.sizes).toEqual({ height:100, width:100 });
}); 
