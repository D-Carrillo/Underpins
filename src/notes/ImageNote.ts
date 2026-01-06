import {BaseNote} from "./BaseNote.ts";

const INIT_HEIGHT = 300;
const INIT_WIDTH = 300;

export class ImageNote extends BaseNote {
    type = "image";

    constructor(imageLocation: string, x_coordinate: number, y_coordinate: number ) {
        super(imageLocation, x_coordinate, y_coordinate, INIT_HEIGHT, INIT_WIDTH);
    }

    updateContent = (imageLocation: string): void => {
        this.content = imageLocation;
    }
}