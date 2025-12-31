import { CanvasTextMetrics, Text, Graphics, FederatedPointerEvent } from "pixi.js";
import { TextNote } from "../notes/TextNote.ts";

export class TextEditor {
    private caret: Graphics;
    private textarea: HTMLTextAreaElement;
    private pixiText: Text;
    private note: TextNote;
    private blinkInterval: number = 0;

    constructor(pixiText: Text, note: TextNote) {
        this.pixiText = pixiText;
        this.note = note;

        this.caret = new Graphics();
        this.initCaret();

        this.textarea = document.createElement('textarea');
        this.initTextarea(note);

        document.body.appendChild(this.textarea);
        pixiText.parent!.addChild(this.caret);

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
        this.caret.rect(0, 0, 2, 20).fill(0x000000);
        this.caret.visible = false;
    }

    public open(): void {
        this.caret.visible = true;
        this.updateCaretPosition();
        this.textarea.focus();

        this.blinkInterval = setInterval(() => {this.caret.visible = !this.caret.visible}, 500);
    }

    private setupEventListeners(): void {
        this.textarea.addEventListener('input', this.handleInput);
        this.textarea.addEventListener('keydown', this.handleKeyDown);
        this.pixiText.on("pointerdown", this.handlePointerDown);
    }

    private handleInput = (event: Event): void => {
        const target = event.target as HTMLTextAreaElement;
        if (this.pixiText) {
            this.pixiText.text = target.value;
            this.updateCaretPosition();
        }
    };

    private handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            this.textarea.blur();
            this.close();
        }

        setTimeout(() => this.updateCaretPosition(), 0);
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

    private updateCaretPosition(): void {
        this.caret.visible = true;

        const style = this.pixiText.style;
        const cursorPointer = this.textarea?.selectionStart ?? this.pixiText.text.length;
        const text = this.pixiText.text.substring(0, cursorPointer) + "|";

        const metrics = CanvasTextMetrics.measureText(text, style);
        const lines = metrics.lines;
        const lastLine = lines[lines.length - 1];

        const lastLineMetrics = CanvasTextMetrics.measureText(lastLine, style);
        const charWidth = CanvasTextMetrics.measureText("|", style).width;

        const caretX = this.pixiText.x + (lastLineMetrics.width - charWidth);
        const lineHeight = style.lineHeight || (Number(style.fontSize) * 1.2);
        const caretY = this.pixiText.y + (lines.length - 1) * lineHeight;

        this.caret.position.set(caretX, caretY);
    }

    public close(): void {
        this.note.updateContent(this.textarea.value);
        this.pixiText.text = this.note.content;
        this.caret.visible = false;

        if (this.blinkInterval !== 0) clearInterval(this.blinkInterval);

        this.caret.destroy({children: true});

        if (this.textarea.parentNode) {
            document.body.removeChild(this.textarea);
        }

        this.pixiText.off("pointerdown", this.handlePointerDown);
    }
}
