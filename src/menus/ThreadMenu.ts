import {ThreadManager} from "../managers/ThreadManager.ts";

export function ThreadMenu(_: MouseEvent, menu: HTMLDivElement, threadID: string) {
    const button = document.createElement("button");
    button.textContent = "Delete Thread";

    button.onclick = () => {
        ThreadManager.deleteThread(threadID)
        menu.remove();
    };

    menu.appendChild(button);
}
