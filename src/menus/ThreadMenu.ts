import {ThreadManager} from "../managers/ThreadManager.ts";

export function ThreadMenu(event: MouseEvent, menu: HTMLDivElement, threadID: string) {
    const button = document.createElement("button");
    button.textContent = "Delete Thread";

    console.log(event + threadID);

    button.onclick = () => {
        ThreadManager.deleteThread(threadID)
        menu.remove();
    };

    menu.appendChild(button);
}
