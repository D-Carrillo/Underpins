import {BaseNote} from "../notes/BaseNote.ts";
import {Container, ContainerChild, FederatedPointerEvent, Graphics, BlurFilter} from "pixi.js";
import {MenuCreator, useContextMenu} from "../menus/BaseMenu.ts";
import {PinComponent} from "./PinComponent.ts";

const MIN_DISTANCE = 5;

export abstract class BaseNoteComponent {
    protected readonly note: BaseNote
    protected NoteGroup: Container;
    protected viewport: Container<ContainerChild>;
    protected dragTarget: Graphics | null = null;
    protected offset = {x: 0, y: 0};

    public abstract makeNote(): Container;
    protected abstract makeDraggable(...args: any[]): void;
    protected abstract onDragStart(event: FederatedPointerEvent): void;
    protected abstract onDragEnd(): void;

    protected constructor(note: BaseNote, viewport: Container<ContainerChild>) {
        this.note = note;
        this.NoteGroup = new Container();
        this.viewport = viewport;

        this.setZAxisPosition();
    }

    protected makeNoteBaseGraphics(Menu: MenuCreator) {
        this.makeRectangle(Menu);

        PinComponent.addPin(this.NoteGroup).then();
    }

    private makeRectangle(Menu: (e: MouseEvent, m: HTMLDivElement, t: string) => void) {
        const NoteGraphics = new Graphics()
            .rect(0, 0, this.note.sizes.width, this.note.sizes.height)
            .fill('#f8f8ff');

        const glow = new Graphics().rect(0, 0, this.note.sizes.width, this.note.sizes.height).fill('#ab9f97');

        glow.filters = new BlurFilter({strength: 5});

        this.NoteGroup.x = this.note.position.x;
        this.NoteGroup.y = this.note.position.y;

        this.NoteGroup.addChildAt(NoteGraphics, 0);
        this.NoteGroup.addChildAt(glow, 0);

        this.makeDraggable();
        this.makeEditable(Menu);

        this.viewport.addChildAt(this.NoteGroup, 0);
    }

    protected onDragStartHelper(event: FederatedPointerEvent) {
        this.dragTarget = event.currentTarget as Graphics;
        this.dragTarget.getChildAt(0).alpha = 0.3;
        this.dragTarget.alpha = 0.7;

        const localPos = this.dragTarget.parent!.toLocal(event.global);
        this.offset.x = this.NoteGroup.x - localPos.x;
        this.offset.y = this.NoteGroup.y - localPos.y;

        this.viewport.on('pointermove', this.onDragMove);
    }

    private onDragMove=  (event: FederatedPointerEvent) => {
        if (this.dragTarget) {
            const localPos = this.viewport.toLocal(event.global);
            this.dragTarget.x = localPos.x + this.offset.x;
            this.dragTarget.y = localPos.y + this.offset.y;

            this.note.moveZAxis(this.viewport.children.length);
            this.NoteGroup.zIndex = this.note.getZAxisPosition();
        }
    }

    protected onDragEndHelper(): boolean {
        if (this.dragTarget) {
            const distance = this.getDistance();

            this.note.changeCoordinate(this.NoteGroup.x, this.NoteGroup.y);

            if( this.viewport ) {
                this.viewport.off('pointermove', this.onDragMove);
            }

            this.dragTarget.alpha = 1;
            this.dragTarget.getChildAt(0).alpha = 1;
            this.dragTarget = null;

            this.note.moveZAxis(this.viewport.children.length - 1);
            this.NoteGroup.zIndex = this.note.getZAxisPosition();

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

    protected makeEditable(Menu: MenuCreator) {
        this.NoteGroup.on("rightclick", (event) => {
            event.stopPropagation();
            useContextMenu(event.nativeEvent as MouseEvent, Menu, this.note.id);
        });
    }

    private setZAxisPosition() {
        if (this.note.ZAxisIsSet()) {
            this.note.moveZAxis(this.NoteGroup.zIndex);
        } else {
            this.NoteGroup.zIndex = this.note.getZAxisPosition();
        }
    }
}
