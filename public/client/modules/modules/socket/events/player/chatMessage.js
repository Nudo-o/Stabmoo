import { playersManager } from "../../../../constants.js"

function chatMessage(data) {
    const player = playersManager.players.get(data[0])

    if (!player) return

    player.receiveChat(data[1])
}

export default chatMessage