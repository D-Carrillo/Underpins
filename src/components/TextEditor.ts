import {CanvasTextMetrics, Text, Graphics} from "pixi.js";
import { TextNote } from "../notes/TextNote.ts";

const caret = new Graphics();

function initCaret(caret: Graphics) {
    caret.fill(0x000000);
    caret.rect(0, 0, 1, 20);
    caret.visible = false;
}

export function openEditor(pixiText: Text, note: TextNote) {
    const textarea = document.createElement('textarea');

    textarea.value = note.content;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '0px';
    textarea.style.width = '0px';
    textarea.style.height = '0px';

    document.body.appendChild(textarea);

    initCaret(caret);
    caret.visible = true;
    if (pixiText.parent) pixiText.parent!.addChild(caret);
    updateCaretPosition(pixiText);
    textarea.focus();

    const closeEditor = () => {
        note.updateContent(textarea.value);
        pixiText.text = note.content;
        pixiText.visible = true;
        caret.visible = false;
        document.body.removeChild(textarea);
    }

    textarea.addEventListener('input', (event) => {
        const target = event.target as HTMLTextAreaElement;
        console.log(target.value);
        if (pixiText) {
            pixiText.text = target.value;
            updateCaretPosition(pixiText);
        }
    });

    textarea.addEventListener('blur', closeEditor);
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textarea.blur();
        }

        setTimeout(() => updateCaretPosition(pixiText), 0);
    });
}

function updateCaretPosition(pixiText: Text) {

    const style = pixiText.style;

    const textarea = document.activeElement as HTMLTextAreaElement;
    const cursorPointer = textarea?.selectionStart ?? pixiText.text.length;

    const text = pixiText.text.substring(0, cursorPointer) + "|";

    const metrics = CanvasTextMetrics.measureText(text, style);

    const lines = metrics.lines;
    const lastLine = lines[lines.length - 1];

    const lastLineMetrics = CanvasTextMetrics.measureText(lastLine, style);
    const charWidth = CanvasTextMetrics.measureText("|", style).width;

    const caretX = pixiText.x + (lastLineMetrics.width - charWidth);
    const lineHeight = style.lineHeight || (Number(style.fontSize) * 1.2);
    const caretY = pixiText.y + (lines.length - 1) * lineHeight;

    caret.position.set(caretX, caretY);
}