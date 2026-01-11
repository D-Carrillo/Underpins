import {Container} from "pixi.js";

class ManagerForBoards {
    private noteMap: (() => Map<string, Container>)  | null = null;
    private viewport: Container | null = null;
    public draggingMode = false;

    public setNoteMap(map: (() => Map<string, Container>)) {
        this.noteMap = map;
    }

    public setViewport(stage: Container) {
        this.viewport = stage;
    }

    public getNote(id: string): Container | undefined {
        return this.noteMap!().get(id);
    }

    public getNoteMap(): Map<string, Container> {
        if(!this.noteMap){
            throw Error("NoteMap getter not set");
        }

        return this.noteMap();
    }

    public getViewport(): Container | null{
        return this.viewport;
    }
}

export const BoardManager = new ManagerForBoards();
