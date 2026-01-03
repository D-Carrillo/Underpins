import {BaseNoteMenu} from "./BaseNoteMenu.ts";

export function TextNoteMenu(_: MouseEvent, menu: HTMLDivElement, id: string) {
    const deleteNoteButton = document.createElement("button");
    deleteNoteButton.textContent = "Delete Text Note";

    BaseNoteMenu(menu, id, deleteNoteButton);
}
