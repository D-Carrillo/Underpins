import {BaseNoteMenu} from "./BaseNoteMenu.ts";

export function ImageNoteMenu(_: MouseEvent, menu: HTMLDivElement, id: string) {
    const deleteNoteButton = document.createElement("button");
    deleteNoteButton.textContent = "Delete Image Note";

    BaseNoteMenu(menu, id, deleteNoteButton);
}
