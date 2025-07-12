import config from "../config.js"
import { animalsManager, clansManager, gridArray, objectsManager, socketsManager } from "../constants.js"
import hats from "../game_configs/hats.js"
import items from "../game_configs/items.js"
import modules from "../game_configs/modules.js"
import weapons from "../game_configs/weapons.js"
import GameObject from "../game_objects/GameObject.js"
import Cell from "../grid/Cell.js"
import Point from "../utils/2d/Point.js"
import formatText from "../utils/formatText.js"
import getAngleDist from "../utils/math/getAngleDist.js"
import randInt from "../utils/math/randInt.js"

function getCfgArray(key) {
    return JSON.parse(JSON.stringify(config.player[key]))
}

class Player extends Point {
    constructor(socket) {
        super(0, 0, config.player.scale)

        this.socket = socket

        this.id = this.socket.id

        this.nickname = ""

        this.dir = 0

        this.weaponIndex = 0
        this.buildIndex = -1

        this.clan = null

        this.skinIndex = 0
        this.hatIndex = 0

        this.hats = {}
        this.modules = {}

        this.modulesEffects = []
        
        this.moveDir = null
        this._speed = config.player.speed

        this.isAlive = false
        this.isPlayer = true
        this.ignoreCollision = false

        this._health = config.player.maxHealth
        this.maxHealth = this.health

        this.isAttacking = false
        this.lastAttack = null
        this.autoAttack = false

        const startResources = getCfgArray("startResources")

        this.gold = startResources[0]
        this.food = startResources[1]
        this.wood = startResources[2]
        this.stone = startResources[3]

        this.weapons = getCfgArray("startWeapons")
        this.items = getCfgArray("startItems")

        this.itemsCount = {}

        this.level = 1
        this.xp = 0
        this.maxXP = config.player.maxXPs[this.level - 1]

        this.kills = 0

        this.created = false

        this.lastWindmillGold = Date.now()

        this.activeUpgrades = []

        this.isInTrap = false

        this.lastLossHealthDebuff = Date.now()

        this.effects = {}
        this.noEffectsTime = null
        this.effectsIDs = ""

        this.canSeeWidth = config.maxScreenWidth
        this.canSeeHeight = config.maxScreenHeight
    }

    get health() {
        return this._health < 0 ? 0 : this._health > this.maxHealth ? this.maxHealth : this._health
    }

    set health(value) {
        this._health = value
    }

    get weapon() {
        return weapons[this.weaponIndex]
    }

    get hat() {
        return hats[this.hatIndex] || {}
    }

    get damage() {
        return Math.round(this.weapon.damage * (this.hat.damageMult || 1))
    }

    get objectDamage() {
        return Math.round(this.weapon.damage * (this.hat.objectDamageMult || 1))
    }

    get gatherAmount() {
        return Math.round(this.weapon.gather * (this.hat.gatherMult || 1))
    }

    get speed() {
        return (
            this._speed * 
            (this.buildIndex >= 0 ? .5 : 1) * 
            (this.weapon.speedMult || 1) * 
            (this.hat.speedMult || 1)
        )
    }

    getInitData() {
        return [
            this.id,
            this.x,
            this.y,
            this.nickname,
            this.skinIndex,
            this.health
        ]
    }

    getUpdateData() {
        return [
            this.id,
            this.x,
            this.y,
            this.dir,
            this.weaponIndex,
            this.buildIndex,
            this.hatIndex,
            (this.clan?.name || null),
            (this.clan?.isLeader(this.id) || false),
            parseInt(this.effectsIDs) || 0
        ]
    }

    setDir(dir) {
        this.dir = dir
    }

    setMoveDir(moveDir) {
        this.moveDir = moveDir
    }

