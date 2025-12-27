import { NotesManager } from "../managers/NoteManager.ts";
import {HandThread} from "../threads/handThread.ts";

export function NoteMenu(_: MouseEvent, menu: HTMLDivElement, id: string) {
    const deleteNoteButton = document.createElement("button");
    deleteNoteButton.textContent = "Delete Text Note";

    const createThreadButton = document.createElement("button");
    createThreadButton.textContent = "Create a Thread";

    deleteNoteButton.onclick = () => {
        NotesManager.deleteNote(id);
        menu.remove();
    };

    createThreadButton.onclick = (event) => {

        HandThread.linkToHand(event, id);
        menu.remove();
    }

    menu.appendChild(deleteNoteButton);
    menu.appendChild(createThreadButton);
}
