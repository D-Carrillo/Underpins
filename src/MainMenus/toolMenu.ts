import {Application, Assets, Container, Graphics, Sprite} from "pixi.js";
import {NotesManager} from "../managers/NoteManager.ts";
import {ThreadManager} from "../managers/ThreadManager.ts";
import {BoardManager} from "../managers/BoardManager.ts";

const SIZE = 50;

export class toolMenu
{
    private app : Application;

    constructor(app: Application) {
        this.app = app;
        this.saveButton();
    }

    private saveButton() {
        const container = new Container();

        this.toolSquare(container);
        this.addSaveIcon(container).then();

        container.eventMode = 'static';
        container.cursor = 'pointer';

        container.position.set(10, this.app.screen.height / 2 - 50);

        const stayInMiddle = () => {
            container.position.set(10, this.app.screen.height / 2 - 50);
        }

        const resizeObserver = new ResizeObserver(entries => {
           for (let _ of entries) {
               stayInMiddle();
           }
        });

        resizeObserver.observe(document.documentElement);

        // Still need to remove the event Listener if it allows to create more boards.

        container.on('pointertap', (event) => {
            event.stopPropagation();
            event.preventDefault();
            NotesManager.SaveNoteToJSON().then(() => alert("Board has been saved"));
            ThreadManager.SaveThreadToJSON().then(() => {
            });
        });

        BoardManager.getStage()!.addChild(container);
    }

    private toolSquare(container: Container) {
        const rect = new Graphics().roundRect(0, 0, SIZE, SIZE, 10).fill('#232023');

        rect.roundPixels = true;

        container.addChild(rect);
    }

    private async addSaveIcon(container: Container) {
        const texture = await Assets.load('/saveIcon.png');
        const saveIcon = new Sprite(texture);

        saveIcon.roundPixels = true;

        saveIcon.anchor.set(0.5);
        saveIcon.scale.set(0.02);
        saveIcon.position.set(SIZE / 2, SIZE / 2);

        container.addChild(saveIcon);
    }
}
