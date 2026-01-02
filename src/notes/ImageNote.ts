import {BaseNote} from "./BaseNote.ts";

const INIT_HEIGHT = 250;
const INIT_WIDTH = 400;

export class ImageNote extends BaseNote {

    constructor(imageLocation: string, x_coordinate: number, y_coordinate: number ) {
        super(imageLocation, x_coordinate, y_coordinate, INIT_HEIGHT, INIT_WIDTH);
    }

    updateContent = (imageLocation: string): void => {
        this.content = imageLocation;
    }
}