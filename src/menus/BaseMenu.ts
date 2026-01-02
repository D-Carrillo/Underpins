export type MenuCreator = (e: MouseEvent, m: HTMLDivElement, t: string) => void;

export function useContextMenu(event: MouseEvent,  wantedMenu: MenuCreator, wildcard: string) {
    event.preventDefault();

    document.querySelectorAll(".custom-menu").forEach((el) => el.remove());

    const menu = document.createElement("div");
    menu.className = "custom-menu";
    menu.style.position = "absolute";
    menu.style.display = 'flex';
    menu.style.flexDirection = "column";
    menu.style.top = `${event.pageY}px`;
    menu.style.left = `${event.pageX}px`;

    wantedMenu(event, menu, wildcard);

    document.body.appendChild(menu);


    const closeMenu = () => menu.remove();
    const escClose = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();

    setTimeout(() => document.addEventListener("click", closeMenu, {once: true}));
    document.addEventListener("keydown", escClose, {once: true});
}
