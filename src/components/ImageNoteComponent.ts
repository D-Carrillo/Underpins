import {BaseNoteComponent} from "./BaseNoteComponent.ts";
import {Container, ContainerChild, FederatedPointerEvent, Graphics} from "pixi.js";
import {ImageNote} from "../notes/ImageNote.ts";
import {NoteMenu} from "../menus/NoteMenu.ts";
import {MenuCreator} from "../menus/BaseMenu.ts";

export class ImageNoteComponent extends BaseNoteComponent{

    constructor(concrete_note: ImageNote, stage: Container<ContainerChild>) {
        super(concrete_note, stage);
    }

    public makeNote(): Container {
        this.NoteGroup.label = this.note.id;
        this.makeNoteBaseGraphics(NoteMenu);

        return this.NoteGroup;
    }

    protected override makeNoteBaseGraphics(Menu: MenuCreator) {
        super.makeNoteBaseGraphics(Menu);
        this.addBorder();

        //TODO add the image
    }

    private addBorder() {
        const border = this.NoteGroup.getChildAt(1) as Graphics;

        border.stroke({width: 2, color: 0x000000});
        // this is not a solution but until I add the color into the base notes.
        border.fill('#f8f8ff');
    }

    protected makeDraggable() {
        this.NoteGroup.eventMode = 'static';
        this.NoteGroup.cursor = 'pointer';

        this.startListeners(this.NoteGroup, this.onDragStart, this.onDragEnd)

    }

    protected onDragEnd = ()=> {
        if (this.dragTarget && this.onDragEndHelper()) {
        }
    }

    protected onDragStart = (event: FederatedPointerEvent) => {
        this.onDragStartHelper(event);
    }
}
