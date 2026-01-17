import {Bounds, Graphics, Sprite} from "pixi.js";

class ManagerForPins {
    private pins: Map<string, Sprite> = new Map<string, Sprite>();

    public addPin(pinLabel: string, pin: Sprite) {
        this.pins.set(pinLabel, pin);
    }

    public deletePin(pinLabel: string) {
        if (this.pins.has(pinLabel)) {
            this.pins.delete(pinLabel);
        }
    }

    public aPinIsBelow(note: Graphics, pin: Sprite): boolean {
        const noteBounds = note.getBounds(true);

        return Array.from(this.pins.values()).some(pinInstance => this.checkIfBelow(pinInstance, noteBounds, note, pin));
    }

    private checkIfBelow(pinInstance: Sprite, noteBounds: Bounds, note: Graphics, pin: Sprite): boolean {
        if (pin === undefined) {console.log("The pin was undefined");}

        if (pinInstance.label != pin.label && pinInstance.zIndex < note.zIndex) {
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