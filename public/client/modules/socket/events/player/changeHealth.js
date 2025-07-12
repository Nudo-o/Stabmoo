import { playersManager, profileCard } from "../../../../constants.js"

function changeHealth(data) {
    const player = playersManager.players.get(data[0])

    if (!player) return

    player.changeHealth(data[1])

    if (player.id === playersManager.player.id) {
        profileCard.updateHealthBar()
    }
}

export default changeHealth
