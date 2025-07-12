import { $clanMenuHolder, lastOpenedElements } from "../constants.js"

function onToggleClanMenu_click() {
    $clanMenuHolder.toggle()

    if (!$clanMenuHolder.isHidden) {
        lastOpenedElements.hideAll()

        return lastOpenedElements.set($clanMenuHolder.element.id, $clanMenuHolder)
    } 

    lastOpenedElements.delete($clanMenuHolder.element.id)
}

export default onToggleClanMenu_click