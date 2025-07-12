import { minimap } from "../../../../constants.js"

function updateMinimap(data) {
    minimap.update(data[0])
}

export default updateMinimap