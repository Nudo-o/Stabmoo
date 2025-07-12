import config from "../../config.js"
import { clansManager, socketsManager } from "../../constants.js"

class Clan {
    constructor(id, name, leader) {
        this.id = id
        this.name = name
        this.leader = leader

        this.members = new Map()
        this.requests = new Map()

        this.addMember(leader)

        leader.send(config.packets.updateClanRequests, [])
    }

    get updateMembersData() {
        return this.getMembers().map((member) => [ member.id, member.nickname, member.post ])
    }

    get updateRequestsData() {
        return this.getRequests().map((request) => [ request.id, request.nickname ])
    }

    getMembers() {
        return [...this.members.values()]
    }

    getRequests() {
        return [...this.requests.values()]
    }

    isLeader(id) {
        return this.leader.id === id
    }

    isMember(id) {
       return this.members.has(id) 
    }

    sendMembers() {
        const members = this.updateMembersData

        this.members.forEach((member) => {
            const socket = socketsManager.sockets.get(member.id)

            socket.send(config.packets.updateClanMembers, [...members.flat(2)])
        })
    }

    sendRequests() {
        this.leader.send(config.packets.updateClanRequests, [...this.updateRequestsData.flat(2)])
    }

    addRequest(socket) {
        if (this.requests.has(socket.id) || this.members.has(socket.id)) return

        this.requests.set(socket.id, {
            id: socket.id,
            nickname: socket.player.nickname,
            resolve: () => {
                this.addMember(socket)
                this.removeRequest(socket.id)
                this.sendRequests()
            },
            reject: () => {
                this.removeRequest(socket.id)
                this.sendRequests()
            }
        })

        this.sendRequests()
    }

    removeRequest(id) {
        this.requests.delete(id)
    }

    addMember(socket) {
        if (this.members.has(socket.id) || !socketsManager.sockets.has(socket.id)) return

        if (socket.player.clan) return

        this.members.set(socket.id, {
            id: socket.id,
            post: socket.id === this.leader.id ? 2 : 0,
            nickname: socket.player.nickname,
        })

        socket.player.initClan(this)
        socket.send(config.packets.joinedClan, this.leader.id === socket.id)

        this.sendMembers()
        clansManager.sendClans()
    }

    removeMember(id) {
        if (!this.members.has(id)) return

        this.members.delete(id)

        this.sendMembers()
        clansManager.sendClans()
    }

    kick(id) {
        if (!this.members.has(id)) return

        const socket = socketsManager.sockets.get(id)

        if (!socket) return

        socket.player.leaveClan()

        socket.send(config.packets.updateClanMembers, [])

        if (socket.id === this.leader.id) {
            socket.send(config.packets.updateClanRequests, [])
        }

        this.removeMember(id)
    }

    onRemove() {
        this.members.forEach((member) => {
            this.kick(member.id)
        })
    }
}

export default Clan