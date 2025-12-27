import {Graphics} from "pixi.js";
import {ThreadComponent} from "../components/ThreadComponent.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseThread} from "./BaseThread.ts";

export class HandThread {
    public static linkToHand(event: MouseEvent, noteID: string) {
        const mouseCircle = new Graphics().circle(0, 0, 10).fill(0x000000);
        BoardManager.getStage()!.addChild(mouseCircle);

        mouseCircle.x = event.x;
        mouseCircle.y = event.y;

        new ThreadComponent(BoardManager.getNote(noteID)!, mouseCircle, new BaseThread(noteID + "_Fake")).makeThreadWithPins(BoardManager.getStage()!);

        BoardManager.getStage()!.on('globalmousemove', (event) => {
            mouseCircle.x = event.global.x;
            mouseCircle.y = event.global.y;
        });
    }
}
