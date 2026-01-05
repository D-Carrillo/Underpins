import {TextNote} from "../notes/TextNote.ts";
import {NoteTypes} from "./NoteTypesEnum.ts";
import {BaseNote} from "../notes/BaseNote.ts";
import {ImageNote} from "../notes/ImageNote.ts";


class NoteFactory {
    public static makeNote(x: number, y: number, type: NoteTypes, content: string): BaseNote {
        if ( type === NoteTypes.TEXT) {
            return new TextNote("new Note", x, y);
        }

        else if ( type === NoteTypes.IMAGE ) {
            return new ImageNote(content, x, y);
        }

        throw new Error("Not implemented");
    }
}

export default NoteFactory
