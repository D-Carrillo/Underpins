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
    private isOnTop: boolean = false;
    private threadContainer: Container<ContainerChild> = new Container();
    private viewport: Container<ContainerChild>;

    constructor(fromNote: Container<ContainerChild>, toNote: Container<ContainerChild>, threadType: BaseThread, viewport: Container<ContainerChild>) {
        this.fromNote = fromNote;
        this.toNote = toNote;
        this.toNotePos = {x:toNote.getBounds().x , y: toNote.getBounds().y};
        this.fromNotePos = {x:fromNote.getBounds().x, y: fromNote.getBounds().y};
        this.thread = threadType;
        this.viewport = viewport;
    }

    public makeThread(): Container<ContainerChild> {
        this.makeLineVisual();

        this.viewport.addChildAt(this.threadContainer, this.viewport.children.length);

        return this.threadContainer;
    }

    private makeLineVisual(): Graphics {
        const line = new Graphics();

        this.threadContainer.addChild(line);

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

    private drawLine(line: Graphics) {

        const bounds = this.getTheLocalPosition();
        const threadOriginPos  = this.calculateDisplayCoordinates(bounds.start, bounds.startBounds);
        const threadEndPos  = this.calculateDisplayCoordinates(bounds.end, bounds.endBounds);

        line.moveTo(threadOriginPos.x, threadOriginPos.y ).lineTo(threadEndPos.x , threadEndPos.y).stroke({width: 2, color: this.thread.getColor()});
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
            line.clear();
            this.drawLine(line)
            this.isOnTop = true;

            this.toNotePos = {x: this.toNote.position.x, y: this.toNote.position.y};
            this.fromNotePos =  {x: this.fromNote.position.x, y: this.fromNote.position.y};

            this.threadContainer.zIndex = this.viewport.children.length + 1;
        }
        else if (this.isOnTop) {
            this.threadContainer.zIndex = this.viewport.children.length - 0.5;
            this.isOnTop = false;
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
            useContextMenu(event.nativeEvent as MouseEvent, ThreadMenu, this.thread.getThreadID());
        });
    }
}
