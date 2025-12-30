import {FederatedPointerEvent, Graphics} from "pixi.js";
import {ThreadComponent} from "../components/ThreadComponent.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseThread} from "./BaseThread.ts";
import {ThreadManager} from "../managers/ThreadManager.ts";
import {NotesManager} from "../managers/NoteManager.ts";

export class HandThread {
    private static activeHandler: ((event: any) => void) | null = null;

    public static linkToHand(event: MouseEvent, noteID: string) {
        const stage = BoardManager.getStage();

        if (stage === null) {
            throw Error("The BoardManager does not have required stage");
        }

        NotesManager.notesLightUpForSelection(BoardManager.getNoteMap(), noteID);

        this.activeHandler = (event: FederatedPointerEvent) => {
            mouseCircle.x = event.global.x;
            mouseCircle.y = event.global.y;
        }

        const mouseCircle = new Graphics().circle(0, 0, 10).fill(0x000000);
        stage.addChild(mouseCircle);

        mouseCircle.x = event.x;
        mouseCircle.y = event.y;

        const unlinkedThread = new ThreadComponent(BoardManager.getNote(noteID)!, mouseCircle, new BaseThread(noteID + "_Fake")).makeThreadWithPins(stage);

        stage.on('globalmousemove', this.activeHandler);

        stage.once('pointertap', (event) => {
            this.stopMouseMove(mouseCircle);
            ThreadManager.destroyVisualThread(unlinkedThread, stage);
            NotesManager.notesStopLightingUp(BoardManager.getNoteMap(), noteID);
            console.log(event.client);

            BoardManager.getNoteMap().forEach((visual, ID) => {
                const bound = visual.getLocalBounds();
                if((event.clientX > bound.x  &&  event.clientX < bound.width + bound.x) && (event.clientY > bound.y  &&  event.clientY < bound.height + bound.y)) {
                    ThreadManager.addThread(noteID, ID);
                }
            });

        });
    }

    private static stopMouseMove(mouseCircle: Graphics) {
        const stage = BoardManager.getStage();

        if(stage && this.activeHandler) {
            stage.off("globalmousemove", this.activeHandler);
            this.activeHandler = null;
        }

        if(mouseCircle) {
            mouseCircle.destroy({children: true});
        }
    }
}