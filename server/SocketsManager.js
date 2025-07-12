import config from "./config.js"
import Socket from "./client/Socket.js"
import sortByProperty from "./utils/math/sortByProperty.js"
import { animalsManager, clansManager, objectsManager } from "./constants.js"
import formatNumber from "./utils/formatNumber.js"

class SocketsManager {
    constructor() {
        this.sockets = new Map()

        this.lastSentLeaderboardData = Date.now()
        this.lastSentMinimapData = Date.now()

        this.dayNightCycleState = 1
        this.dayNightCycleTime = Date.now()
        this.dayNightCycleNoticeTime = Date.now()

        setInterval(this.onTick.bind(this), config.updateTickRate)
    }

    get list() {
        return [...this.sockets.values()]
    }

    sendLeaderboardData() {
        const sockets = this.list.filter((socket) => socket.player.isAlive)

        if (!sockets.length) return
        
        const players = sockets.map((socket) => socket.player)
        const bestGoldPlayers = sortByProperty(players, "gold", false)
        const data = bestGoldPlayers
        .map((player, index) => [player.id, index + 1, player.nickname, player.gold, player.kills])
        
        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]
            const player = socket.player

            let index = data.flat(3).indexOf(socket.id)

            if (index !== -1) {
                index = data.flat(3)[index + 1]
            }

            const gold = formatNumber(player.gold)

            socket.send(config.packets.updateLeaderboard, [
                ...data.slice(0, config.maxLeaderboardItems), 
                player.id, index, 
                player.nickname, gold, player.kills
            ].flat(2))
        }
    }

    sendMinimapData() {
        this.sockets.forEach((socket) => {
            if (!socket.player.isAlive) return

            const points = []

            this.sockets.forEach((otherSocket) => {
                if (socket.id === otherSocket.id) return

                if (socket.player.isClanMember(otherSocket.id)) {
                    const isLeader = otherSocket.player.clan.leader.id === otherSocket.id

                    points.push([otherSocket.player.x, otherSocket.player.y, isLeader ? 1 : 0])
                }
            })

            socket.send(config.packets.updateMinimap, [...points].flat(2))
        })
    }

    add(ws, request) {
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))

        this.sockets.set(id, new Socket(id, ws, request))

        ws.on("close", () => {
            if (!this.sockets.has(id)) return

            this.remove(id, false)
        })
    }

    remove(id, reason = "") {
        const socket = this.sockets.get(id)

        if (!socket) return

        const socketObjects = objectsManager.list.filter((object) => object.ownerID === socket.id)

        for (let i = 0; i < socketObjects.length; i++) {
            objectsManager.remove(socketObjects[i].id)
        }

        reason !== false && socket.send(config.packets.disconnect, reason)

        socket.ws.close && socket.ws.close()

        if (socket?.player.clan) {
            if (socket.player.clan.leader.id === socket.id) {
                clansManager.remove(socket.player.clan.id)
            } else {
                socket.player.clan.removeMember(socket.id)
            }
        }

        this.sockets.delete(id)
    }

    onTick() {
        objectsManager.update()
        animalsManager.update()

        this.sockets.forEach((socket) => {
            socket.update()
        })

        if (Date.now() - this.lastSentLeaderboardData >= config.sendLeaderboardDataDelay) {
            this.sendLeaderboardData()

            this.lastSentLeaderboardData = Date.now()
        }

        if (Date.now() - this.lastSentMinimapData >= config.sendMinimapDataDelay) {
            this.sendMinimapData()

            this.lastSentMinimapData = Date.now()
        }

        const dayNightCycleDelay = config.dayNightCycleDelay / (this.dayNightCycleState === 0 ? 2 : 1)

        if (this.dayNightCycleNoticeTime && Date.now() - this.dayNightCycleNoticeTime >= (dayNightCycleDelay - 10000)) {
            this.sockets.forEach((socket) => {
                if (!socket.player?.created) return
    
                socket.send(config.packets.dayNightCycleNotice, Number(!this.dayNightCycleState))
            })

            this.dayNightCycleNoticeTime = null
        }

        if (!this.dayNightCycleTime || Date.now() - this.dayNightCycleTime >= dayNightCycleDelay) {
            if (this.dayNightCycleState === 1) {
                this.dayNightCycleState = 0
            } else {
                this.dayNightCycleState = 1
            }

            this.sockets.forEach((socket) => {
                if (!socket.player?.created) return
    
                socket.send(config.packets.dayNightCycle, this.dayNightCycleState)
            })

            this.dayNightCycleNoticeTime = Date.now()
            this.dayNightCycleTime = Date.now()
        }
    }
}

export default SocketsManager