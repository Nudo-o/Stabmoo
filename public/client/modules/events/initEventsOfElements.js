import { $actionBar, $canvas, $enterGame, $nameInput, $skinList, $toggleClanMenu, $toggleStoreMenu, $upgradesBar, keys, particlesManager } from "../constants.js"
import isFocusOnInput from "../utils/isFocusOnInput.js"
import onActionBar_click from "./onActionBar_click.js"
import onActionBar_mouseover from "./onActionBar_mouseover.js"
import onActionBar_mouseout from "./onActionBar_mouseout.js"
import onEnterGame_click from "./onEnterGame_click.js"
import onKeyDown from "./onKeyDown.js"
import onKeyUp from "./onKeyUp.js"
import onMouseDown from "./onMouseDown.js"
import onMouseUp from "./onMouseUp.js"
import onNameInput_blur from "./onNameInput__blur.js"
import onSkinList_click from "./onSkinList_click.js"
import onToggleClanMenu_click from "./onToggleClanMenu_click.js"
import onToggleStoreMenu_click from "./onToggleStoreMenu_click.js"
import onUpgradesBar_click from "./onUpgradesBar_click.js"
import onUpgradesBar_mouseover from "./onUpgradesBar_mouseover.js"
import onUpgradesBar_mouseout from "./onUpgradesBar_mouseout.js"

function eventIsTrusted(event) {
    if (event && typeof event.isTrusted == "boolean") {
        return event.isTrusted
    } else {
        return true
    }
}

function checkTrusted(callback) {
    return function(event) {
        if (event && event instanceof Event && eventIsTrusted(event)) {
            callback(event)
        }
    }
}

function initEventsOfElements() {
    window.addEventListener("mousemove", (event) => {
        window.mouseX = event.clientX
        window.mouseY = event.clientY
    }, false)
    
    document.addEventListener("focus", () => {
        particlesManager.reset()
    })

    $nameInput.value = localStorage.getItem("oldmoo_name") || ""

    $nameInput.on("blur", checkTrusted(onNameInput_blur), false)

    $enterGame.on("click", checkTrusted(onEnterGame_click), false)
    $skinList.on("click", checkTrusted(onSkinList_click), false)

    $actionBar.on("click", checkTrusted(onActionBar_click), false)
    $actionBar.on("mouseover", checkTrusted(onActionBar_mouseover), false)
    $actionBar.on("mouseout", checkTrusted(onActionBar_mouseout), false)

    $toggleClanMenu.on("click", checkTrusted(onToggleClanMenu_click), false)
    $toggleStoreMenu.on("click", checkTrusted(onToggleStoreMenu_click), false)

    $upgradesBar.on("click", checkTrusted(onUpgradesBar_click), false)
    $upgradesBar.on("mouseover", checkTrusted(onUpgradesBar_mouseover), false)
    $upgradesBar.on("mouseout", checkTrusted(onUpgradesBar_mouseout), false)

    $canvas.addEventListener("mousedown", checkTrusted(onMouseDown), false)
    $canvas.addEventListener("mouseup", checkTrusted(onMouseUp), false)
    window.addEventListener("keydown", checkTrusted(onKeyDown), false)
    window.addEventListener("keyup", checkTrusted(onKeyUp), false)

    window.addEventListener("keydown", (event) => {
        if (isFocusOnInput()) return keys.clear()

        if (keys.has(event.code)) return

        keys.set(event.code, true)
    }, false)

    window.addEventListener("keyup", (event) => {
        if (isFocusOnInput()) return keys.clear()

        if (!keys.has(event.code)) return

        keys.delete(event.code)
    }, false)
}

export default initEventsOfElements