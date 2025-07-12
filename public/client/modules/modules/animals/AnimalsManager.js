import config from "../../config.js"
import { renderer } from "../../constants.js"
import lerpAngle from "../../utils/math/lerpAngle.js"
import Animal from "./Animal.js"

class AnimalsManager {
    constructor() {
        this.id = config.layers.animalsManager[1]
        this.layer = config.layers.animalsManager[0]

        this.animals = new Map()

        this.lastUpdate = null
    }

    get list() {
        return [...this.animals.values()]
    }

    add(data) {
        this.animals.set(data[0], new Animal(data))

        return this.animals.get(data[0])
    }

    remove(id) {
        this.animals.delete(id)
    }

    updateData(data) {
        // data - [ id, x, y, dir, health, moodState, effectsIDs ] {length: 7}
        const chunkLength = 7

        for (let i = 0; i < data.length; i += chunkLength) {
            const animal = this.animals.get(+data[i])
            const chunk = data.slice(i, i + chunkLength)

            animal.setData(chunk)
        }
    }

    update() {
        this.animals.forEach((animal) => {
            if (!animal.active) return

            const lastTime = renderer.nowUpdate - 1000 / config.serverUpdateRate
            const total = animal.t2 - animal.t1
            const fraction = lastTime - animal.t1
            const ratio = total / fraction
            const rate = 170

            animal.dt += renderer.delta

            const tmpRate = Math.min(1.7, animal.dt / rate)

            let tmpDiff = animal.x2 - animal.x1

            animal.x = animal.x1 + (tmpDiff * tmpRate)
            tmpDiff = (animal.y2 - animal.y1)
            animal.y = animal.y1 + (tmpDiff * tmpRate)

            animal.dir = lerpAngle(animal.dir2, animal.dir1, Math.min(1.2, ratio))

            animal.update()
        })
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default AnimalsManager