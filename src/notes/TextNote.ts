import {BaseNote} from "./BaseNote.ts";

const INIT_HEIGHT = 150;
const INIT_WIDTH = 250;
const NOTE_CONTENT_LIMIT = 270;

export class TextNote extends BaseNote {
    type = "TextNote";

    constructor(content: string, x_coordinate: number, y_coordinate: number);
    constructor(content: string, x_coordinate: number, y_coordinate: number, id: string, createdAt: number);
    constructor(content: string, x_coordinate: number, y_coordinate: number, id?: string, createdAt?: number) {

        super(content, x_coordinate, y_coordinate, INIT_HEIGHT, INIT_WIDTH, id!, createdAt!);
    }

    updateContent = (newContent: string) => {
        if (newContent.length > NOTE_CONTENT_LIMIT) {throw new Error("Overreach char limit in a note")}

        this.content = newContent;
    };
}
