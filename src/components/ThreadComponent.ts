import {Container, Ticker, ContainerChild, Graphics, } from "pixi.js";
import {BaseThread} from "../threads/BaseThread.ts";

export class ThreadComponent {
    private line = new Graphics();
    private toNote: Container<ContainerChild>;
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

        stage.addChild(this.line);

        this.drawLine();

        Ticker.shared.add(() => {
           this.updateLine();
        });

        const container = new Container();

        container.addChild(this.toNote);

        return container;
    }

    private drawLine() {
        const parent = this.line.parent!;

        const startBounds = this.fromNote.getBounds();
        const endBounds = this.toNote.getBounds();

        const start = parent.toLocal(startBounds);
        const end = parent.toLocal(endBounds);

        this.line.moveTo(start.x + startBounds.width / 2, start.y + 10 ).lineTo(end.x + endBounds.width / 2 , end.y + 10).stroke({width: 2, color: this.threadType.getColor()});
    }

    private updateLine() {
        if (this.notesMoved()) {
            this.line.clear();
            this.drawLine()

            this.toNotePos = {x: this.toNote.getBounds().x, y: this.toNote.getBounds().y};
            this.fromNotePos =  {x: this.fromNote.getBounds().x, y: this.fromNote.getBounds().y};

            console.log("Running");
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
}
