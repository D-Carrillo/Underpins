import {Application, Text} from "pixi.js";
import {TextNote} from "../notes/TextNote.ts";

const getCanvasBounds = (app: Application) => {
    return app.canvas.getBoundingClientRect();
};

export function openEditor(pixiText: Text, app: Application, note: TextNote){
    const canvasBounds = getCanvasBounds(app);
    const globalPos = pixiText.getGlobalPosition();

    const textarea = document.createElement('textarea');

    pixiText.visible = false;

    Object.assign(textarea.style, {
        position: 'absolute',
        left: `${canvasBounds.left + globalPos.x}px`,
        top: `${canvasBounds.top + globalPos.y}px`,
        width: `${note.sizes.width}px`,
        height: `${note.sizes.height}px`,
        fontSize: `${pixiText.style.fontSize}px`,
        fontFamily: pixiText.style.fontFamily,
        color: pixiText.style.fill as string,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        lineHeight: pixiText.style.lineHeight ? `${pixiText.style.lineHeight}px` : 'normal'
    });

    textarea.value = pixiText.text;
    document.body.appendChild(textarea);
    textarea.focus();

    const closeEditor = () => {
        note.updateContent(textarea.value);
        pixiText.text = note.content;
        pixiText.visible = true;
        document.body.removeChild(textarea);
    }

    textarea.addEventListener('blur', closeEditor);
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textarea.blur();
        }
    })
}