import {NotesManager} from "../managers/NoteManager.ts";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import { invoke } from "@tauri-apps/api/core";
import {BoardManager} from "../managers/BoardManager.ts";

export function BoardMenu(event: MouseEvent, menu: HTMLDivElement, _: string) {
    const TextNoteNewButton = document.createElement("button");
    TextNoteNewButton.textContent = "Add Text Note";

    const ImageNoteNewButton = document.createElement("button");
    ImageNoteNewButton.textContent = "Add Image Note";

    TextNoteNewButton.onclick = () => {
        const pos = BoardManager.getViewport()?.toLocal(event)!;
        NotesManager.createNote(pos.x, pos.y, NoteTypes.TEXT, "New Note");
        menu.remove();
    };

    ImageNoteNewButton.onclick = async () => {
        try {
            const newImagePath = await invoke('image_setter') as string;
            const pos = BoardManager.getViewport()?.toLocal(event)!;

            NotesManager.createNote(pos.x, pos.y, NoteTypes.IMAGE, newImagePath);
        } catch (error) {
            console.error("Error choosing or copying file", error);
        }

        menu.remove();
    }

    menu.appendChild(TextNoteNewButton);
    menu.appendChild(ImageNoteNewButton);
}
