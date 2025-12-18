import {BaseNote} from "./BaseNote.ts";

const INIT_HEIGHT = 150;
const INIT_WIDTH = 250;
const NOTE_CONTENT_LIMIT = 270;

export class TextNote extends BaseNote
{
    constructor(content: string, x_coordinate: number, y_coordinate: number)
    {
        super(content, x_coordinate, y_coordinate, INIT_HEIGHT, INIT_WIDTH);
    }

    updateContent = (newContent: string) => {
        if (newContent.length > NOTE_CONTENT_LIMIT) {throw new Error("Overreach char limit in a note")}

        this.content = newContent;
    };
}
