import { objectsManager } from "../../../../constants.js"

function updateBushBerries(data) {
    const object = objectsManager.objects.get(data[0])

    if (!object) return

    object.updateBerries(data[1])
}

export default updateBushBerries