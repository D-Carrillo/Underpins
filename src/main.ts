import { Application } from 'pixi.js';
import {Board} from "./components/Board.ts";

const app = new Application();

async function init() {
  await app.init({
    resizeTo: window,
    antialias:true,
    background: '#f8f8ff',
    resolution: window.devicePixelRatio,
    autoDensity: true,
    roundPixels: true,
  });

  document.body.appendChild(app.canvas);


  const myBoard = new Board(app);

  app.ticker.add(() => {
    myBoard.update();
  })
}

init();