import {Container, Ticker, ContainerChild, Graphics, Sprite, Assets} from "pixi.js";
import {BaseThread} from "../threads/BaseThread.ts";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {ThreadMenu} from "../menus/ThreadMenu.ts";

export class ThreadComponent {
    private readonly toNote: Container<ContainerChild>;
    private fromNote: Container<ContainerChild>;
    private toNotePos: {x: number, y: number};
    private fromNotePos: {x: number, y: number};
    private threadType: BaseThread;

    constructor(fromNote: Container<ContainerChild>, toNote: Container<ContainerChild>, threadType: BaseThread) {
        this.fromNote = fromNote;
        this.toNote = toNote;
        this.toNotePos = {x:toNote.getBounds().x, y: toNote.getBounds().y};
        this.fromNotePos = {x:fromNote.getBounds().x, y: fromNote.getBounds().y};
        this.threadType = threadType;
    }

    public makeThread( stage: Container<ContainerChild> ): Container<ContainerChild> {

        const line = new Graphics();

        this.makeThePinSprite(stage);

        stage.addChild(line);

        this.drawLine(line);

        this.makeEditable(line);

        Ticker.shared.add(() => {
           this.updateLine(line);
        });

        return line;
    }

    private async makeThePinSprite(stage: Container<ContainerChild>) {
        const texture = await Assets.load('/src/public/pin.png');
        const pinSprite = Sprite.from(texture);

        pinSprite.anchor.set(0.5)
        pinSprite.position.set(100,100);
        pinSprite.scale.set(.5);

        stage.addChild(pinSprite);
    }

    private drawLine(line: Graphics) {
        const parent = line.parent!;

        const startBounds = this.fromNote.getBounds();
        const endBounds = this.toNote.getBounds();

        const start = parent.toLocal(startBounds);
        const end = parent.toLocal(endBounds);

        line.moveTo(start.x + startBounds.width / 2, start.y + 10 ).lineTo(end.x + endBounds.width / 2 , end.y + 10).stroke({width: 2, color: this.threadType.getColor()});
    }

    private updateLine(line: Graphics) {
        if (this.notesMoved()) {
            line.clear();
            this.drawLine(line)

            this.toNotePos = {x: this.toNote.getBounds().x, y: this.toNote.getBounds().y};
            this.fromNotePos =  {x: this.fromNote.getBounds().x, y: this.fromNote.getBounds().y};
        }
    }

    private notesMoved(): boolean {
        const start = this.fromNote.getBounds();
        const end = this.toNote.getBounds();

        const EPS = 0.01;

        return (
            Math.abs(start.x - this.fromNotePos.x) > EPS ||
            Math.abs(start.y - this.fromNotePos.y) > EPS ||
            Math.abs(end.x - this.toNotePos.x) > EPS ||
            Math.abs(end.y - this.toNotePos.y) > EPS
        );
    }

    private makeEditable(target: Container) {
        target.eventMode = 'static';
        target.cursor = 'pointer';

        target.on("rightclick", (event) => {
            useContextMenu(event.nativeEvent as MouseEvent, ThreadMenu, this.threadType.getThreadID());
        });
    }
}
