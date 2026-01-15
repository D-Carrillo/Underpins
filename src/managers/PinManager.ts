import {Bounds, Graphics, Sprite} from "pixi.js";

class ManagerForPins {
    private pins: Sprite[] = [];

    public addPin(pin: Sprite) {
        this.pins.push(pin);
    }

    public aPinIsBelow(note: Graphics, pin: Sprite): boolean {
        const noteBounds = note.getBounds(true);

        return this.pins.some(pinInstance => this.checkIfBelow(pinInstance, noteBounds, note, pin));
    }

    private checkIfBelow(pinInstance: Sprite, noteBounds: Bounds, note: Graphics, pin: Sprite): boolean {
        if (pin === undefined) {console.log("This was undefined");}

        if (pinInstance != pin && pinInstance.zIndex < note.zIndex) {
            const pinBounds = pinInstance.getBounds(true);

            return pinBounds.x + pinBounds.width > noteBounds.x &&
                pinBounds.x < noteBounds.x + noteBounds.width &&
                pinBounds.y + pinBounds.height > noteBounds.y &&
                pinBounds.y < noteBounds.y + noteBounds.height;
        }

        return false;
    }
}

export const PinManager = new ManagerForPins();