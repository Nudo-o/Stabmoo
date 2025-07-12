import { objectsManager } from "../../../../constants.js"

function changeGameObjectHealth(data) {
    const object = objectsManager.objects.get(data[0])

    if (!object) return

    object.changeHealth(data[1])
}

export default changeGameObjectHealth