import {BaseNote} from "../notes/BaseNote.ts";
import {Container, ContainerChild, FederatedPointerEvent, Graphics} from "pixi.js";

const MIN_DISTANCE = 5;

export abstract class BaseNoteComponent {
    protected readonly note: BaseNote
    protected NoteGroup: Container;
    protected dragTarget: Graphics | null = null;
    protected offset = {x: 0, y: 0};

    public abstract makeNote(stage: Container<ContainerChild>): Container;
    protected abstract makeDraggable(target: Container, Stage: Container<ContainerChild>, ...args: any[]): void;

    protected constructor(note: BaseNote) {
        this.note = note;
        this.NoteGroup = new Container();
    }

    protected onDragStartHelper(event: FederatedPointerEvent, target: Container, stage: Container<ContainerChild>) {
        this.dragTarget = event.currentTarget as Graphics;
        this.dragTarget.alpha = 0.7;

        const localPos = this.dragTarget.parent!.toLocal(event.global);
        this.offset.x = target.x - localPos.x;
        this.offset.y = target.y - localPos.y;

        stage.on('pointermove', this.onDragMove);
    }

    private onDragMove=  (event: FederatedPointerEvent) => {
        if (this.dragTarget) {
            const localPos = this.dragTarget.parent!.toLocal(event.global);
            this.dragTarget.x = localPos.x + this.offset.x;
            this.dragTarget.y = localPos.y + this.offset.y;
        }
    }

    protected onDragEndHelper(stage: Container<ContainerChild>): boolean {
        if (this.dragTarget) {
            const distance = this.getDistance();

            this.note.changeCoordinate(this.dragTarget.x, this.dragTarget.y);

            stage.off('pointermove', this.onDragMove);
            this.dragTarget.alpha = 1;
            this.dragTarget = null;

            return distance < MIN_DISTANCE;
        }

        return false;
    }

    private getDistance() {
        return Math.sqrt(Math.pow(this.dragTarget!.x - this.note.position.x, 2) + Math.pow(this.dragTarget!.y - this.note.position.y, 2));
    }
}