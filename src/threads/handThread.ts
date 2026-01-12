import {FederatedPointerEvent, Graphics} from "pixi.js";
import {ThreadComponent} from "../components/ThreadComponent.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseThread} from "./BaseThread.ts";
import {ThreadManager} from "../managers/ThreadManager.ts";
import {NotesManager} from "../managers/NoteManager.ts";

export class HandThread {
    private static activeHandler: ((event: any) => void) | null = null;

    public static linkToHand(event: MouseEvent, noteID: string) {
        const viewport = BoardManager.getViewport();

        if (viewport === null) {
            throw Error("The BoardManager does not have required stage");
        }

        NotesManager.notesLightUpForSelection(BoardManager.getNoteMap(), noteID);

        this.activeHandler = (event: FederatedPointerEvent) => {
            const position =  BoardManager.getViewport()?.toLocal(event.global);
            mouseCircle.position.set(position!.x, position!.y);
        }

        const mouseCircle = new Graphics().roundRect(0, 0, 25, 25, 50).fill(0x000000);
        viewport.addChild(mouseCircle);

        const position =  BoardManager.getViewport()?.toLocal(event);
        mouseCircle.position.set(position!.x, position!.y);

        const unlinkedThread = new ThreadComponent(BoardManager.getNote(noteID)!, mouseCircle, new BaseThread(noteID + "_Fake"), viewport).makeThread();

        viewport.on('globalmousemove', this.activeHandler);

        viewport.once('pointertap', (event) => {
            this.stopMouseMove(mouseCircle);
            ThreadManager.destroyVisualThread(unlinkedThread, viewport);
            NotesManager.notesStopLightingUp(BoardManager.getNoteMap(), noteID);

            const clickPointer = event.global;

            BoardManager.getNoteMap().forEach((visual, ID) => {
                const bounds = visual.getBounds();

                if(bounds.containsPoint(clickPointer.x, clickPointer.y)) {
                    ThreadManager.addThread(noteID, ID);
                }
            });
        });
    }

    private static stopMouseMove(mouseCircle: Graphics) {
        const stage = BoardManager.getViewport();

        if(stage && this.activeHandler) {
            stage.off("globalmousemove", this.activeHandler);
            this.activeHandler = null;
        }

        if(mouseCircle) {
            mouseCircle.destroy({children: true});
        }
    }
}
