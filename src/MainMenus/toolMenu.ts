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
        this.makeToolBar();
    }

    private makeToolBar() {
        const toolBar = new Container();

        this.saveButton(toolBar);

        toolBar.eventMode = 'static';
        toolBar.cursor = 'pointer';

        toolBar.position.set(10, this.app.screen.height / 2 - 50);

        const stayInMiddle = () => {
            toolBar.position.set(10, this.app.screen.height / 2 - 50);
        }

        const resizeObserver = new ResizeObserver(entries => {
            for (let _ of entries) {
                stayInMiddle();
            }
        });

        resizeObserver.observe(document.documentElement);

        BoardManager.getStage()!.addChild(toolBar);
    }

    private saveButton(toolBar: Container) {
        const saveButton = new Container();

        this.toolSquare(saveButton);
        this.addIcon(saveButton, 'saveIcon.png').then();

        saveButton.on('pointertap', (event) => {
            event.stopPropagation();
            event.preventDefault();
            NotesManager.SaveNoteToJSON().then(() => alert("Board has been saved"));
            ThreadManager.SaveThreadToJSON().then(() => {
            });
        });

        toolBar.addChild(saveButton);
    }

    private toolSquare(saveButton: Container) {
        const rect = new Graphics().roundRect(0, 0, SIZE, SIZE, 10).fill('#232023');

        rect.roundPixels = true;

        saveButton.addChild(rect);
    }

    private async addIcon(saveButton: Container, iconPath: String) {
        const texture = await Assets.load(iconPath);
        const saveIcon = new Sprite(texture);

        saveIcon.roundPixels = true;

        saveIcon.anchor.set(0.5);
        saveIcon.scale.set(0.02);
        saveIcon.position.set(SIZE / 2, SIZE / 2);

        saveButton.addChild(saveIcon);
    }
}
