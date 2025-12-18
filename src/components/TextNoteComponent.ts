import {TextNote as TextN} from "../notes/TextNote.ts";
import {
    Text,
    TextStyle,
    Container,
    ContainerChild,
    FederatedPointerEvent,
    Graphics,
    Application,
} from "pixi.js";
import {openEditor} from "./TextEditor.ts";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {NoteMenu} from "../menus/NoteMenu.ts";

//Now that there is no react, we can make a baseclass for this which would contain the listeners and the makeDraggable

export class TextNoteComponent {
    private readonly note: TextN

    constructor(concrete_note: TextN) {
        this.note = concrete_note;
    }

    public makeNote(app: Application): Container {
        const NoteGroup = new Container();

        //This is going to be polymorphic when the logic has been extracted into classes
        this.MakeNoteGraphics(NoteGroup, app);

        app.stage.addChild(NoteGroup);

        return NoteGroup;
    }

    private MakeNoteGraphics(NoteGroup: Container<ContainerChild>, app: Application ) {
        const NoteGraphics = new Graphics().rect(this.note.position.x, this.note.position.y, this.note.sizes.width, this.note.sizes.height).fill('fffc99');
        NoteGroup.addChild(NoteGraphics);

        const noteText = this.makeTheTextGraphic();
        NoteGroup.addChild(noteText);

        this.makeDraggable(NoteGroup, app, noteText);

        return NoteGraphics;
    }

    private makeTheTextGraphic() {
        const style = new TextStyle({
            fill: `#000000`,
            fontSize: 15,
            fontFamily: 'Arial',
            wordWrap: true,
            wordWrapWidth: this.note.sizes.width
        })

        return new Text({
            text: `${this.note.content}`,
            style,
            x: this.note.position.x,
            y: this.note.position.y,
        });
    }

    private makeDraggable(target: Container, app: Application, text: Text) {
        target.eventMode = 'dynamic';
        target.cursor = 'pointer';
        text.eventMode = 'static';
        text.cursor = 'text';

        target.on('pointerdown', onDragStart);

        let dragTarget: Graphics | null = null;

        let offset = {x: 0, y: 0}

        function onDragStart(event: FederatedPointerEvent) {
            dragTarget = event.currentTarget as Graphics;
            dragTarget.alpha = 0.7;

            const localPos = dragTarget.parent!.toLocal(event.global);
            offset.x = target.x - localPos.x;
            offset.y = target.y - localPos.y;

            app.stage.on('pointermove', onDragMove);
        }

        function onDragMove( event: FederatedPointerEvent) {
            if(dragTarget) {
                dragTarget.parent!.toLocal(event.global, undefined, dragTarget.position);

                const localPos = dragTarget.parent!.toLocal(event.global);
                dragTarget.x = localPos.x + offset.x;
                dragTarget.y = localPos.y + offset.y;
            }
        }

        const onDragEnd = () => {
            if(dragTarget) {
                const distance = Math.sqrt(Math.pow(dragTarget.x - this.note.position.x,2) + Math.pow(dragTarget.y - this.note.position.y, 2))

                distance > 5 ? this.note.changeCoordinate(dragTarget.x, dragTarget.y) : openEditor(text, app, this.note);

                app.stage.off('pointermove', onDragMove);
                dragTarget.alpha = 1;

                dragTarget = null;
            }
        }

        target.on('pointerup', onDragEnd);
        target.on('pointerupoutside', onDragEnd);

        target.on("rightclick", (event) => {
            useContextMenu(event.nativeEvent as MouseEvent, NoteMenu, this.note.id);
        })
    }
}