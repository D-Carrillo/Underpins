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

    // This would be removed once the factory is fully finish and once the Enum is passed into the JSON
    public static loadNote(type: string, x: number, y: number, content: string, id: string, createAt: number, z_position: number): BaseNote {
        if ( type === "TextNote") {
            const note = new TextNote(content, x, y, id, createAt);
            note.moveZAxis(z_position);
            return note
        }

        else if ( type === "ImageNote" ) {
            const note = new ImageNote(content, x, y, id, createAt);
            note.moveZAxis(z_position);
            return note
        }

        throw new Error("Not implemented");
    }
}

export default NoteFactory
