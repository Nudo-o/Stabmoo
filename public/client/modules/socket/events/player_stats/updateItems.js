import { playersManager } from "../../../../constants.js"

function updateItems(data) {
    if (data[1]) {
        playersManager.player.updateWeapons(data[0])
    } else {
        playersManager.player.updateItems(data[0])
    }

    playersManager.player.updateActionItems()
}

export default updateItems