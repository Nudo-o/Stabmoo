import { $upgradesBar, itemsInfo, socket } from "../constants.js"
import items from "../game_configs/items.js"
import weapons from "../game_configs/weapons.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const upgradeItemEvent = 213

function onUpgradesBar_click(event) {
    const actionItem = event.target.querySelector(".action-bar-item-icon")

    if (actionItem.classList.contains("action-weapon")) {
        const wIndex = parseInt(actionItem.parentElement.parentElement.getAttribute("windex"))
        const weapon = weapons[wIndex]

        if (!weapon) return

        $upgradesBar.html = ""

        itemsInfo.hide()

        return socket.send(upgradeItemEvent * fourInt, weapon.id, true)
    }

    const bIndex = parseInt(actionItem.getAttribute("bindex"))
    const item = items[bIndex]

    if (!item) return

    $upgradesBar.html = ""

    socket.send(upgradeItemEvent * fourInt, item.id)

    itemsInfo.hide()
}

export default onUpgradesBar_click