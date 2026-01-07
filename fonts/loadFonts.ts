import {Assets, BitmapFont, TextStyle} from "pixi.js";

export async function loadFonts() {
    try {
        await Assets.load({
            alias: 'Baskervville Regular',
            src: '/Baskervville-Regular.ttf',
        });

        await document.fonts.ready;
    } catch (error) {
        console.error("Font failed to load: ", error);
    }
}

export async function prepareBitmapFont() {
    const style = new TextStyle({
        fontFamily: 'Baskervville Regular',
        fill: 'rgb(222,219,212)',
    });

    BitmapFont.install({
        name: 'BaskervilleBitmap',
        style,
        chars: [
            ['a', 'z'],
            '0123456789',
            ['0', '9'],
            ['A', 'Z']
        ],
        resolution: window.devicePixelRatio,
    });
}
