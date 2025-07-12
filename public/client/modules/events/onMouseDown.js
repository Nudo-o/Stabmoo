import { playersManager, socket } from "../constants.js"
import isFocusOnInput from "../utils/isFocusOnInput.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const hitEvent = 67

function onMouseDown(event) {
    if (!playersManager.player?.isAlive || isFocusOnInput()) return

    if (!playersManager.player.attackState && 
        !playersManager.player.autoAttackState || 
        playersManager.player.buildIndex >= 0) {
        socket.send(hitEvent * fourInt, 1)

        playersManager.player.attackState = true
    }
}

export default onMouseDown