    spawn(nickname, skinIndex) {
        if (nickname.length > config.maxNicknameLength) {
            nickname = "Stabber"
        }

        this.isAlive = true
        this.created = true

        this.nickname = formatText(nickname, config.maxNicknameLength, "Stabber")
        this.skinIndex = Math.max(Math.min(skinIndex, config.maxSkinsLength), 0)

        const freeCells = gridArray.getFreeCells()

        if (freeCells.length) {
            const freeCell = freeCells[randInt(0, freeCells.length - 1)]

            this.setTo(freeCell.middleX, freeCell.middleY)
        } else {
            const x = randInt(0, config.map.width)
            const y = randInt(0, config.map.height)

            this.setTo(x, y)
        }

        this.socket.send(config.packets.addPlayer, ...[true, ...this.getInitData()])
        this.socket.send(config.packets.updateLevel, this.level, this.xp, this.maxXP)
        this.socket.send(config.packets.dayNightCycle, socketsManager.dayNightCycleState)
        
        this.sendItems(this.items)
        this.sendItems(this.weapons, true)

        this.setResources([ 
            "gold", this.gold,
            "food", this.food,
            "wood", this.wood,
            "stone", this.stone
        ])

        this.resetPhysics()
    }

    kill(doer) {
        this.isAlive = false

        this.weaponIndex = 0
        this.level = 1
        this.xp = 0
        this.maxXP = config.player.maxXPs[this.level - 1]
        this.health = this.maxHealth
        this.isAttacking = false
        this.lastAttack = null

        const startResources = getCfgArray("startResources")

        this.gold = startResources[0]
        this.food = startResources[1]
        this.wood = startResources[2]
        this.stone = startResources[3]

        this.weapons = getCfgArray("startWeapons")
        this.items = getCfgArray("startItems")

        this.weaponIndex = this.weapons[0]
        this.buildIndex = -1

        this.activeUpgrades = []

        doer && doer.didKill(this)

        this.autoAttack = false

        this.socket.canSeeSockets = {}

        this.socket.canSeeSockets[this.id] = true
        
        this.socket.canSeeObjects = {}

        this.effects = {}
        this.noEffectsTime = null
        this.effectsIDs = ""

        this.isInTrap = false

        this.resetPhysics()

        this.socket.send(config.packets.killPlayer)

        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(this) || socket.id === this.id) continue

            delete socket.canSeeSockets[this.id]

