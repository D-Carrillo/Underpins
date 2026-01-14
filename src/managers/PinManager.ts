import {Bounds, Graphics, Sprite} from "pixi.js";

class ManagerForPins {
    private pins: Sprite[] = [];

    public addPin(pin: Sprite) {
        this.pins.push(pin);
    }

    public aPinIsBelow(note: Graphics): boolean {
        const noteBounds = note.getBounds(true);

        return this.pins.some(pin => this.checkIfBelow(pin, noteBounds, note));
    }

    private checkIfBelow(pin: Sprite, noteBounds: Bounds, note: Graphics): boolean {
        if (pin !== note.getChildByLabel("pin") && pin.zIndex < note.zIndex) {
            const pinBounds = pin.getBounds(true);

            return pinBounds.x + pinBounds.width > noteBounds.x &&
                pinBounds.x < noteBounds.x + noteBounds.width &&
                pinBounds.y + pinBounds.height > noteBounds.y &&
                pinBounds.y < noteBounds.y + noteBounds.height;
        }
        return false;
    }
}

export const PinManager = new ManagerForPins();