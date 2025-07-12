import { playersManager } from "../../../../constants.js"

function updateItemsCount(data) {
    playersManager.player.updateItemsCount(data[0])
}

export default updateItemsCount