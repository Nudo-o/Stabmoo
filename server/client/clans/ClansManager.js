import config from "../../config.js"
import { socketsManager } from "../../constants.js"
import formatText from "../../utils/formatText.js"
import Clan from "./Clan.js"

class ClansManager {
    constructor() {
        this.clans = new Map()

        this.names = {}
    }

    get list() {
        return [...this.clans.values()]
    }

    get updateClansData() {
        return this.list.map((clan) => [ clan.id, clan.name, clan.leader.player.nickname, clan.members.size ])
    }

    getByName(name) {
        return this.list.filter((clan) => clan.name === name)[0]
    }

    sendClans() {
        const sockets = socketsManager.list
        const clans = this.updateClansData

        sockets.forEach((socket) => {
            socket.send(config.packets.updateClans, [...clans.flat(2)])
        })
    }

    create(name, leader) {
        if (this.names[name]) return

        name = formatText(name, config.maxClanNameLength, false)

        if (!name) return

        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))

        this.clans.set(id, new Clan(id, name, leader))

        this.names[name] = true

        this.sendClans()
    }

    remove(id) {
        const clan = this.clans.get(id)

        if (!clan) return

        clan.onRemove()

        delete this.names[clan.name]

        this.clans.delete(id)

        this.sendClans()
    }
}

export default ClansManager