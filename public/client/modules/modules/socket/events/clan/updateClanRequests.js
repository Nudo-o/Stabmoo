import { clanMenu } from "../../../../constants.js"

function updateClanRequests(data) {
    clanMenu.updateRequests(data[0])
}

export default updateClanRequests