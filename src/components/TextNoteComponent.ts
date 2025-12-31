import {
    Container,
    ContainerChild,
    FederatedPointerEvent,
    Graphics,
    Text,
    TextStyle
} from "pixi.js";
import {TextNote as TextN} from "../notes/TextNote.ts";
import {openEditor} from "./TextEditor.ts";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {NoteMenu} from "../menus/NoteMenu.ts";

export class TextNoteComponent {
    private readonly note: TextN

    constructor(concrete_note: TextN) {
        this.note = concrete_note;
    }

    public makeNote(stage: Container<ContainerChild>): Container {
        const NoteGroup = new Container();
        NoteGroup.label = this.note.id;
        this.MakeNoteGraphics(NoteGroup, stage);
        stage.addChild(NoteGroup);
        return NoteGroup;
    }

    private MakeNoteGraphics(NoteGroup: Container<ContainerChild>, stage: Container<ContainerChild>): Graphics {
        const NoteGraphics = new Graphics()
            .rect(this.note.position.x, this.note.position.y, this.note.sizes.width, this.note.sizes.height)
            .fill('fffc99');

        NoteGroup.addChild(NoteGraphics);

        const noteText = this.makeTheTextGraphic();
        NoteGroup.addChild(noteText);

        this.makeDraggable(NoteGroup, stage, noteText);
        this.makeEditable(NoteGroup);

        return NoteGraphics;
    }

    private makeTheTextGraphic(): Text {
        const padding = 16;
        const style = new TextStyle({
            fontFamily: "League Gothic",
            fontSize: 16,
            fill: 0x000000,
            // padding: 1,
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

    private makeDraggable(target: Container, stage: Container<ContainerChild>, text: Text) {
        target.eventMode = 'static';
        target.cursor = 'pointer';
        text.eventMode = 'static';
        text.cursor = 'text';

        target.on('pointerdown', onDragStart);

        let dragTarget: Graphics | null = null;
        let offset = {x: 0, y: 0};

        function onDragStart(event: FederatedPointerEvent) {
            dragTarget = event.currentTarget as Graphics;
            dragTarget.alpha = 0.7;

            const localPos = dragTarget.parent!.toLocal(event.global);
            offset.x = target.x - localPos.x;
            offset.y = target.y - localPos.y;

            stage.on('pointermove', onDragMove);
        }

        const onDragMove = (event: FederatedPointerEvent) => {
            if (dragTarget) {
                const localPos = dragTarget.parent!.toLocal(event.global);
                dragTarget.x = localPos.x + offset.x;
                dragTarget.y = localPos.y + offset.y;
            }
        }

        const onDragEnd = () => {
            if (dragTarget) {
                const distance = Math.sqrt(Math.pow(dragTarget.x - this.note.position.x, 2) + Math.pow(dragTarget.y - this.note.position.y, 2));

                distance > 5 ? this.note.changeCoordinate(dragTarget.x, dragTarget.y) : openEditor(text, this.note);

                stage.off('pointermove', onDragMove);
                dragTarget.alpha = 1;
                dragTarget = null;
            }
        }

        target.on('pointerup', onDragEnd);
        target.on('pointerupoutside', onDragEnd);
    }

    private makeEditable(target: Container) {
        target.on("rightclick", (event) => {
            useContextMenu(event.nativeEvent as MouseEvent, NoteMenu, this.note.id);
        });
    }
}
