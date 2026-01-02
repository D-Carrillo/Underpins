import {
    Container,
    ContainerChild,
    FederatedPointerEvent,
    Text,
    TextStyle
} from "pixi.js";
import {TextNote as TextN} from "../notes/TextNote.ts";
import {TextEditor} from "./TextEditor.ts";
import {NoteMenu} from "../menus/NoteMenu.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseNoteComponent} from "./BaseNoteComponent.ts";

export class TextNoteComponent extends BaseNoteComponent{
    private editing: TextEditor | null = null;
    private readonly text: Text;

    constructor(concrete_note: TextN, stage: Container<ContainerChild>) {
        super(concrete_note, stage)
        this.text = this.makeTheTextGraphic();
    }

    public makeNote(): Container {
        this.NoteGroup.label = this.note.id;
        this.makeNoteBaseGraphics(NoteMenu);
        this.Stage.addChild(this.NoteGroup);
        this.NoteGroup.addChild(this.text);

        return this.NoteGroup;
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

        text.x = this.note.position.x + padding;
        text.y = this.note.position.y + padding;

        return text;
    }

    private closeEditor() {
        if (this.editing !== null) {
            setTimeout(() => {
                BoardManager.getStage()!.off('pointerdown', this.closeOnBlur);
            }, 0);

            this.editing.close();
            this.editing = null;
        }
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

    private getEditing(text: Text) {
        if(this.editing) {
            this.editing.close();
        }

        this.editing = new TextEditor(text, this.note);
        this.editing.open();

        BoardManager.getStage()!.on('pointerdown', this.closeOnBlur);
    }

    private closeOnBlur = (event: FederatedPointerEvent) => {
        const bounds = this.NoteGroup.getBounds();

        if (!bounds.containsPoint(event.globalX, event.globalY)) {
            this.closeEditor();
        }
    }
}
