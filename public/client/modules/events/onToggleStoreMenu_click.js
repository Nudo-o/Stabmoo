import { $storeMenuHolder, lastOpenedElements } from "../constants.js"

function onToggleStoreMenu_click() {
    $storeMenuHolder.toggle()

    if (!$storeMenuHolder.isHidden) {
        lastOpenedElements.hideAll()

        return lastOpenedElements.set($storeMenuHolder.element.id, $storeMenuHolder)
    } 

    lastOpenedElements.delete($storeMenuHolder.element.id)
}

export default onToggleStoreMenu_click