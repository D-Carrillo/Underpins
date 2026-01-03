import {HandThread} from "../threads/handThread.ts";
import {NotesManager} from "../managers/NoteManager.ts";

export function BaseNoteMenu(menu: HTMLDivElement, id: string, deleteNoteButton: HTMLButtonElement) {
    const createThreadButton = document.createElement("button");
    createThreadButton.textContent = "Create a Thread";

    createThreadButton.onclick = (event) => {
        HandThread.linkToHand(event, id);
        menu.remove();
    }

    deleteNoteButton.onclick = () => {
        NotesManager.deleteNote(id);
        menu.remove();
    };

    menu.appendChild(createThreadButton);
    menu.appendChild(deleteNoteButton);
}