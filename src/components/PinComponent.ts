import {Assets, Container, ContainerChild, Sprite} from "pixi.js";

export class PinComponent {
    public static async addPin(NoteGroup: Container<ContainerChild>) {
        try {
            const texture = await Assets.load('/pin.png');
            const pinSprite = new Sprite(texture);

            pinSprite.anchor.set(0.5)
            pinSprite.position.set((NoteGroup.width / 2) + 6, NoteGroup.getLocalBounds().y + 2);
            pinSprite.scale.set(.05);

            pinSprite.eventMode = 'static';

            NoteGroup.addChild(pinSprite);

        } catch (error) {
            console.error("Pin failed to load", error);
        }
    }
}