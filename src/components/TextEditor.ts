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
        caret.visible = false;
        document.body.removeChild(textarea);
        console.log('Got closed');
    }

    textarea.addEventListener('input', (event) => {
        const target = event.target as HTMLTextAreaElement;
        if (pixiText) {
            pixiText.text = target.value;
            updateCaretPosition(pixiText);
        }
    });

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textarea.blur();
            closeEditor();
        }

        setTimeout(() => updateCaretPosition(pixiText), 0);
    });

    pixiText.on('pointerdown', (event) => {
        event.stopPropagation();
        event.preventDefault();

        const style = pixiText.style;
        const text = pixiText.text;

        const localPoint = pixiText.toLocal(event.global);

        const anchorOffsetXY = {
            x: pixiText.anchor.x * pixiText.width,
            y: pixiText.anchor.y * pixiText.height
        };

        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i <= text.length; i++) {
            const testText = text.substring(0, i);
            const metrics = CanvasTextMetrics.measureText(testText, style);

            const lines = metrics.lines;
            const lastLine = lines[lines.length - 1] || "";
            const lastLineMetrics = CanvasTextMetrics.measureText(lastLine, style);

            const charX = lastLineMetrics.width - anchorOffsetXY.x;
            const lineHeight = style.lineHeight || (Number(style.fontSize) * 1.2);
            const charY = ((lines.length - 1) * lineHeight) - anchorOffsetXY.y;

            const dx = localPoint.x - charX;
            const dy = localPoint.y - (charY + (Number(style.fontSize) / 2));
            const distance = (dx * dx) + (dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }

        textarea.selectionStart = textarea.selectionEnd = closestIndex;
        textarea.focus();
        updateCaretPosition(pixiText);
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