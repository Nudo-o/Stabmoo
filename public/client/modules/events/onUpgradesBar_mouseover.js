import { itemsInfo } from "../constants.js"
import items from "../game_configs/items.js"
import weapons from "../game_configs/weapons.js"

function onUpgradesBar_mouseover(event) {
    event.stopPropagation()

    let target = event.target

    while (!target.classList.contains("action-bar-item")) {
        target = target.parentElement
    }

    const isWeapon = target.querySelector(".action-bar-item-icon.action-weapon")
    const itemIndex = parseInt(target.getAttribute(!isWeapon ? "index" : "windex"))
    const settings = isWeapon ? weapons[itemIndex] : items[itemIndex]

    itemsInfo.show(settings)
}

export default onUpgradesBar_mouseover