import config from "../config.js"
import { $chatHolder, $chatInput, $debugPanelHolder, $gameUI, $leaderBoard, keys, lastOpenedElements, playersManager, socket } from "../constants.js"
import formatText from "../utils/formatText.js"
import isFocusOnInput from "../utils/isFocusOnInput.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const hitEvent = 67
const selectItemEvent = 28.75
const chatMessageEvent = 140.75
const autoAttackEvent = 89

function onKeyDown(event) {
    if (event.code === "Tab") {
        event.preventDefault()
    }

    if (event.code === "Enter" && !$gameUI.isHidden && $leaderBoard.isHidden && !keys.has(event.code)) {
        $chatHolder.toggle()

        if (!$chatHolder.isHidden) {
            lastOpenedElements.hideAll()

            lastOpenedElements.set($chatHolder.element.id, $chatHolder)

            $chatInput.focus()
        } else {
            lastOpenedElements.delete($chatHolder.element.id)

            const value = formatText($chatInput.value, config.maxChatLength, "")

            if (value) {
                socket.send(chatMessageEvent * fourInt, value)
            }
        }

        $chatInput.value = ""
    }

    if (event.code === "Escape" && !keys.has(event.code)) {
        lastOpenedElements.hideAll()
    }

    if (!playersManager.player?.isAlive || isFocusOnInput()) return

    const keyNum = event.which || event.keyCode || 0
    const playerWeapons = playersManager.player.weapons
    const playerItems = playersManager.player.items

    if (playerWeapons[keyNum - 49] !== undefined) {
        socket.send(selectItemEvent * fourInt, playerWeapons[keyNum - 49], true)
    } else if (playerItems[keyNum - 49 - playerWeapons.length] !== undefined) {
        socket.send(selectItemEvent * fourInt, playerItems[keyNum - 49 - playerWeapons.length])
    }

    if (event.code === "Space") {
        if (!playersManager.player.attackState && 
            !playersManager.player.autoAttackState || 
            playersManager.player.buildIndex >= 0) {
        
            socket.send(hitEvent * fourInt, 1)

            playersManager.player.attackState = true
        }
    }

    if (!keys.has(event.code)) {
        if (event.code === "KeyQ") {
            if (playersManager.player.buildIndex === playerItems[0]) return
    
            socket.send(selectItemEvent * fourInt, playerItems[0])
        }
    
        if (event.code === "KeyE") {
            socket.send(autoAttackEvent * fourInt)
    
            playersManager.player.autoAttackState = !playersManager.player.autoAttackState
        }
    
        if (event.code === "KeyX") {
            playersManager.player.lockDir = !playersManager.player.lockDir
        }
    
        if (event.ctrlKey && event.code === "KeyZ") {
            $debugPanelHolder.toggle()
        }
    }

    if (event.code === "Tab" && $leaderBoard.isHidden && !keys.has(event.code)) {     
        lastOpenedElements.forEach((element) => {
            element.hide()
        })

        $leaderBoard.show()
    }
}

export default onKeyDown