import { clanMenu } from "../../../../constants.js"

function joinedClan(data) {
    clanMenu.onJoinedClan(data[0])
}

export default joinedClan