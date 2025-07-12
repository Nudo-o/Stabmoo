import config from "../config.js"
import { gridArray, socketsManager } from "../constants.js"
import animals from "../game_configs/animals.js"
import randInt from "../utils/math/randInt.js"
import Animal from "./Animal.js"

const maxLimit = animals.reduce((acc, animal) => acc + animal.spawnLimit, 0)

class AnimalsManager {
    constructor() {
        this.animals = new Map()

        this.lastAnimalSpawn = null
        this.animalSpawnDelay = 10000
    }

    get list() {
        return [...this.animals.values()]
    }

    add(id, animal) {
        this.animals.set(id, animal)

        this.animalSpawnDelay = 10000
    }

    remove(id) {
        if (!this.animals.has(id)) return

        const animal = this.animals.get(id)

        this.animals.delete(id)

        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(animal)) continue

            delete socket.canSeeAnimals[animal.id]

            socket.send(config.packets.removeAnimal, animal.id)
        }

        this.animalSpawnDelay /= 2.25
    }

    spawnRandomAnimal() {
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))
        const animalData = animals[randInt(0, animals.length - 1)]

        if (this.animals.size >= maxLimit) return

        const sameAnimals = this.list.filter((animal) => animal.data.id === animalData.id)

        if (sameAnimals.length >= animalData.spawnLimit) return

        const animal = new Animal(id, 0, 0, animalData.id)
        const freeCells = gridArray.getFreeCells()

        if (freeCells.length) {
            const freeCell = freeCells[randInt(0, freeCells.length - 1)]

            animal.setTo(freeCell.middleX, freeCell.middleY)
        } else {
            const x = randInt(0, config.map.width)
            const y = randInt(0, config.map.height)

            animal.setTo(x, y)
        }

        this.add(id, animal)
    }

    update() {
        if (!this.lastAnimalSpawn || Date.now() - this.lastAnimalSpawn >= this.animalSpawnDelay) {
            this.spawnRandomAnimal()
            this.spawnRandomAnimal()

            this.lastAnimalSpawn = Date.now()
        }

        this.animals.forEach((animal) => {
            animal.update()
        })
    }
}

export default AnimalsManager