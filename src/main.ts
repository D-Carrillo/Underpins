import { Application } from 'pixi.js';
import {showMenu} from "./MainMenus/showMenu.ts";
import {loadFonts, prepareBitmapFont} from "../fonts/loadFonts.ts";
import { Viewport } from "pixi-viewport";

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

  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: window.innerWidth,
    worldHeight: window.innerHeight,
    events: app.renderer.events,
  })

  app.stage.addChild(viewport);

  viewport.drag().pinch().wheel().decelerate().sortableChildren = true;

  viewport.plugins.pause('drag');

  document.body.appendChild(app.canvas);

  await loadFonts();
  await prepareBitmapFont();
  showMenu(app, viewport);

  // const myBoard = new Board(app);
  // app.ticker.add(() => {
  //   myBoard.update();
  // });
  //
}

init();