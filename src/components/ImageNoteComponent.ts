import {BaseNoteComponent} from "./BaseNoteComponent.ts";
import {Assets, Container, ContainerChild, FederatedPointerEvent, Graphics, Sprite} from "pixi.js";
import {ImageNote} from "../notes/ImageNote.ts";
import {MenuCreator} from "../menus/BaseMenu.ts";
import {ImageNoteMenu} from "../menus/ImageNoteMenu.ts";

export class ImageNoteComponent extends BaseNoteComponent{

    constructor(concrete_note: ImageNote, stage: Container<ContainerChild>) {
        super(concrete_note, stage);
    }

    public makeNote(): Container {
        this.NoteGroup.label = this.note.id;
        this.makeNoteBaseGraphics(ImageNoteMenu)

        return this.NoteGroup;
    }

    protected override makeNoteBaseGraphics(Menu: MenuCreator) {
        this.addTheImage().then(() => {super.makeNoteBaseGraphics(Menu); this.addBorder();});
    }

    private async addTheImage() {
        try {
            const url = `gallery://localhost${this.note.content}`;
            const texture = await Assets.load(url);
            const imageSprite = new Sprite(texture);

            imageSprite.anchor.set(0.5);

            if (imageSprite.width === imageSprite.height) {
                imageSprite.width = this.note.sizes.width - 30;
            }
            else {
                const width = Math.floor(imageSprite.width * (this.note.sizes.height / imageSprite.height));
                imageSprite.width = width - 30;
                this.note.sizes = {width: width, height: 300};
            }

            imageSprite.height = this.note.sizes.height - 30;

            imageSprite.position.set(this.note.position.x + this.note.sizes.width / 2, this.note.position.y + this.note.sizes.height / 2);


            this.NoteGroup.addChild(imageSprite);

        } catch (e) {
            console.error("Images failed to load", e);
        }
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
