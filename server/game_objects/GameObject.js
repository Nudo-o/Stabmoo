import config from "../config.js"
import { objectsManager, socketsManager } from "../constants.js"
import Point from "../utils/2d/Point.js"
import randInt from "../utils/math/randInt.js"

class GameObject extends Point {
    constructor(id, x, y, dir, scale, type, data, ownerID) {
        scale += data.rndScales ? data.rndScales[randInt(0, data.rndScales.length - 1)] : 0

        super(0, 0, scale)

        this.setTo(x, y)

        this.id = id
        this.dir = dir
        this.type = type
        this.data = data
        this.ownerID = ownerID

        this.health = this.data.health
        this.maxHealth = this.health

        this.useCells = null

        this.isItem = this.data.isItem

        this.ignoreCollision = this.data.ignoreCollision

        this.isVisibleForAll = this.data.group?.visibleForAll ?? true

        this.active = true

        this.berries = this.data.maxBerries

        this.lastBerrieSpawn = Date.now()
        this.spawnBerrieDelay = this.data.spawnBerrieDelay
    }

    get canGiveFood() {
        return !this.isItem && this.type === 3 && this.berries > 0
    }

    getInitData() {
        return [
            this.id,
            this.x,
            this.y,
            this.dir,
            this.scale,
            this.type,
            this.ownerID,
            this.berries,
            this.health
        ]
    }

    getScale(isItem) {
        return this.scale * (this.data.colDiv || 1) * (isItem ? .6 : 1)
    }

    kill(doer) {
        this.active = false
        
        objectsManager.remove(this.id)

        doer.useResources(this.data.req || [], true)

        doer.itemsCount[this.data.group.id] -= 1
        doer.socket.send(config.packets.updateItemsCount, doer.itemsCount)
    }

    changeHealth(amount, doer) {
        this.health += parseFloat(amount)

        if (this.health > this.maxHealth) {
            amount -= this.health - this.maxHealth
            
            this.health = this.maxHealth
        }

        if (this.health <= 0) return this.kill(doer)

        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(this)) continue

            socket.send(config.packets.changeGameObjectHealth, this.id, this.health)
        }
    }
    
    changeBerries(amount) {
        if ((this.berries <= 0 && amount < 0) || (this.berries >= this.data.maxBerries && amount > 0)) return

        this.lastBerrieSpawn = Date.now()

        if (amount < 0) {
            this.spawnBerrieDelay = this.data.spawnBerrieDelay * 2
        }

        this.berries += parseInt(amount)
        
        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(this)) continue

            socket.send(config.packets.updateBushBerries, this.id, this.berries)
        }
    }

    update() {
        this.updatePhysics()

        if (!this.isItem && (this.type === 3 || this.type === 4)) {
            if (this.berries < this.data.maxBerries) {
                if (Date.now() - this.lastBerrieSpawn >= this.spawnBerrieDelay) {
                    this.changeBerries(1)

                    this.spawnBerrieDelay = this.data.spawnBerrieDelay
                }
            }
        }
    }
}

export default GameObject