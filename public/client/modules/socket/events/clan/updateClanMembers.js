import { clanMembers, clanMenu } from "../../../../constants.js"

function updateClanMembers(data) {
    clanMembers.members = []

    const chunkSize = 3

    for (let i = 0; i < data[0].length; i += chunkSize) {
        clanMembers.members.push(data[0][i])
    }

    clanMenu.updateMembers(data[0])
}

export default updateClanMembers