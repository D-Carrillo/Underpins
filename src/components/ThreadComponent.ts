import {
    Container,
    Ticker,
    ContainerChild,
    Graphics,
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
    private thread: BaseThread;
    private threadContainer: Container<ContainerChild> = new Container();
    private viewport: Container<ContainerChild>;
    private line: Graphics = new Graphics();

    constructor(fromNote: Container<ContainerChild>, toNote: Container<ContainerChild>, threadType: BaseThread, viewport: Container<ContainerChild>) {
        this.fromNote = fromNote;
        this.toNote = toNote;
        this.toNotePos = {x: toNote.getBounds().x, y: toNote.getBounds().y};
        this.fromNotePos = {x: fromNote.getBounds().x, y: fromNote.getBounds().y};
        this.thread = threadType;
        this.viewport = viewport;
    }

    public makeThread(): Container<ContainerChild> {
        this.makeLineVisual();

        this.viewport.addChild(this.threadContainer);

        return this.threadContainer;
    }

    private makeLineVisual(): Graphics {
        this.line = new Graphics();

        this.threadContainer.addChild(this.line);

        this.drawLine();

        this.makeEditable();

        this.threadMovesWithNote();

        return this.line;
    }

    private threadMovesWithNote() {
        const updateCallBack = () => {
            if (!this.line.parent) {
                Ticker.shared.remove(updateCallBack);
                return;
            }

            this.updateLine();
        };

        Ticker.shared.add(updateCallBack);
    }

    private drawLine() {

        const bounds = this.getTheLocalPosition();
        const threadOriginPos  = this.calculateDisplayCoordinates(bounds.start, bounds.startBounds);
        const threadEndPos  = this.calculateDisplayCoordinates(bounds.end, bounds.endBounds);

        this.line.moveTo(threadOriginPos.x, threadOriginPos.y ).lineTo(threadEndPos.x , threadEndPos.y).stroke({width: 2, color: this.thread.getColor()});
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

    private updateLine() {
        if (this.notesMoved()) {
            this.line.clear();
            this.drawLine()

            this.toNotePos = {x: this.toNote.position.x, y: this.toNote.position.y};
            this.fromNotePos =  {x: this.fromNote.position.x, y: this.fromNote.position.y};
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

    private makeEditable() {
        this.line.eventMode = 'static';
        this.line.cursor = 'pointer';

        this.line.on("rightclick", (event) => {
            useContextMenu(event.nativeEvent as MouseEvent, ThreadMenu, this.thread.getThreadID());
        });
    }
}
