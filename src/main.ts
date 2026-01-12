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

  viewport.drag().pinch().wheel().decelerate().clampZoom({
    minWidth: Math.floor(window.innerWidth / 2),
    minHeight: Math.floor(window.innerHeight / 2),
    maxWidth: Math.floor(window.innerWidth * 2.5),
    maxHeight: Math.floor(window.innerHeight * 2.5),
  }).sortableChildren = true;

  viewport.plugins.pause('drag');

  document.body.appendChild(app.canvas);
  document.addEventListener('resize', () => {
    viewport.worldWidth = window.innerWidth;
    viewport.worldHeight = window.innerHeight;

    viewport.clampZoom({
      minWidth: Math.floor(window.innerWidth / 2),
      minHeight: Math.floor(window.innerHeight / 2),
      maxWidth: Math.floor(window.innerWidth * 2.5),
      maxHeight: Math.floor(window.innerHeight * 2.5),
    });
  });

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