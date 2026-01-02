import {BaseNoteComponent} from "./BaseNoteComponent.ts";
import {Container, ContainerChild, FederatedPointerEvent} from "pixi.js";
import {ImageNote} from "../notes/ImageNote.ts";
import {NoteMenu} from "../menus/NoteMenu.ts";

export class ImageNoteComponent extends BaseNoteComponent{

    constructor(concrete_note: ImageNote, stage: Container<ContainerChild>) {
        super(concrete_note, stage);
    }

    public makeNote(): Container {
        this.NoteGroup.label = this.note.id;
        this.makeNoteBaseGraphics(NoteMenu);
        this.Stage.addChild(this.NoteGroup);

        return this.NoteGroup;
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
