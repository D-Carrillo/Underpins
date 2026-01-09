import {
    Container,
    Ticker,
    ContainerChild,
    Graphics,
    Sprite,
    Assets,
    Point
} from "pixi.js";
import {BaseThread} from "../threads/BaseThread.ts";
import {useContextMenu} from "../menus/BaseMenu.ts";
import {ThreadMenu} from "../menus/ThreadMenu.ts";

export class ThreadComponent {
    private readonly toNote: Container<ContainerChild>;
    private fromNote: Container<ContainerChild>;
    private toNotePos: {x: number, y: number};
    private fromNotePos: {x: number, y: number};
    private threadType: BaseThread;
    private framesSinceMoved = 0;

    constructor(fromNote: Container<ContainerChild>, toNote: Container<ContainerChild>, threadType: BaseThread) {
        this.fromNote = fromNote;
        this.toNote = toNote;
        this.toNotePos = {x:toNote.getBounds().x, y: toNote.getBounds().y};
        this.fromNotePos = {x:fromNote.getBounds().x, y: fromNote.getBounds().y};
        this.threadType = threadType;
    }

    public makeThreadWithPins(stage: Container<ContainerChild> ): Container<ContainerChild> {
        const container = new Container();

        this.makeLineVisual(container);

        this.makeThePins(container);

        stage.addChild(container);

        return container;
    }

    private makeLineVisual(container: Container<ContainerChild>): Graphics {
        const line = new Graphics();

        container.addChild(line);

        this.drawLine(line);

        this.makeEditable(line);

        const updateCallBack = () => {
            if (!line.parent) {
                Ticker.shared.remove(updateCallBack);
                return;
            }

            this.updateLine(line);
        };

        Ticker.shared.add(updateCallBack);

        return line;
    }

    private makeThePins(container: Container<ContainerChild>) {

        const bounds = this.getTheLocalPosition();
        const threadOriginPos  = this.calculateDisplayCoordinates(bounds.start, bounds.startBounds);
        const threadEndPos = this.calculateDisplayCoordinates(bounds.end, bounds.endBounds);

        this.makeThePinSprite(container, threadOriginPos, "origin");
        this.makeThePinSprite(container, threadEndPos, "end");

    }

    private async makeThePinSprite(container: Container<ContainerChild>, pinPos: {x: number, y: number}, place: string) {
        try {
            const texture = await Assets.load('/pin.png');
            const pinSprite = new Sprite(texture);

            pinSprite.anchor.set(0.5)
            pinSprite.position.set(pinPos.x + 6, pinPos.y - 8);
            pinSprite.scale.set(.05);

            pinSprite.eventMode = 'static';

            container.addChild(pinSprite);

            const updateCallback = () => {
                if (!pinSprite.parent) {
                    Ticker.shared.remove(updateCallback);
                    return;
                }
                this.updateThreads(pinSprite, place);
            };

            Ticker.shared.add(updateCallback);

        } catch (e) {
            console.error("Pin failed to load", e);
        }
    }

    private drawLine(line: Graphics) {

        const bounds = this.getTheLocalPosition();
        const threadOriginPos  = this.calculateDisplayCoordinates(bounds.start, bounds.startBounds);
        const threadEndPos  = this.calculateDisplayCoordinates(bounds.end, bounds.endBounds);

        line.moveTo(threadOriginPos.x, threadOriginPos.y ).lineTo(threadEndPos.x , threadEndPos.y).stroke({width: 2, color: this.threadType.getColor()});
    }

    private getTheLocalPosition(): {start: Point, end: Point, startBounds: {width: number, height: number}, endBounds: {width: number, height: number}} {
        const start = new Point(this.fromNote.x, this.fromNote.y);
        const end = new Point(this.toNote.x, this.toNote.y);

        return {
            start,
            end,
            startBounds: { width: this.fromNote.width, height: this.fromNote.height },
            endBounds: { width: this.toNote.width, height: this.toNote.height }
        };
    }

    private calculateDisplayCoordinates(positon: Point, bounds: {width: number, height: number}): {x: number, y: number} {
        return {x: positon.x + bounds.width / 2, y: positon.y + 10};
    }

    private updateLine(line: Graphics) {
        if (this.notesMoved()) {
            this.framesSinceMoved = 2;
            line.clear();
            this.drawLine(line)

            this.toNotePos = {x: this.toNote.position.x, y: this.toNote.position.y};
            this.fromNotePos =  {x: this.fromNote.position.x, y: this.fromNote.position.y};
        }
    }

    private updateThreads(pinSprite: Sprite, place: string) {
        if (this.framesSinceMoved > 0) {
            const bounds = this.getTheLocalPosition();
            let targetPos: { x: number, y: number };

            if (place === "origin") {
                targetPos = this.calculateDisplayCoordinates(bounds.start, bounds.startBounds);
            } else {
                targetPos = this.calculateDisplayCoordinates(bounds.end, bounds.endBounds);
            }

            pinSprite.x = targetPos.x + 6;
            pinSprite.y = targetPos.y - 8;

            this.framesSinceMoved--;
        }
    }

    private notesMoved(): boolean {
        const start = this.fromNote.position;
        const end = this.toNote.position;

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
