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
    public static loadNote(type: string, x: number, y: number, content: string, id: string, createAt: number ): BaseNote {
        if ( type === "TextNote") {
            return new TextNote("new Note", x, y, id, createAt);
        }

        else if ( type === "ImageNote" ) {
            return new ImageNote(content, x, y, id, createAt);
        }

        throw new Error("Not implemented");
    }
}

export default NoteFactory
