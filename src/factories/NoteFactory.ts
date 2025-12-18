import {TextNote} from "../notes/TextNote.ts";

class NoteFactory {
    public static makeNote(x: number, y: number, type: string): TextNote {
        //Make the types an Enum
        if ( type === "text" ) {
            return new TextNote("new Note", x, y);
        }

        throw new RangeError("Not implemented");
    }
}

export default NoteFactory
