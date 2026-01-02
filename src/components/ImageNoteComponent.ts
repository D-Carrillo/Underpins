import {BaseNoteComponent} from "./BaseNoteComponent.ts";
import {Container, ContainerChild, FederatedPointerEvent} from "pixi.js";
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

        //TODO add the black border around the image.
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
