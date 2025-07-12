import { objectsManager } from "../../../../constants.js"

function objectWiggle(data) {
    const object = objectsManager.objects.get(data[0])

    if (!object) return

    object.doGatherWiggle(data[1])
}

export default objectWiggle