import { NotesManager} from "../managers/NoteManager.ts";

export function BoardMenu(event: MouseEvent, menu: HTMLDivElement, type:string): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = "Add New Text Note";

    button.onclick = () => {
        NotesManager.createNote(event.pageX, event.pageY, type);
        menu.remove();
    };

    return button;
}
