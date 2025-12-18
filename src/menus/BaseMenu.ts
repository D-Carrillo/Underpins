type MenuCreator = (e: MouseEvent, m: HTMLDivElement, t: string) => HTMLButtonElement;

export function useContextMenu(event: MouseEvent,  wantedMenu: MenuCreator, wildcard: string) {
    event.preventDefault();

    document.querySelectorAll(".custom-menu").forEach((el) => el.remove());

    const menu = document.createElement("div");
    menu.className = "custom-menu";
    menu.style.position = "absolute";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;

    const button = wantedMenu(event, menu, wildcard);

    menu.appendChild(button);
    document.body.appendChild(menu);

    const closeMenu = () => menu.remove();
    const escClose = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();

    setTimeout(() => document.addEventListener("click", closeMenu, {once: true}));
    document.addEventListener("keydown", escClose, {once: true});
}
