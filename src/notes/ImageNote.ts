import {BaseNote} from "./BaseNote.ts";

const INIT_HEIGHT = 300;
const INIT_WIDTH = 300;

export class ImageNote extends BaseNote {
    type = "ImageNote";

    constructor(imageLocation: string, x_coordinate: number, y_coordinate: number);
    constructor(imageLocation: string, x_coordinate: number, y_coordinate: number, id: string, createdAt: number);
    constructor(imageLocation: string, x_coordinate: number, y_coordinate: number, id?: string, createdAt?: number) {

        super('ImageNote', imageLocation, x_coordinate, y_coordinate, INIT_HEIGHT, INIT_WIDTH, id!, createdAt!);
    }

    updateContent = (imageLocation: string): void => {
        this.content = imageLocation;
    }
}