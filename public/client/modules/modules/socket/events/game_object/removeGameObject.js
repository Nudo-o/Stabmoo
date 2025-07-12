import { objectsManager } from "../../../../constants.js"

function removeGameObject(data) {
    objectsManager.remove(data[0])
}

export default removeGameObject
