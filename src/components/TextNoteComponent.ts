import {
    Container,
    ContainerChild,
    FederatedPointerEvent,
    Graphics,
    Text,
    TextStyle
} from "pixi.js";
import {TextNote as TextN} from "../notes/TextNote.ts";
import {TextEditor} from "./TextEditor.ts";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {NoteMenu} from "../menus/NoteMenu.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseNoteComponent} from "./BaseNoteComponent.ts";

export class TextNoteComponent extends BaseNoteComponent{
    private editing: TextEditor | null = null;

    private closeOnBlur = (event: FederatedPointerEvent) => {
        const bounds = this.NoteGroup.getBounds();

        if (!bounds.containsPoint(event.globalX, event.globalY)) {
            this.closeEditor();
        }
    }

    constructor(concrete_note: TextN) {
        super(concrete_note)
    }

    public makeNote(stage: Container<ContainerChild>): Container {
        this.NoteGroup.label = this.note.id;
        this.MakeTextNoteGraphics(this.NoteGroup, stage);
        stage.addChild(this.NoteGroup);
        return this.NoteGroup;
    }

    private MakeTextNoteGraphics(NoteGroup: Container<ContainerChild>, stage: Container<ContainerChild>): Graphics {
        const NoteGraphics = new Graphics()
            .rect(this.note.position.x, this.note.position.y, this.note.sizes.width, this.note.sizes.height)
            .fill('#f6ecd2');

        NoteGroup.addChild(NoteGraphics);

        const noteText = this.makeTheTextGraphic();
        NoteGroup.addChild(noteText);

        this.makeDraggable(NoteGroup, stage, noteText);
        this.makeEditable(NoteGroup);

        return NoteGraphics;
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

    protected makeDraggable(target: Container, stage: Container<ContainerChild>, text: Text) {
        target.eventMode = 'static';
        target.cursor = 'pointer';
        text.eventMode = 'static';
        text.cursor = 'pointer';

        const onDragStart = (event: FederatedPointerEvent) => {
            this.closeEditor();
            this.onDragStartHelper(event, target, stage);
        }

        const onDragEnd = () => {
            if (this.dragTarget && this.onDragEndHelper(stage)) {
                this.getEditing(text);
            }
        }

        target.on('pointerdown', onDragStart);
        target.on('pointerup', onDragEnd);
        target.on('pointerupoutside', onDragEnd);
    }

    private makeEditable(target: Container) {
        target.on("rightclick", (event) => {
            event.stopPropagation();
            this.closeEditor();
            useContextMenu(event.nativeEvent as MouseEvent, NoteMenu, this.note.id);
        });
    }

    private getEditing(text: Text) {
        if(this.editing) {
            this.editing.close();
        }

        this.editing = new TextEditor(text, this.note);
        this.editing.open();

        BoardManager.getStage()!.on('pointerdown', this.closeOnBlur);
    }
}
