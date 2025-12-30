import {Text} from "pixi.js";
import {TextNote} from "../notes/TextNote.ts";

export function openEditor(pixiText: Text, note: TextNote){
    const globalPos = pixiText.getGlobalPosition();

    const textarea = document.createElement('textarea');

    pixiText.visible = false;

    Object.assign(textarea.style, {
        position: 'absolute',
        left: `${globalPos.x - 2}px`,
        top: `${ globalPos.y - 1}px`,
        width: `${note.sizes.width - 25}px`,
        height: `${note.sizes.height - 12}px`,
        fontSize: `${pixiText.style.fontSize}px`,
        fontFamily: pixiText.style.fontFamily,
        color: pixiText.style.fill as string,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        padding: `none`,
        overflow: 'hidden',
        margin: `0px`,
        transformOrigin: 'left top',
    });

    textarea.value = note.content;
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
