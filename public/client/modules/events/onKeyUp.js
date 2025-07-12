import { $leaderBoard, lastOpenedElements, playersManager, socket } from "../constants.js";
import isFocusOnInput from "../utils/isFocusOnInput.js";

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const hitEvent = 67

function onKeyUp(event) {
    if (event.code === "Tab") {
        event.preventDefault()
    }
    
    if (!playersManager.player?.isAlive) return

    if (event.code === "Space" && playersManager.player.attackState && !playersManager.player.autoAttackState) {
        socket.send(hitEvent * fourInt, 0)

        playersManager.player.attackState = false
    }

    if (event.code === "Tab" && !$leaderBoard.isHidden) {
        lastOpenedElements.forEach((element) => {
            element.show()
        })

        $leaderBoard.hide()
    }
}

export default onKeyUp