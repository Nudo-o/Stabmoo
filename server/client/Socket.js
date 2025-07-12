import config from "../config.js"
import { animalsManager, clansManager, objectsManager, socketsManager } from "../constants.js"
import randInt from "../utils/math/randInt.js"
import msgpack from "msgpack-lite"
import Player from "./Player.js"
import formatText from "../utils/formatText.js"

function parseType(type) {
    return type.toString()
}

class Socket {
    constructor(id, ws, request) {
        this.id = id
        this.ws = ws
        this.request = request
        this.ip = this.request.headers["x-forwarded-for"] || this.request.socket.remoteAddress

        this.uid = this.id * (Math.random() * 1000)
        
        this.user = null

        this.encodeInt = config.encodeInts[randInt(0, config.encodeInts.length - 1)]

        this.canSeeSockets = {}
        this.canSeeObjects = {}
        this.canSeeAnimals = {}
        this.listenSendObjects = {}

        this.canSeeSockets[this.id] = true

        this.isAdmin = false

        this.init()
    }

    send(type) {
        type = parseType(type)

        const data = Array.prototype.slice.call(arguments, 1)
        const binary = msgpack.encode([type, data])

        this.ws.send(binary)
    }

    setUser(user) {
        if (this.user) return

        this.user = user
        this.isAdmin = Boolean(this.user.isAdmin)
    }

    onMessage(message) {
        try {
            for (let i = 0; i < 5; i++) {
                message[i] -= this.encodeInt * 9131
            }

            const binary = new Uint8Array(message)
            const parsed = msgpack.decode(binary)

            if (!Object.values(config.events).includes(+parsed[0])) return

            if (+parsed[0] === config.events.spawn) {
                this.player.spawn(...parsed[1])
            }

            if (+parsed[0] === config.events.changeDir) {
                this.player.setDir(...parsed[1])
            }

            if (+parsed[0] === config.events.changeMoveDir) {
                this.player.setMoveDir(...parsed[1])
            }

            if (+parsed[0] === config.events.doHit) {
                this.player.doHit(...parsed[1])
            }

            if (+parsed[0] === config.events.autoAttack) {
                this.player.doAutoHit(...parsed[1])
            }

            if (+parsed[0] === config.events.selectItem) {
                this.player.selectItem(...parsed[1])
            }

            if (+parsed[0] === config.events.upgradeItem) {
                this.player.upgradeItem(...parsed[1])
            }

            if (+parsed[0] === config.events.createClan && !this.player?.clan) {
                clansManager.create(parsed[1][0], this)
            }

            if (+parsed[0] === config.events.removeClan && this.player?.clan) {
                if (this.player.clan.leader.id === this.id) {
                    clansManager.remove(this.player.clan.id)
                } else {
                    this.player.clan.kick(this.id)
                }
            }
            
            if (+parsed[0] === config.events.clanRequest && !this.player?.clan) {
                const clan = clansManager.clans.get(parsed[1][0])

                if (clan) {
                    clan.addRequest(this)
                }
            }

            if (+parsed[0] === config.events.clanRequestResolve && this.player?.clan) {
                const clan = clansManager.clans.get(this.player.clan.id)

                if (clan && this.player.clan.leader.id === this.id) {
                    if (clan.requests.has(parsed[1][0])) {
                        clan.requests.get(parsed[1][0]).resolve()
                    }
                }
            }

            if (+parsed[0] === config.events.clanRequestReject && this.player?.clan) {
                const clan = clansManager.clans.get(this.player.clan.id)

                if (clan && this.player.clan.leader.id === this.id) {
                    if (clan.requests.has(parsed[1][0])) {
                        clan.requests.get(parsed[1][0]).reject()
                    }
                }
            }

            if (+parsed[0] === config.events.kickClanMember && this.player?.clan) {
                if (this.player.clan.leader.id === this.id && parsed[1][0] !== this.id) {
                    this.player.clan.kick(parsed[1][0])
                }
            }

            if (+parsed[0] === config.events.equipHat) {
                this.player.equipHat(...parsed[1])
            }

            if (+parsed[0] === config.events.pingEvent) {
                this.send(config.packets.pingResponse)
            }

            if (+parsed[0] === config.events.chatMessage) {
                let maxLength = config.maxChatLength

                const sockets = socketsManager.list
                const value = formatText(parsed[1][0], maxLength, "")

                if (!value) return

                for (let i = 0; i < sockets.length; i++) {
                    const socket = sockets[i]

                    if (!socket.player.canSee(this.player)) continue

                    socket.send(config.packets.chatMessage, this.id, value)
                }
            }
        } catch (err) {
            console.log(err)

            // this.close("Unknown error")
        }
    }

