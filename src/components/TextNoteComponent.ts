import {
    Container,
    ContainerChild,
    FederatedPointerEvent,
    Text,
    TextStyle,
} from "pixi.js";
import {TextNote as TextN} from "../notes/TextNote.ts";
import {TextNoteMenu} from "../menus/TextNoteMenu.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseNoteComponent} from "./BaseNoteComponent.ts";
import {MenuCreator} from "../menus/BaseMenu.ts";

export class TextNoteComponent extends BaseNoteComponent{
    private readonly text: Text;

    constructor(concrete_note: TextN, stage: Container<ContainerChild>) {
        super(concrete_note, stage);
        this.text = this.makeTheTextGraphic();
    }

    public makeNote(): Container {
        this.makeNoteBaseGraphics(TextNoteMenu);

        return this.NoteGroup;
    }

    protected override makeNoteBaseGraphics(Menu: MenuCreator) {
        super.makeNoteBaseGraphics(Menu);

        this.NoteGroup.addChild(this.text);
    }

    private getFontSizeFunction(): number {
        return 16;
    }

    private makeTheTextGraphic(): Text {
        const padding = 16;
        const style = new TextStyle({
            fontFamily: "League Gothic",
            fontSize: this.getFontSizeFunction(),
            fill: 0x000000,
            wordWrap: true,
            wordWrapWidth: this.note.sizes.width - (padding * 2),
            breakWords: true,
        });

        const text = new Text({
            text: this.note.content,
            style,
            resolution: window.devicePixelRatio,
        });

        text.x = padding;
        text.y = padding;

        return text;
    }

    private closeEditor() {
        const textArea = document.getElementById('pixi-html-editor');
        if (textArea) {
            textArea.remove();
        }

        this.text.visible = true;
    }

    private getEditing(text: Text) {
        console.log(text);
    }


    protected onDragStart = (event: FederatedPointerEvent) => {
        this.closeEditor();
        this.onDragStartHelper(event);
    }

    protected onDragEnd = () => {
        if (this.dragTarget && this.onDragEndHelper()) {
            this.getEditing(this.text);
        }
    }

    protected makeDraggable() {
        this.NoteGroup.eventMode = 'static';
        this.NoteGroup.cursor = 'pointer';
        this.text.eventMode = 'static';
        this.text.cursor = 'pointer';


        this.startListeners(this.NoteGroup, this.onDragStart, this.onDragEnd)
    }

    private closeOnBlur = (event: FederatedPointerEvent) => {
        if(!(this.NoteGroup.children.length === 0)) {
            if (this.NoteGroup) {
                const bounds = this.NoteGroup.getBounds();

                if (!bounds.containsPoint(event.globalX, event.globalY)) {
                    this.closeEditor();
                }
            }
        } else {
            BoardManager.getViewport()!.off('pointerdown', this.closeOnBlur);
            this.NoteGroup.destroy({children: true});
        }
    }
}
