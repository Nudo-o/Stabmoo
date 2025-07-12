import config from "../config.js"
import { animalsManager, objectsManager, socketsManager } from "../constants.js"
import animals from "../game_configs/animals.js"
import Point from "../utils/2d/Point.js"
import randInt from "../utils/math/randInt.js"

class Animal extends Point {
    constructor(id, x, y, animalID) {
        const data = animals[animalID]

        super(0, 0, data.scale)

        this.setTo(x, y)

        this.id = id
        this.animalID = animalID
        this.data = data

        this.dir = 0
        this.moveAngle = this.dir

        this.active = true
        
        this.randomMove = {
            endPosition: null,
            time: null
        }
        this.isRandomMove = false

        this.runTime = null
        this.isRun = false
        this.runDoer = null
        this.startRunAngle = null
        this.stopRunTime = null

        this.isInTrap = false
        this.isBite = false
        this.isMove = false
        
        this.xVel = 0
        this.yVel = 0

        this._speed = this.data.speed

        this.health = this.data.health
        this.maxHealth = this.health

        this._moodState = 0

        this.effects = {}
        this.noEffectsTime = null
        this.effectsIDs = ""
    }
    
    get moodState() {
        if (this.data.type === "passive") return this._moodState

        const isNightMood = socketsManager.dayNightCycleState === 0 && this._moodState === 0
        
        return isNightMood ? 1 : this._moodState
    }

    set moodState(_state) {
        this._moodState = _state
    }

    get damage() {
        const isNight = socketsManager.dayNightCycleState === 0

        return this.data.damage * (
            isNight ? config.animals.nightDamageMult : 1
        )
    }

    get aggresiveZoneRange() {
        const isNight = socketsManager.dayNightCycleState === 0

        return this.data.aggresiveZoneRange * (
            isNight ? config.animals.nightAggresiveZoneRangeMult : 1
        )
    }

    get speed() {
        const isNight = socketsManager.dayNightCycleState === 0

        return this._speed * (
            this.isRun ? this.data.runSpeedMult : 1
        ) * (
            isNight ? config.animals.nightSpeedMult : 1
        )
    }

    get canSeeSockets() {
        return socketsManager.list.filter((socket) => socket.player.isAlive && this.canSee(socket.player))
    }

    changeHealth(amount, doer, byPlayer) {
        const oldHealth = this.health

        if (doer?.isPlayer && byPlayer) {
            if (doer.hat.effects) {
                const effects = Object.keys(doer.hat.effects)

                for (let i = 0; i < effects.length; i++) {
                    const effect = effects[i]

                    if (this.noEffectsTime && doer.hat.effects[effect].noEffectsAfter) continue

                    if (doer.hat.effects[effect].noEffectsAfter && this.effects[effect]) continue

                    this.effects[effect] = JSON.parse(JSON.stringify(Object.assign(doer.hat.effects[effect], {
                        doerID: doer.id,
                        createdAt: Date.now()
                    })))
                }
            }
        }

        this.health += parseFloat(amount)

        if (this.health > this.maxHealth) {
            amount -= this.health - this.maxHealth
            
            this.health = this.maxHealth
        }

        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(this)) continue

            const isLossHealth = amount < 0

            amount = this.health - oldHealth