    updateCanSeeSockets() {
        if (!socketsManager.sockets.size) return

        socketsManager.sockets.forEach((socket) => {
            if (!socket.player.isAlive || !this.player.canSee(socket?.player)) return

            if (this.canSeeSockets[socket.id]) return

            if (!this.canSeeSockets[socket.id]) {
                this.send(config.packets.addPlayer, ...socket.player.getInitData())
            }

            this.canSeeSockets[socket.id] = true
        })

        const socketsIDs = new Map([
            ...Object.entries(this.canSeeSockets)
        ])
        const updateDataArray = []
        
        socketsIDs.forEach((_, socketID) => {
            socketID = +socketID
            
            const socket = socketsManager.sockets.get(socketID)

            if (!socket && this.canSeeSockets[socketID]) {
                delete this.canSeeSockets[socketID]

                return this.send(config.packets.removePlayer, socketID)
            }

            if (this.player.canSee(socket.player)) {
                return updateDataArray.push(...socket.player.getUpdateData())
            }

            this.send(config.packets.removePlayer, socket.id)

            delete this.canSeeSockets[socket.id]
        })

        this.send(config.packets.updatePlayers, ...updateDataArray)
    }

    updateCanSeeObjects() {
        if (!objectsManager.objects.size) return

        objectsManager.objects.forEach((object) => {
            if (!object.active || !this.player.canSee(object)) return

            if (this.canSeeObjects[object.id]) return

            const isCanSend = (
                object.isVisibleForAll || 
                this.player.isClanMember(object.ownerID) || 
                this.player.id === object.ownerID
            )

            if (!this.canSeeObjects[object.id]) {
                if (!isCanSend) {
                    this.listenSendObjects[object.id] = object
                } else {
                    this.send(config.packets.addGameObject, ...object.getInitData())
                }
            }

            this.canSeeObjects[object.id] = true
        })

        const listenSendObjects = Object.values(this.listenSendObjects)

        for (let i = 0; i < listenSendObjects.length; i++) {
            const listenSendObject = listenSendObjects[i]
            const isCanSend = (
                listenSendObject.isVisibleForAll || 
                this.player.isClanMember(listenSendObject.ownerID) || 
                this.player.id === listenSendObject.ownerID
            )

            if (!isCanSend) continue

            this.send(config.packets.addGameObject, ...listenSendObject.getInitData())

            delete this.listenSendObjects[listenSendObject.id]
        }

        const objectsIDs = new Map([
            ...Object.entries(this.canSeeObjects)
        ])

        objectsIDs.forEach((_, objectID) => {
            objectID = +objectID

            const object = objectsManager.objects.get(objectID)

            if (!object && this.canSeeObjects[objectID]) {
                delete this.canSeeObjects[objectID]

                return this.send(config.packets.removePlayer, objectID)
            }

            if (this.player.canSee(object)) return

            this.send(config.packets.removeGameObject, object.id)

            delete this.canSeeObjects[object.id]
        })
    }

    updateCanSeeAnimals() {
        if (!animalsManager.animals.size) return

        animalsManager.animals.forEach((animal) => {
            if (!animal.active || !this.player.canSee(animal)) return

            if (this.canSeeAnimals[animal.id]) return

            if (!this.canSeeAnimals[animal.id]) {
                this.send(config.packets.addAnimal, ...animal.getInitData())
            }

            this.canSeeAnimals[animal.id] = true
        })

        const animalsIDs = new Map([
            ...Object.entries(this.canSeeAnimals)
        ])
        const updateDataArray = []

        animalsIDs.forEach((_, animalID) => {
            animalID = +animalID

            const animal = animalsManager.animals.get(animalID)

            if (!animal && this.canSeeAnimals[animalID]) {
                delete this.canSeeAnimals[animalID]

                return this.send(config.packets.removeAnimal, animalID)
            }

            if (this.player.canSee(animal)) {
                return updateDataArray.push(...animal.getUpdateData())
            }

            this.send(config.packets.removeAnimal, animal.id)

            delete this.canSeeAnimals[animal.id]
        })

        if (!Object.keys(this.canSeeAnimals).length) return

        this.send(config.packets.updateAnimals, ...updateDataArray)
    }

    update() {
        this.player.update()
        
        if (!this.player.created) return

        this.updateCanSeeSockets()
        this.updateCanSeeObjects()
        this.updateCanSeeAnimals()
    }

    async ban() {
        this.close(config.banText)
    }

    close(reason = "") {
        const sockets = socketsManager.list.filter((socket) => socket.canSeeSockets[this.id])

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            delete socket.canSeeSockets[this.id]

            socket.send(config.packets.removePlayer, this.id)
        }

        socketsManager.remove(this.id, reason)
    }

    init() {
        this.player = new Player(this)

        this.ws.on("message", this.onMessage.bind(this))

        const fillArray = Array(862).fill(0).map((i) => randInt(1000000, 2934567) / 9131)

        fillArray[268] = this.encodeInt
        
        this.send(config.packets.setupGame, this.uid, ...fillArray)
        this.send(config.packets.updateClans, [...clansManager.updateClansData.flat(2)])
    }
}

export default Socket