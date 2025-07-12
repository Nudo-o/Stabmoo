import { animalsManager } from "../../../../constants.js"

function removeAnimal(data) {
    animalsManager.remove(data[0])
}

export default removeAnimal