import { playersManager, socket } from "../constants.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const hitEvent = 67

function onMouseUp(event) {
    if (!playersManager.player?.isAlive) return

    if (playersManager.player.attackState && !playersManager.player.autoAttackState) {
        socket.send(hitEvent * fourInt, 0)

        playersManager.player.attackState = false
    }
}

export default onMouseUp