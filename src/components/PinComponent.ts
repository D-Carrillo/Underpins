import {Assets, Container, ContainerChild, Sprite} from "pixi.js";
import {PinManager} from "../managers/PinManager.ts";

export class PinComponent {
    public static async addPin(NoteGroup: Container<ContainerChild>): Promise<Sprite> {
        try {
            const texture = await Assets.load('/pin.png');
            const pinSprite = new Sprite(texture);

            pinSprite.anchor.set(0.5)
            pinSprite.position.set((NoteGroup.width / 2) + 6, NoteGroup.getLocalBounds().y + 2);
            pinSprite.scale.set(.05);
            pinSprite.label = "pin" + NoteGroup.label;

            pinSprite.eventMode = 'static';

            NoteGroup.addChild(pinSprite);
            PinManager.addPin(pinSprite.label, pinSprite);

            return pinSprite;

        } catch (error) {
            console.error("Pin failed to load", error);
        }

        return new Sprite();
    }
}
