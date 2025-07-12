import { playersManager, profileCard } from "../../../../constants.js"

function updateResource(data) {
    playersManager.player[data[0]] = parseInt(data[1])

    profileCard.updateResources()
}

export default updateResource