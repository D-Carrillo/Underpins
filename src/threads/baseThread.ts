import {BaseNote} from "../notes/BaseNote.ts";

export class baseThread {
    private readonly destination: BaseNote;
    private readonly color: string = "#8b0000";

    constructor(destination: BaseNote) {
        this.destination = destination;
    }

    public getDestination = (): BaseNote => this.destination;

    public getColor = ():string => this.color;
}
