import { leaderboard } from "../../../../constants.js"

function updateLeaderboard(data) {
    leaderboard.update(data[0])
}

export default updateLeaderboard