            socket.send(
                config.packets.addText, 
                "animated", `${isLossHealth ? "" : "+"}${amount}`,
                this.x, this.y, isLossHealth ? 2 : 1
            )
        }

        if (this.health <= 0) return this.kill(doer)
    }

    getInitData() {
        return [
            this.id,
            this.x,
            this.y,
            this.dir,
            this.animalID,
            this.health,
            this.moodState
        ]
    }

    getUpdateData() {
        return [
            this.id,
            this.x,
            this.y,
            this.dir,
            this.health,
            this.moodState,
            parseInt(this.effectsIDs) || 0
        ]
    }

    kill(doer) {
        this.active = false
        
        animalsManager.remove(this.id)

        doer.useResources(this.data.req || [], true)
        doer.earnXP("animal", this.data.xpForKill)
    }

    startRandomMove(endX, endY) {
        if (this.isRandomMove || this.isRun) return

        this.randomMove.endPosition = new Point(endX, endY, 0)

        this.isRandomMove = true

        this.moodState = 0
    }

    endRandomMove() {
        if (!this.isRandomMove) return

        this.randomMove.endPosition = null

        this.isRandomMove = false
    }

    startRun(doer) {
        this.isRun = true
        this.runTime = Date.now()
        this.runDoer = doer
        this.startRunAngle = this.runDoer.angleTo(this)
        this.stopRunTime = null

        this.endRandomMove()
    }

    stopRun() {
        this.isRun = false

        this.runDoer = null
        this.runTime = null
        this.startRunAngle = null
        this.stopRunTime = Date.now()

        this.endRandomMove()

        this.randomMove.time = Date.now()
    }

    doBite() {
        this.runDoer.changeHealth(-this.damage)

        if (!this.runDoer.isInTrap) {
            const angle = this.angleTo(this.runDoer)

            this.runDoer.position.add((this.data.power / 2) * Math.cos(angle), (this.data.power / 2) * Math.sin(angle))
            this.runDoer.acceleration.add((this.data.power / 3) * Math.cos(angle), (this.data.power / 3) * Math.sin(angle))
            this.runDoer.force.add(this.data.power * Math.cos(angle), this.data.power * Math.sin(angle))
        }

        this.isBite = true

        this.stopRun()

        setTimeout(() => {
            this.isBite = false
        }, 350)
    }

    updateMovement() {
        if (this.data.type === "aggresive" && !this.isRun) {
            if (!this.stopRunTime || Date.now() - this.stopRunTime >= (this.data.runTime / 2)) {
                const nearSocket = this.canSeeSockets.sort((a, b) => {
                    a = this.distanceTo(a.player)
                    b = this.distanceTo(b.player)
    
                    return a - b
                })[0]
    
                if (nearSocket) {
                    const nearPlayer = nearSocket.player
                    const distance = this.distanceTo(nearPlayer) - this.scale
    
                    if (distance <= this.aggresiveZoneRange) {
                        this.startRun(nearPlayer)
                    }
                }
            }
        }

        if (!this.isRun) {
            if (!this.randomMove.time || Date.now() - this.randomMove.time >= this.data.randomMoveTime) {
                const minX = this.x - this.data.randomMoveWidth
                const minY = this.y - this.data.randomMoveHeight
                const maxX = this.x + this.data.randomMoveWidth
                const maxY = this.y + this.data.randomMoveHeight
                const endX = randInt(minX, maxX)
                const endY = randInt(minY, maxY)

                this.endRandomMove()
                this.startRandomMove(endX, endY)

                this.randomMove.time = Date.now()
            }
        }

        if (this.isRun) {
            if (this.data.type === "passive") {
                this.moveAngle = this.runDoer.angleTo(this)
                
                switch (this.data.id) {
                    case 0: {
                        this.moodState = 1
                    } break
                }
            } else {
                this.moveAngle = this.angleTo(this.runDoer)
                
                const distance = this.distanceTo(this.runDoer) - this.scale

                switch (this.data.id) {
                    case 1: {
                        if (distance <= this.data.damageZoneRange) {
                            this.doBite()

                            this.moodState = 2
                        } else {
                            this.moodState = 1
                        }
                    } break
                }
            }
            
            if (Date.now() - this.runTime >= this.data.runTime) {
                this.stopRun()
            }
        } else if (this.isRandomMove) {
            const distance = this.distanceTo(this.randomMove.endPosition)
            
            if (distance <= this.scale * 1.35) {
                this.endRandomMove()
            } else {
                this.moveAngle = this.angleTo(this.randomMove.endPosition)
            }
        }

        if (!this.isRandomMove && !this.isRun && !this.isMove) {
            if (!this.isBite){
                this.moodState = 0
            }

            this.xVel = 0
            this.yVel = 0

            return
        }

        this.xVel = this.speed * Math.cos(this.moveAngle)
        this.yVel = this.speed * Math.sin(this.moveAngle)
    }

    handleCollisions() {
        if (!this.active) return

        const entities = new Map([
            ...Array.from(socketsManager.sockets.entries()), 
            // ...Array.from(animalsManager.animals.entries())
        ])

        entities.forEach((entity) => {
            entity = entity.player ? entity.player : entity

            if (!entity || entity?.id === this?.id || !this.canSee(entity)) return

            if (entity.isPlayer && !entity.isAlive) return

            const distance = this.distanceTo(entity)

            if (distance > (this.scale * 2.5 + config.collisionDepth)) return

            const dx = this.x - entity.x
            const dy = this.y - entity.y
            const length = this.scale + entity.scale

            if (Math.abs(dx) <= length || Math.abs(dy) <= length) {
                let magnitude = Math.sqrt(dx * dx + dy * dy) - length

                if (magnitude <= 0 && !entity.ignoreCollision) {
                    const angleMeToEntity = this.angleTo(entity)
                    const angleEntityToMe = entity.angleTo(this)

                    magnitude = (magnitude * -1) / 2

                    this.position.add(
                        magnitude * Math.cos(angleEntityToMe),
                        magnitude * Math.sin(angleEntityToMe)
                    )
                    entity.position.add(
                        magnitude * Math.cos(angleMeToEntity), 
                        magnitude * Math.sin(angleMeToEntity)
                    )
                }
            }
        })

        this.isInTrap = false

        objectsManager.objects.forEach((object) => {
            if (!object || !object?.active || !this.canSee(object)) return

            const distance = this.distanceTo(object) - this.scale

            if (distance > (object.scale * 2.5 + config.collisionDepth)) return

            const dx = this.x - object.x
            const dy = this.y - object.y
            const length = this.scale + (object.getScale ? object.getScale(object.data.isItem) : object.scale)

            if (Math.abs(dx) <= length || Math.abs(dy) <= length) {
                let magnitude = Math.sqrt(dx * dx + dy * dy) - length

                if (object.data.isTrap) {
                    if (magnitude <= object.data.collisionMagnitude) {
                        this.isInTrap = true

                        object.isVisibleForAll = true
                    }
                }

                if (object.data.isBoost) {
                    if (magnitude <= object.data.collisionMagnitude) {
                        this.acceleration.add(
                            object.data.boostSpeed * Math.cos(object.dir),
                            object.data.boostSpeed * Math.sin(object.dir)
                        )
                    }
                }

                if (magnitude <= 0 && !object.ignoreCollision) {
                    const angleObjectToMe = object.angleTo(this)

                    magnitude = (magnitude * -1) / 2

                    if (object.data.damage && object.data.colDamage) {
                        this.velocity = this.velocity.normalize()

                        if (!this.isInTrap) {
                            this.position.add(
                                object.data.power * Math.cos(angleObjectToMe),
                                object.data.power * Math.sin(angleObjectToMe)
                            )
                        }

                        if (this.data.type === "passive") {
                            this.startRun(object)
                        }

                        this.changeHealth(-object.data.damage, socketsManager.sockets.get(+object.ownerID).player)
                    }

                    this.position.add(
                        magnitude * Math.cos(angleObjectToMe),
                        magnitude * Math.sin(angleObjectToMe)
                    )
                }
            }
        })

        const leftCol = this.x <= this.scale
        const rightCol = this.x >= config.map.width - this.scale
        const topCol = this.y <= this.scale
        const bottomCol = this.y >= config.map.height - this.scale

        if (leftCol || rightCol) {
            const dx = leftCol ? Math.abs(this.scale - this.x) : rightCol ? -Math.abs(config.map.width - this.scale - this.x) : 0

            this.position.add(dx)
        }

        if (topCol || bottomCol) {
            const dy = topCol ? Math.abs(this.scale - this.y) : bottomCol ? -Math.abs(config.map.height - this.scale - this.y) : 0
        
            this.position.add(0, dy)
        }
    }

    handleEffects() {
        this.effectsIDs = ""

        for (const effect in this.effects) {
            this.effectsIDs = this.effectsIDs.concat(this.effects[effect].effectID.toString())
        }

        const addNoEffectTime = () => {
            this.noEffectsTime = Date.now()
        }

        if (this.effects.permanentDamage) {
            const permanentDamage = this.effects.permanentDamage

            if (Date.now() - permanentDamage.createdAt >= permanentDamage.stopDelay) {
                if (permanentDamage.noEffectsAfter) addNoEffectTime()

                delete this.effects.permanentDamage
            } else {
                if (typeof permanentDamage.time === 'undefined') {
                    permanentDamage.time = Date.now()
                }

                if (!permanentDamage.time || Date.now() - permanentDamage.time >= permanentDamage.delay) {
                    this.changeHealth(-permanentDamage.amount, socketsManager.sockets.get(permanentDamage.doerID).player)

                    permanentDamage.time = Date.now()
                }
            }
        }

        if (this.effects.freezeMovement) {
            const freezeMovement = this.effects.freezeMovement

            if (Date.now() - freezeMovement.createdAt >= freezeMovement.stopDelay) {
                if (freezeMovement.noEffectsAfter) addNoEffectTime()
                
                delete this.effects.freezeMovement
            } else {
                this.resetPhysics()
            }
        }
    }

    canSee(other) {
        if (!other || (other.isPlayer && !other.created)) return false

        const dx = Math.abs(other.x - this.x) - other.scale
        const dy = Math.abs(other.y - this.y) - other.scale

        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3
    }
    
    update() {
        if (!this.active) return

        if (this.noEffectsTime && Date.now() - this.noEffectsTime >= config.noEffectsTime) {
            this.noEffectsTime = null
        }

        this.velocity.add(this.xVel, this.yVel)

        this.handleCollisions()
        this.handleEffects()

        if (!this.isInTrap) {
            this.updateMovement()

            this.updatePhysics()

            if (!this.effects.freezeMovement) {
                this.dir = this.moveAngle
            }
        } else {
            this.moodState = 0

            this.resetPhysics()
        }
    }
}

export default Animal