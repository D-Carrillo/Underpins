import {BaseNote} from "../notes/BaseNote.ts";
import {Container, ContainerChild, FederatedPointerEvent, Graphics} from "pixi.js";

const MIN_DISTANCE = 5;

export abstract class BaseNoteComponent {
    protected readonly note: BaseNote
    protected NoteGroup: Container;
    protected Stage: Container<ContainerChild>;
    protected dragTarget: Graphics | null = null;
    protected offset = {x: 0, y: 0};

    protected abstract makeNote(): Container;
    protected abstract makeDraggable(...args: any[]): void;
    protected abstract onDragStart(event: FederatedPointerEvent): void;
    protected abstract onDragEnd(): void;

    protected constructor(note: BaseNote, stage: Container<ContainerChild>) {
        this.note = note;
        this.NoteGroup = new Container();
        this.Stage = stage;
    }

    protected onDragStartHelper(event: FederatedPointerEvent) {
        this.dragTarget = event.currentTarget as Graphics;
        this.dragTarget.alpha = 0.7;

        const localPos = this.dragTarget.parent!.toLocal(event.global);
        this.offset.x = this.NoteGroup.x - localPos.x;
        this.offset.y = this.NoteGroup.y - localPos.y;

        this.Stage.on('pointermove', this.onDragMove);

    }

    private onDragMove=  (event: FederatedPointerEvent) => {
        if (this.dragTarget) {
            const localPos = this.dragTarget.parent!.toLocal(event.global);
            this.dragTarget.x = localPos.x + this.offset.x;
            this.dragTarget.y = localPos.y + this.offset.y;
        }
    }

    protected onDragEndHelper(): boolean {
        if (this.dragTarget) {
            const distance = this.getDistance();

            this.note.changeCoordinate(this.dragTarget.x, this.dragTarget.y);

            if( this.Stage ) {
                this.Stage.off('pointermove', this.onDragMove);
            }

            this.dragTarget.alpha = 1;
            this.dragTarget = null;

            return distance < MIN_DISTANCE;
        }

        return false;
    }

    protected startListeners(target: Container,onDragStart: (event: FederatedPointerEvent) => void, onDragEnd: () => void) {
        target.on('pointerdown', onDragStart);
        target.on('pointerup', onDragEnd);
        target.on('pointerupoutside', onDragEnd);
    }

    private getDistance() {
        return Math.sqrt(Math.pow(this.dragTarget!.x - this.note.position.x, 2) + Math.pow(this.dragTarget!.y - this.note.position.y, 2));
    }
}