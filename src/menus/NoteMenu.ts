import { NotesManager } from "../managers/NoteManager.ts";

export function NoteMenu(event: MouseEvent, menu: HTMLDivElement, id: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = "Delete Text Note";

    console.log(event);

    button.onclick = () => {
        NotesManager.deleteNote(id);
        menu.remove();
    };

    return button;
}
