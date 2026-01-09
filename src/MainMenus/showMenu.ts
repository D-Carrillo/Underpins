import {Application, BitmapText, Container, Graphics, TextStyle} from "pixi.js";
import {Board} from "../components/Board.ts";
import {toolMenu} from "./toolMenu.ts";

export function showMenu(app: Application, viewport: Container) {
    const menuContainer = new Container();
    app.stage.addChild(menuContainer);

    const startButton = new Graphics().rect( 0, 0, 200, 50).fill('#232023');

    menuContainer.position.set(window.innerWidth / 2 - 100, window.innerHeight / 2  - 50);

    const style = new TextStyle({
        fontFamily: 'BaskervilleBitmap',
        fontSize: 20,
        align: "center",
    });

    const loadText = new BitmapText({
        text: "Load Board",
        style,
    });

    loadText.position.set(50, 12.5)

    startButton.interactive = true;
    startButton.cursor = "pointer";
    startButton.on("pointerdown", (event) => {
        event.stopPropagation();
        window.removeEventListener('resize', stayInMiddle);
        menuContainer.destroy({children: true});
        startBoard(app, viewport);
    });

    const stayInMiddle = () => {
        menuContainer.position.set(app.screen.width / 2 - 100, app.screen.height / 2  - 50);
    }

    window.addEventListener('resize', stayInMiddle);

    menuContainer.addChild(startButton);
    menuContainer.addChild(loadText);

}

function startBoard(app: Application, viewport: Container) {
    const myBoard = new Board(app, viewport);
    app.ticker.add(() => {
        myBoard.update();
    });

    new toolMenu(app);
}
