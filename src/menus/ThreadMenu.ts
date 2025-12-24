
export function ThreadMenu(event: MouseEvent, menu: HTMLDivElement, type: string) {
    const button = document.createElement("button");
    button.textContent = "Delete Thread";

    console.log(event + type);

    button.onclick = () => {
        menu.remove();
    };

    menu.appendChild(button);
}
