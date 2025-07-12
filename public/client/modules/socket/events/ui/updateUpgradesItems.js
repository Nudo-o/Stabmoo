import { playersManager } from "../../../../constants.js"

function updateUpgradesItems(data) {
    playersManager.player.updateUpgradesItems(data[0])
}

export default updateUpgradesItems