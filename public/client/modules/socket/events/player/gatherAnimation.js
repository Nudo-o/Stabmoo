import { playersManager } from "../../../../constants.js"


function gatherAnimation(data) {
    if (!playersManager.players.has(data[0])) return

    playersManager.players.get(data[0]).startGatherAnimation(data[1])   
}

export default gatherAnimation
