import { playersManager } from "../../../../constants.js"

function removePlayer(data) {
    if (data[0] === playersManager.player?.id) {
        playersManager.player.isAlive = false

        return
    }

    playersManager.remove(data[0])
}

export default removePlayer