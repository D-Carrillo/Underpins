import { Application } from 'pixi.js';
import {showMenu} from "./MainMenu/showMenu.ts";
import {loadFonts, prepareBitmapFont} from "../fonts/loadFonts.ts";

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

  await loadFonts();
  await prepareBitmapFont();
  showMenu(app);
}

init();