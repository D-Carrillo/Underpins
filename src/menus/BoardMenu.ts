import {NotesManager} from "../managers/NoteManager.ts";
import {NoteTypes} from "../factories/NoteTypesEnum.ts";
import { invoke } from "@tauri-apps/api/core";

export function BoardMenu(event: MouseEvent, menu: HTMLDivElement, _: string) {
    const TextNoteNewButton = document.createElement("button");
    TextNoteNewButton.textContent = "Add Text Note";

    const ImageNoteNewButton = document.createElement("button");
    ImageNoteNewButton.textContent = "Add Image Note";

    TextNoteNewButton.onclick = () => {
        NotesManager.createNote(event.pageX, event.pageY, NoteTypes.TEXT);
        menu.remove();
    };

    ImageNoteNewButton.onclick = () => {
        /*NotesManager.createNote(event.pageX, event.pageY, NoteTypes.IMAGE); */
        invoke('image_setter', {image: "Image"}).then(msg => console.log(msg));
        menu.remove();
    }

    menu.appendChild(TextNoteNewButton);
    menu.appendChild(ImageNoteNewButton);
}
