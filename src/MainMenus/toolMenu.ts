import {Application, Assets, Container, Graphics, Sprite} from "pixi.js";
import {NotesManager} from "../managers/NoteManager.ts";
import {ThreadManager} from "../managers/ThreadManager.ts";

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
        this.redoButton(toolBar);

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

        this.app.stage.addChild(toolBar);
    }

    private redoButton(toolBar: Container) {
        const redoButton = new Container();

        redoButton.position.set(0, 55);

        this.toolSquare(redoButton);
        this.addIcon(redoButton, 'redoIcon.png').then();

        redoButton.eventMode = 'static';
        redoButton.cursor = 'pointer';

        redoButton.on('pointertap', (event) => {
            event.stopPropagation();
            event.preventDefault();

            const deletedNote = NotesManager.redoDeletedNote();

            if (deletedNote) {
                ThreadManager.restoreDeletedThreads(deletedNote);
            }
        });

        toolBar.addChild(redoButton);
    }

    private saveButton(toolBar: Container) {
        const saveButton = new Container();

        saveButton.position.set(0, 0);

        this.toolSquare(saveButton);
        this.addIcon(saveButton, 'saveIcon.png').then();

        saveButton.eventMode = 'static';
        saveButton.cursor = 'pointer';

        saveButton.on('pointertap', (event) => {
            event.stopPropagation();
            event.preventDefault();
            NotesManager.SaveNoteToJSON().then(() => alert("Board has been saved"));
            ThreadManager.SaveThreadToJSON().then(() => {
            });
        });

        toolBar.addChild(saveButton);
    }

    private toolSquare(button: Container) {
        const rect = new Graphics().roundRect(0, 0, SIZE, SIZE, 10).fill('#232023');

        rect.roundPixels = true;

        button.addChild(rect);
    }

    private async addIcon(rect: Container, iconPath: String) {
        const texture = await Assets.load(iconPath);
        const saveIcon = new Sprite(texture);

        saveIcon.roundPixels = true;

        saveIcon.anchor.set(0.5);
        saveIcon.scale.set(0.02);
        saveIcon.position.set(SIZE / 2, SIZE / 2);

        rect.addChild(saveIcon);
    }
}
