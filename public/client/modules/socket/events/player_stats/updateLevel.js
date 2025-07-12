import { playersManager, profileCard } from "../../../../constants.js"

function updateLevel(data) {
    playersManager.player.updateLevel(...data)

    profileCard.updateLevelBar()
}

export default updateLevel