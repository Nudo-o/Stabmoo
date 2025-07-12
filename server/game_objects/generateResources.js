import config from "../config.js"
import { gridArray, objectsManager } from "../constants.js"
import randInt from "../utils/math/randInt.js"
import GameObject from "./GameObject.js"

function generate(name) {
    for (let i = 0; i < config.resources.generate[name]; i++) {
        const freeCells = gridArray.getFreeCells()

        if (!freeCells.length) return

        const cell = freeCells[randInt(0, freeCells.length - 1)]
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))
        const settings = config.resources[name]
        const dir = Math.random() * Math.PI * 2
        const scale = (settings.width + settings.height) / 2
        const object = new GameObject(id, cell.middleX, cell.middleY, dir, scale, settings.type, settings, null)

        objectsManager.add(id, cell, settings.needsCells, object)
    }
}

function generateResources() {
    generate("tree")
    generate("stone")
    generate("gold")
    generate("berrybush")
    generate("blueberrybush")
}

export default generateResources