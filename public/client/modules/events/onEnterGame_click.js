import config from "../config.js"
import { $gameStateText, $menuCardHolder, $nameInput, socket } from "../constants.js"
import formatText from "../utils/formatText.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const spawnEvent = 33

function onEnterGame_click() {
    $menuCardHolder.hide()
    $gameStateText.show()
    $gameStateText.text = "Loading..."

    const activeSkin = document.querySelector(".skin-item.active-skin")
    const skinIndex = parseInt(activeSkin.getAttribute("index"))

    socket.send(spawnEvent * fourInt, formatText($nameInput.value, config.maxNicknameLength, "Stabber"), skinIndex)
}

export default onEnterGame_click