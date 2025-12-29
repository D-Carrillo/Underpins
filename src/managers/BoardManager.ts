import {Container, ContainerChild} from "pixi.js";

class ManagerForBoards {
    private noteMap: Map<string, Container> | null = null;
    private stage: Container<ContainerChild> | null = null;

    public setNoteMap(map: Map<string, Container>) {
        this.noteMap = map;
    }

    public setStage(stage: Container<ContainerChild>) {
        this.stage = stage;
    }

    public getNote(id: string): Container | undefined {
        return this.noteMap?.get(id);
    }

    public getNoteMap(): Map<string, Container> {
        return this.noteMap!;
    }

    public getStage(): Container<ContainerChild> | null{
        return this.stage;
    }
}

export const BoardManager = new ManagerForBoards();
