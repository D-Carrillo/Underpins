import {Graphics} from "pixi.js";
import {ThreadComponent} from "../components/ThreadComponent.ts";
import {BoardManager} from "../managers/BoardManager.ts";
import {BaseThread} from "./BaseThread.ts";

export class HandThread {
    public static linkToHand(event: MouseEvent, noteID: string) {
        const invisibleRect = new Graphics().rect(event.x, event.y, .01, .01,).fill(0x000000);

        new ThreadComponent(BoardManager.getNote(noteID)!, invisibleRect, new BaseThread(noteID + "_Fake")).makeThreadWithPins(BoardManager.getStage()!);
    }
}