            socket.send(config.packets.removePlayer, this.id)
        }
    }

    sendItems(items, isWeapon) {
        const parsedItems = JSON.parse(JSON.stringify(items))

        this.socket.send(config.packets.updateItems, parsedItems.filter((item) => item !== null), isWeapon)
    }

    didKill(killed) {
        const gold = Math.round(killed.level * 100)

        this.addResource("gold", gold)
        this.earnXP("player", gold)

        this.kills += 1
    }

    initClan(clan) {        
        this.clan = clan
    }

    leaveClan() {
        this.clan = null

        this.socket.send(config.packets.leaveClan)
    }

    equipHat(isBuy, id, isModule) {
        const cap = isModule ? modules[id] : hats[id]

        if (!cap) return

        if (isModule) {
            if (this.modules[cap.id]) return
            
            if (this.gold < cap.price) return

            this.modules[cap.id] = true

            this.modulesEffects.push(cap.effect)

            return this.addResource("gold", -cap.price)
        }

        if (isBuy) {
            if (this.hats[cap.id]) return

            if (this.gold < cap.price) return

            this.hats[cap.id] = true

            return this.addResource("gold", -cap.price)
        } else {
            if (!cap.price) {
                this.hats[cap.id] = true
            }
        }

        if (this.hatIndex === cap.id) {
            this.hatIndex = 0

            return
        }

        if (!this.hats[cap.id]) return

        this.hatIndex = cap.id
    }

    upgradeItem(id, isWeapon) {
        if (!this.isAlive) return

        if (isWeapon) {
            const weapon = weapons[id]
            const activeWeapon = weapons[this.weaponIndex]

            this.weapons[weapon.cellIndex] = weapon.id

            if (activeWeapon.cellIndex === weapon.cellIndex && this.buildIndex < 0) {
                this.weaponIndex = this.weapons[weapon.cellIndex]
            }

            this.sendItems(this.weapons, true)
        } else {
            const item = items[id]

            this.items[item.group.id] = item.id

            if (this.buildIndex >= 0) {
                const activeItem = items[this.buildIndex]
    
                if (activeItem.group.id === item.group.id) {
                    this.buildIndex = this.items[item.group.id]
                }
            } 

            this.sendItems(this.items)
        }

        this.activeUpgrades.shift()

        if (this.activeUpgrades.length) {
            let levelUpgrades = this.activeUpgrades[0]

            levelUpgrades = levelUpgrades.map((item) => {
                if (typeof item[2] === 'number') {
                    const items = this[[ "items", "weapons" ][Number(item[1])]]
    
                    if (!items.includes(item[2])) return [ null ]
                }
    
                return item.slice(0, 2)
            }).filter((upgrade) => upgrade?.every((item) => item !== null)).flat(1)

            this.socket.send(config.packets.updateUpgradesItems, levelUpgrades)
        }
    }

    levelUP() {
        this.xp = 0
        this.level += 1
        this.maxXP = config.player.maxXPs[this.level - 1]

        let levelUpgrades = getCfgArray("levelsUpgrades")[this.level.toString()]

        if (!levelUpgrades?.length) return

        this.activeUpgrades.push(levelUpgrades)

        levelUpgrades = this.activeUpgrades[0]

        levelUpgrades = levelUpgrades.map((item) => {
            if (typeof item[2] === 'number') {
                const items = this[[ "items", "weapons" ][Number(item[1])]]

                if (!items.includes(item[2])) return [ null ]
            }

            return item.slice(0, 2)
        }).filter((upgrade) => upgrade?.every((item) => item !== null)).flat(1)

        this.socket.send(config.packets.updateUpgradesItems, levelUpgrades)
    }

    earnXP(type, amount) {
        if (!this.isAlive) return

        switch (type) {
            case "resource": {
                this.xp += amount * config.player.gatherEarnXPMult
            } break

            case "player": {
                this.xp += amount
            } break

            case "windmill": {
                this.xp += amount
            } break

            case "animal": {
                this.xp += amount
            } break
        }

        if (this.xp >= this.maxXP) {
            this.levelUP()
        }

        this.xp = Math.round(this.xp)
        this.maxXP = Math.round(this.maxXP)

        this.socket.send(config.packets.updateLevel, this.level, this.xp, this.maxXP)
    }

    addResource(type, amount) {
        if (!this.isAlive) return

        this[type] += parseFloat(amount)
        
        this.socket.send(config.packets.updateResource, type, this[type])
    }

    changeHealth(amount, doer, byPlayer) {    
        if (!this.isAlive || (amount > 0 && this.health >= this.maxHealth)) return

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

        const oldHealth = this.health

        this.health += parseFloat(amount)

        if (this.health > this.maxHealth) {
            amount -= this.health - this.maxHealth
            
            this.health = this.maxHealth
        }

        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(this)) continue

            socket.send(config.packets.changeHealth, this.id, this.health)

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

    hasModule(moduleName) {
        return this.modulesEffects.includes(moduleName) ?? false
    }

    hasResources(req) {
        if (!this.isAlive) return

        for (let i = 0; i < req.length; i += 2) {
            if (this[req[i]] < req[i + 1]) return false
        }

        return true
    }

    setResources(resources) {
        for (let i = 0; i < resources.length; i += 2) {
            this[resources[i]] = resources[i + 1]

            this.socket.send(config.packets.updateResource, resources[i], this[resources[i]])
        }
    }

    useResources(req, isAdd = false) {
        if (!this.isAlive) return

        for (let i = 0; i < req.length; i += 2) {
            if (req[i] === "food" && !isAdd) {
                if (this.health === this.maxHealth) continue
            }

            this.addResource(req[i], !isAdd ? -req[i + 1] : req[i + 1])
        }
    }

    placeItem() {
        if (!this.isAlive) return

        const item = items[this.buildIndex]

        if (!item || !this.hasResources(item.req)) {
            this.buildIndex = -1

            return
        }

        const limit = item.group?.limit * (this.hasModule("more_buildings") ? 2 : 1)

        if (typeof item.consume === 'function') {
            item.consume(this)
        } else if (item.group.place) {
            if (this.itemsCount[item.group.id] >= limit) {
                this.buildIndex = -1

                return
            }

            const offset = this.scale + item.scale + (item.placeOffset || 0)
            const placeX = this.x + offset * Math.cos(this.dir)
            const placeY = this.y + offset * Math.sin(this.dir)
            const isCanPlace = objectsManager.checkItemLocation(placeX, placeY, item.scale)

            if (isCanPlace) {
                const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))
                const cell = new Cell(id, placeX + item.scale / 2, placeY + item.scale / 2)
                const object = new GameObject(id, cell.x, cell.y, this.dir, item.scale, item.id, item, this.id)

                objectsManager.add(id, cell, item.needsCells, object)

                this.itemsCount[item.group.id] = this.itemsCount[item.group.id] || 0
                this.itemsCount[item.group.id] += 1

                this.socket.send(config.packets.updateItemsCount, this.itemsCount)
            } else {
                return
            }
        }

        this.useResources(item.req)

        this.buildIndex = -1
    }

    selectItem(id, isWeapon) {
        if (!this.isAlive) return

        if (!isWeapon) {
            if (!this.items.includes(id) || !items[id]) return

            const item = items[id]

            if (this.buildIndex === id) {
                this.buildIndex = -1

                return
            }

            const limit = item.group?.limit * (this.hasModule("more_buildings") ? 2 : 1)

            if (item.group.place && this.itemsCount[item.group.id] >= limit) return

            if (!this.hasResources(item.req)) return

            this.buildIndex = id
        } else {
            if (!this.weapons.includes(id) || !weapons[id]) return

            this.weapons[weapons[id].cellIndex] = id
            this.weaponIndex = id
            this.buildIndex = -1
        }
    }

    checkHitCollisions() {
        if (!this.isAlive) return

        let didHit = false
    
        const socketsIDs = Object.keys(this.socket.canSeeSockets)

        for (let i = 0; i < socketsIDs.length; i++) {
            const socketID = socketsIDs[i]
            const player = socketsManager.sockets.get(+socketID)?.player

            if (!player || player?.id === this.id) continue

            if (this.isClanMember(player.id)) continue

            const distance = this.distanceTo(player) - (player.scale + this.weapon.playerColAdd)
            const angle = this.angleTo(player)

            if (!player.isAlive || distance > (this.weapon.range * 2 + player.scale)) continue

            if (distance > this.weapon.range || getAngleDist(angle, this.dir) > config.gatherAngle) continue

            if (!player.isInTrap) {
                player.position.add((this.weapon.power / 2) * Math.cos(angle), (this.weapon.power / 2) * Math.sin(angle))
                player.acceleration.add((this.weapon.power / 3) * Math.cos(angle), (this.weapon.power / 3) * Math.sin(angle))
                player.force.add(this.weapon.power * Math.cos(angle), this.weapon.power * Math.sin(angle))
            }

            player.changeHealth(-this.damage, this, true)

            didHit = true
        }

        const animalsIDs = Object.keys(this.socket.canSeeAnimals)

        for (let i = 0; i < animalsIDs.length; i++) {
            const animalID = animalsIDs[i]
            const animal = animalsManager.animals.get(+animalID)

            if (!animal) continue

            const distance = this.distanceTo(animal) - (animal.scale + this.weapon.playerColAdd)

            if (distance > (300 + animal.scale)) continue

            const angle = this.angleTo(animal)

            if (distance > this.weapon.range || getAngleDist(angle, this.dir) > config.gatherAngle) continue

            if (!animal.isInTrap) {
                animal.position.add((this.weapon.power / 2) * Math.cos(angle), (this.weapon.power / 2) * Math.sin(angle))
                animal.acceleration.add((this.weapon.power / 3) * Math.cos(angle), (this.weapon.power / 3) * Math.sin(angle))
                animal.force.add(this.weapon.power * Math.cos(angle), this.weapon.power * Math.sin(angle))
            }

            //if (animal.data.type === "passive") {
            animal.startRun(this)
            //}

            animal.changeHealth(-this.damage, this, true)

            didHit = true
        }

        const objectsIDs = Object.keys(this.socket.canSeeObjects)

        for (let i = 0; i < objectsIDs.length; i++) {
            const objectID = objectsIDs[i]
            const object = objectsManager.objects.get(+objectID)

            if (!object) continue

            const distance = this.distanceTo(object) - (this.scale + (object.getScale ? object.getScale() : object.scale)) * (object.data.hitColMult || 1)

            if (distance > (300 + object.scale)) continue

            const angle = this.angleTo(object)

            if (distance > this.weapon.range || getAngleDist(angle, this.dir) > config.gatherAngle) continue

            if (!object.isItem) {
                if (/^(3|4)$/.test(object.type)) {
                    if (object.berries && this.items[0] === object.data.needFoodID) {
                        this.addResource(object.data.gatherName, object.data.berrieFoodAmount)

                        object.changeBerries(-1)
                    }
                } else {
                    this.addResource(object.data.gatherName, this.gatherAmount)
                }

                if (
                    !/^(3|4)$/.test(object.type) || 
                    (/^(3|4)$/.test(object.type) && 
                    object.berries && this.items[0] === object.data.needFoodID)
                ) {
                    this.earnXP("resource", this.weapon.gather)
                }
            } else {
                object.changeHealth(-this.objectDamage, this)
            }

            if (!object.active) continue

            const sockets = socketsManager.list

            for (let i = 0; i < sockets.length; i++) {
                const socket = sockets[i]

                if (!socket.player.canSee(this)) continue

                socket.send(config.packets.objectWiggle, object.id, angle)
            }

            didHit = true
        }

        return didHit
    }

    doHit(state) {
        if (!this.isAlive) return

        if (this.buildIndex >= 0 || state === 0) {
            if (state === 0) {
                this.isAttacking = false
            }

            return this.placeItem()
        }

        if (!this.lastAttack || Date.now() - this.lastAttack >= this.weapon.speed * this.weapon.hitDealy) {
            if (state === 1) {
                const didHit = this.checkHitCollisions()
                const sockets = socketsManager.list

                for (let i = 0; i < sockets.length; i++) {
                    const socket = sockets[i]

                    if (!socket.player.canSee(this)) continue
    
                    socket.send(config.packets.gatherAnimation, this.id, didHit)
                }
    
                this.isAttacking = true
                this.lastAttack = Date.now()
            }
        }
    }

    doAutoHit() {
        if (!this.isAlive) return

        this.autoAttack = !this.autoAttack

        if (!this.autoAttack) {
            this.autoAttack = false

            this.doHit(0)
        }
    }

    handleCollisions() {
        if (!this.isAlive) return

        const socketsIDs = Object.keys(this.socket.canSeeSockets)

        for (let i = 0; i < socketsIDs.length; i++) {
            const socketID = socketsIDs[i]
            const player = socketsManager.sockets.get(+socketID)?.player

            if (!player || player?.id === this.id) continue

            const distance = this.distanceTo(player)

            if (!player.isAlive || distance > (this.scale * 2.5 + config.collisionDepth)) continue

            const dx = this.x - player.x
            const dy = this.y - player.y
            const length = this.scale + player.scale

            if (Math.abs(dx) <= length || Math.abs(dy) <= length) {
                let magnitude = Math.sqrt(dx * dx + dy * dy) - length

                if (magnitude <= 0 && !player.ignoreCollision) {
                    const angleMeToPlayer = this.angleTo(player)
                    const anglePlayerToMe = player.angleTo(this)

                    magnitude = (magnitude * -1) / 2

                    this.position.add(
                        magnitude * Math.cos(anglePlayerToMe),
                        magnitude * Math.sin(anglePlayerToMe)
                    )
                    player.position.add(
                        magnitude * Math.cos(angleMeToPlayer), 
                        magnitude * Math.sin(angleMeToPlayer)
                    )
                }
            }
        }

        const objectsIDs = Object.keys(this.socket.canSeeObjects)

        this.isInTrap = false

        for (let i = 0; i < objectsIDs.length; i++) {
            const objectID = objectsIDs[i]
            const object = objectsManager.objects.get(+objectID)

            if (!object) continue

            const distance = this.distanceTo(object)

            if (distance > (object.scale * 2.5 + config.collisionDepth)) continue
            const dx = this.x - object.x
            const dy = this.y - object.y
            const length = this.scale + (object.getScale ? object.getScale(object.data.isItem) : object.scale)

            if (Math.abs(dx) <= length || Math.abs(dy) <= length) {
                let magnitude = Math.sqrt(dx * dx + dy * dy) - length

                if (object.data.isTrap) {
                    if (object.ownerID !== this.id && !this.isClanMember(object.ownerID)) {
                        if (magnitude <= object.data.collisionMagnitude) {
                            this.isInTrap = true
    
                            object.isVisibleForAll = true
                        }
                    }
                }

                if (magnitude <= object.data.collisionMagnitude && object.data.isBoost) {
                    this.acceleration.add(
                        object.data.boostSpeed * Math.cos(object.dir),
                        object.data.boostSpeed * Math.sin(object.dir)
                    )
                }

                if (magnitude <= 0 && !object.ignoreCollision) {
                    const angleObjectToMe = object.angleTo(this)

                    magnitude = (magnitude * -1) / 2

                    if (object.data.damage && object.data.colDamage && this.id !== object.ownerID) {
                        if (!this.isClanMember(object.ownerID)) {
                            this.velocity = this.velocity.normalize()

                            if (!this.isInTrap) {
                                this.position.add(
                                    object.data.power * Math.cos(angleObjectToMe),
                                    object.data.power * Math.sin(angleObjectToMe)
                                )
                            }

                            this.changeHealth(-object.data.damage, socketsManager.sockets.get(object.ownerID).player)
                        }
                    }

                    this.position.add(
                        magnitude * Math.cos(angleObjectToMe),
                        magnitude * Math.sin(angleObjectToMe)
                    )
                }
            }
        }

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

    handleDebuffs() {
        if (!this.hat.debuffs) return

        if (this.hat.debuffs.lossHealth) {
            const lossHealth = this.hat.debuffs.lossHealth

            if (!this.lastLossHealthDebuff || Date.now() - this.lastLossHealthDebuff >= lossHealth.delay) {
                this.changeHealth(-lossHealth.amount)

                this.lastLossHealthDebuff = Date.now()
            }
        }
    }

    isClanMember(otherID) {
        if (!this.clan) return false

        return this.clan.isMember(otherID)
    }

    canSee(other) {
        if (!other || (other.isPlayer && !other.created)) return false

        if (this.hasModule("zoom_out")) {
            const zoom = 1.2

            this.canSeeWidth = config.maxScreenWidth * zoom
            this.canSeeHeight = config.maxScreenHeight * zoom
        }

        const dx = Math.abs(other.x - this.x) - other.scale
        const dy = Math.abs(other.y - this.y) - other.scale

        return dx <= (this.canSeeWidth / 2) * 1.3 && dy <= (this.canSeeHeight / 2) * 1.3
    }

    update() {
        if (!this.isAlive) return

        if (this.noEffectsTime && Date.now() - this.noEffectsTime >= config.noEffectsTime) {
            this.noEffectsTime = null
        }

        if (this.moveDir !== null) {
            this.velocity.add(
                this.speed * Math.cos(this.moveDir), 
                this.speed * Math.sin(this.moveDir)
            )
        }

        if (this.isAttacking || this.autoAttack) {
            if (this.buildIndex < 0) {
                this.doHit(1)
            }
        }

        if (this.itemsCount[3] > 0) {
            if (Date.now() - this.lastWindmillGold >= config.windmillGoldDelay) {
                const ownWindmills = objectsManager.list.filter((object) => object.isItem && object.ownerID === this.id && object.data.group.id === 3)
                const amount = ownWindmills.reduce((acc, mill) => {
                    return acc + mill.data.goldPerSecond
                }, 0)
    
                this.addResource("gold", Math.round(amount))
                this.earnXP("windmill", Math.round(amount))
    
                this.lastWindmillGold = Date.now()
            }
        }

        this.handleCollisions()
        this.handleDebuffs()
        this.handleEffects()

        if (!this.isInTrap) {
            this.updatePhysics()
        } else {
            this.resetPhysics()
        }
    }
}

export default Player