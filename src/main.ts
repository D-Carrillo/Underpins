import { Application } from 'pixi.js';
import {Board} from "./components/Board.ts";
import {toolMenu} from "./MainMenus/toolMenu.ts";

// import {showMenu} from "./MainMenus/showMenu.ts";
// import {loadFonts, prepareBitmapFont} from "../fonts/loadFonts.ts";

const app = new Application();

async function init() {
  await app.init({
    resizeTo: window,
    antialias:true,
    background: 'rgb(222,219,212)', //Ghostly White
    resolution: window.devicePixelRatio,
    autoDensity: true,
    roundPixels: true,
  });

  document.body.appendChild(app.canvas);

  // await loadFonts();
  // await prepareBitmapFont();
  // showMenu(app);

  const myBoard = new Board(app);
  app.ticker.add(() => {
    myBoard.update();
  });

   new toolMenu(app);
}

init();