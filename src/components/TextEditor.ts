import { CanvasTextMetrics, Text, Graphics, FederatedPointerEvent } from "pixi.js";
import { TextNote } from "../notes/TextNote.ts";

export class TextEditor {
    private readonly caret: Graphics;
    private readonly selectionBg: Graphics;
    private readonly textarea: HTMLTextAreaElement;
    private readonly pixiText: Text;
    private note: TextNote;
    private blinkInterval: number = 0;

    constructor(pixiText: Text, note: TextNote) {
        this.pixiText = pixiText;
        this.note = note;

        this.selectionBg = new Graphics();
        this.caret = new Graphics();

        this.initCaret();

        this.textarea = document.createElement('textarea');
        this.initTextarea(note);

        document.body.appendChild(this.textarea);

        pixiText.parent!.addChild(this.selectionBg);
        pixiText.parent!.addChild(this.caret);

        this.selectionBg.roundPixels = true;
        this.caret.roundPixels = true;
        this.pixiText.roundPixels = true;

        this.setupEventListeners();
    }

    private initTextarea(note: TextNote) {
        this.textarea.value = note.content;
        this.textarea.style.position = 'absolute';
        this.textarea.style.left = '-9999px';
        this.textarea.style.top = '0px';
        this.textarea.style.width = '0px';
        this.textarea.style.height = '0px';
    }

    private initCaret() {
        this.caret.rect(0, 0, 1.5, this.pixiText.style.fontSize).fill(0x000000);
        this.caret.visible = false;
    }

    public open(): void {
        this.caret.visible = true;
        this.updateCaretPosition();
        this.textarea.focus();
    }

    private setupEventListeners(): void {
        this.textarea.addEventListener('input', this.handleInput);
        this.textarea.addEventListener('keydown', this.handleKeyDown);
        this.textarea.addEventListener('keyup', this.updateCaretPosition);
        this.pixiText.on("pointerdown", this.handlePointerDown);
    }

    private handleInput = (event: Event): void => {
        const target = event.target as HTMLTextAreaElement;
        if (this.pixiText) {
            this.pixiText.text = target.value;
            this.updateCaretPosition();
        }
        else {
            setTimeout(() => this.updateCaretPosition(), 0);
        }
    };

    private handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this.textarea.blur();
            this.close();
        }

        else {
            setTimeout(() => this.updateCaretPosition(), 1);
        }
    };

    private handlePointerDown = (event: FederatedPointerEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        this.calculateClosestIndex(event);
    };

    private calculateClosestIndex(event: FederatedPointerEvent): void {
        const style = this.pixiText.style;
        const text = this.pixiText.text;
        const localPoint = this.pixiText.toLocal(event.global);

        const anchorOffsetXY = {
            x: this.pixiText.anchor.x * this.pixiText.width,
            y: this.pixiText.anchor.y * this.pixiText.height
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

        this.textarea.selectionStart = this.textarea.selectionEnd = closestIndex;
        this.textarea.focus();
        this.updateCaretPosition();
    }

    private resetBlink() {
        this.caret.visible = true;

        if(this.blinkInterval !== null) {
            clearInterval(this.blinkInterval);
        }

        this.blinkInterval = setInterval(() => {this.caret.visible = !this.caret.visible}, 500);
    }

    private updateCaretPosition = (): void => {
        this.resetBlink();
        this.selectionBg.clear();

        const style = this.pixiText.style;
        const rawText = this.pixiText.text;
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const lineHeight = style.lineHeight || (Number(style.fontSize) * 1.2);

        const metrics = CanvasTextMetrics.measureText(rawText, style);
        const lines = metrics.lines;

        const selectionColor = 0x0078d7;

        for (let i = 0, charOffset = 0; i < lines.length; i++) {
            const lineText = lines[i];
            const lineStart = charOffset;
            let lineEnd = lineStart + lineText.length;

            if (rawText[lineEnd] === '\n' || rawText[lineEnd] === ' ') {
                lineEnd += 1;
            }

            const intersectStart = Math.max(start, lineStart);
            const intersectEnd = Math.min(end, lineEnd);

            if (intersectStart < intersectEnd) {
                let rectX = 0;
                let rectWidth = 0;
                let started = false;
                const escapeSpaces = (s: string) => s.replace(/ /g, '\u00A0');

                for (let j = 0; j < lineText.length; j++) {
                    const charIndex = lineStart + j; // absolute index in raw text
                    const char = lineText[j] === ' ' ? '\u00A0' : lineText[j];
                    const charWidth = CanvasTextMetrics.measureText(char, style).width;

                    if (charIndex >= intersectStart && charIndex < intersectEnd) {
                        if (!started) {
                            const textBefore = escapeSpaces(lineText.substring(0, j));
                            rectX = CanvasTextMetrics.measureText(textBefore, style).width;
                            started = true;
                        }
                        rectWidth += charWidth; // add the width of this selected character
                    }
                }


                // if selection starts at first character, rectX might still be zero, that's fine
                this.selectionBg.rect(
                    this.pixiText.x + rectX,
                    this.pixiText.y + i * lineHeight,
                    rectWidth,
                    lineHeight
                );
            }

            charOffset = lineEnd;
        }

        if (start !== end) {
            this.selectionBg.fill({ color: selectionColor, alpha: 0.3 });
        }

        const cursorPointer = this.textarea.selectionDirection === 'backward' ? start : end;
        const textUntilCaret = rawText.substring(0, cursorPointer);
        const measurementText = textUntilCaret.replace(/\s$/g, '\u00A0');

        const caretMetrics = CanvasTextMetrics.measureText(measurementText, style);
        const caretLineIdx = caretMetrics.lines.length - 1;
        const caretLineText = caretMetrics.lines[caretLineIdx];
        const caretLineMetrics = CanvasTextMetrics.measureText(caretLineText, style);

        this.caret.position.set(
            this.pixiText.x + caretLineMetrics.width,
            this.pixiText.y + (caretLineIdx * lineHeight) + lines.length,
        );
    };

    public close(): void {
        this.note.updateContent(this.textarea.value);
        this.pixiText.text = this.note.content;

        if (this.blinkInterval !== 0) clearInterval(this.blinkInterval);

        this.caret.destroy({children: true});
        this.selectionBg.destroy({children: true});

        if (this.textarea.parentNode) {
            document.body.removeChild(this.textarea);
        }

        this.pixiText.off("pointerdown", this.handlePointerDown);
    }
}
