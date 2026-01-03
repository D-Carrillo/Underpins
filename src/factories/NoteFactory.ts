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
            return new ImageNote("/cabinet.jpg", x, y);
        }

        throw new RangeError("Not implemented");
    }
}

export default NoteFactory
