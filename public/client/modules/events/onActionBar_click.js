import { $actionBar, playersManager, socket } from "../constants.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const selectItemEvent = 28.75

function onActionBar_click(event) {
    event.stopPropagation()

    let target = event.target

    if (!target.classList.contains("action-bar-item")) {
        target = target.parentElement
    }

    const index = parseInt(target.getAttribute("index"))
    const icon = target.querySelector(".action-bar-item-icon")

    if (icon.classList.contains("action-weapon")) {
        return socket.send(selectItemEvent * fourInt, index, true)
    }

    if (playersManager.player.buildIndex === index) return

    socket.send(selectItemEvent * fourInt, index)
}

export default onActionBar_click
