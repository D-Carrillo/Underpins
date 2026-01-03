import {TextNote} from "../notes/TextNote.ts";
import {NoteTypes} from "./NoteTypesEnum.ts";
import {BaseNote} from "../notes/BaseNote.ts";
import {ImageNote} from "../notes/ImageNote.ts";


class NoteFactory {
    public static makeNote(x: number, y: number, type: NoteTypes): BaseNote {
        if ( type === NoteTypes.TEXT) {
            return new TextNote("new Note", x, y);
        }

        else if ( type === NoteTypes.IMAGE ) {
            return Math.random() % 2 === 0 ? new ImageNote("/cabinet.jpg", x, y) : new ImageNote("/television.jpg", x , y);
        }

        throw new Error("Not implemented");
    }
}

export default NoteFactory
