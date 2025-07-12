import config from "../config.js"
import { $clanMenuHolder, $toggleClanMenu, notifications, playersManager, socket } from "../constants.js"
import $Element from "../utils/$Element.js"
import formatText from "../utils/formatText.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const createClanEvent = 58.25
const removeClanEvent = 61.25
const kickClanMemberEvent = 58.75
const clanRequestEvent = 59
const clanRequestResolveEvent = 59.25
const clanRequestRejectEvent = 59.5

class ClanMenu {
    constructor() {
        this.$clansMenu = new $Element("#clan_menu_clans")
        this.$membersMenu = new $Element("#clan_menu_members")
        this.$requestsMenu = new $Element("#clan_menu_requests")

        this.$clanNameInput = new $Element("#clan_name_input")
        this.$clanCreateBtn = new $Element("#clan_create_btn")

        this.$clanDissolveBtn = new $Element("#clan_dissolve_btn")

        this.$navClansText = new $Element("#clan_nav_clans")
        this.$navClanMembers = new $Element("#clan_nav_members")
        this.$navClanRequests = new $Element("#clan_nav_requests")

        this.$clansMenuItems = new $Element("#clan_menu_clans > .clan-join-items")
        this.$membersMenuItems = new $Element("#clan_menu_members > .clan-members-items")
        this.$requestsMenuItems = new $Element("#clan_menu_requests > .clan-requests-items")

        this.isClanLeader = false

        this.requests = new Map()

        this.init()
    }

    getMemberLayout(id, nickname, post) {
        return `
        <li class="clan-member-item ui-element" memberid="${id}">
            <div class="clan-member-info">
                <span class="clan-info-text clan-member-nickname${
                    id === playersManager.player.id ? " my-clan-info-text" : ""
                }"><img class="clan-member-leader-icon${
                    post !== 2 ? " hidden" : ""
                }" src="../../assets/icons/clan_leader_icon.png">${nickname}</span>
            </div>

            <!--<div class="clan-btn clan-gift-btn game-button ui-element">Gift</div>-->

            <div class="clan-btn clan-kick-btn game-button ui-element${
                !this.isClanLeader || (this.isClanLeader && playersManager.player.id === id) ? " hidden" : ""
            }">Kick</div>
        </li>
        `
    }

    getRequestLayout(id, nickname) {
        return `
        <li class="clan-request-item ui-element" memberid="${id}">
            <div class="clan-request-info">
                <span class="clan-info-text clan-member-nickname">${nickname}</span>
            </div>

            <div class="clan-request-actions">
                <div class="clan-btn clan-resolve-btn game-button ui-element">
                    <i class="material-icons" style="font-size:28px; color: #7bc059;">&#xE876;</i>
                </div>

                <div class="clan-btn clan-reject-btn game-button ui-element">
                    <i class='material-icons' style="font-size:28px; color: #c05959;">&#xE14C;</i>
                </div>
            </div>
        </li>
        `
    }

    getClanLayout(id, name, leaderName, membersCount) {
        return `
        <li class="clan-join-item ui-element" clanid="${id}">
            <div class="clan-join-info">
                <span class="clan-info-text clan-join-name">${name}</span>
                <span class="clan-info-text clan-join-leader">Leader: ${leaderName}</span>
                <span class="clan-info-text clan-join-members">Members: ${membersCount}</span>
            </div>

            <div class="clan-btn clan-join-btn game-button ui-element">Join</div>
        </li>
        `
    }

    onJoinedClan(isClanLeader) {
        this.isClanLeader = isClanLeader

        this.$clansMenu.hide()
        this.$navClansText.hide()
        this.$requestsMenu.hide()
        
        this.$membersMenu.show()
        this.$navClanMembers.show()

        this.$navClanMembers.classes.remove("clan-btn", "game-button", "ui-element", "active-game-btn")
        this.$navClanMembers.classes.remove("clan-nav-text")

        if (isClanLeader) {
            this.$navClanMembers.classes.add("clan-btn", "game-button", "ui-element", "active-game-btn")
            this.$navClanRequests.show()
        } else {
            this.$navClanMembers.classes.add("clan-nav-text")
        }
        
        this.$clanDissolveBtn.text = isClanLeader ? "Dissolve" : "Leave"

        $toggleClanMenu.query("img").src = "./assets/icons/in_clan_icon.png"
    }

    onLeaveClan() {
        this.isClanLeader = false

        this.$requestsMenu.hide()
        this.$membersMenu.hide()
        this.$navClanMembers.hide()
        this.$navClanRequests.hide()

        this.$clansMenu.show()
        this.$navClansText.show()

        $toggleClanMenu.query("img").src = "./assets/icons/no_clan_icon.png"
    }

    updateClans(data) {
        if (!data.length) {
            this.$clansMenuItems.classes.add("no-items")
        } else {
            this.$clansMenuItems.classes.remove("no-items")
        }

        this.$clansMenuItems.html = ""

        const chunkSize = 4
        
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize)
            const layout = this.getClanLayout(...chunk)

            this.$clansMenuItems.insert(layout)

            const clanItem = document.querySelector(`.clan-join-item[clanid="${chunk[0]}"]`)

            this.initClanEvents(clanItem)
        }
    }

    updateMembers(data) {
        this.$membersMenuItems.html = ""

        const chunkSize = 3

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize)
            const layout = this.getMemberLayout(...chunk)

            this.$membersMenuItems.insert(layout)

            if (this.isClanLeader) {
                const memberItem = document.querySelector(`.clan-member-item[memberid="${chunk[0]}"]`)

                this.initMemberEvents(memberItem)
            }
        }
    }

    updateRequests(data) {
        if (!data.length) {
            this.requests.clear()

            this.$requestsMenuItems.classes.add("no-items")
        } else {
            this.$requestsMenuItems.classes.remove("no-items")
        }

        this.$requestsMenuItems.html = ""

        const chunkSize = 2

        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize)
            const layout = this.getRequestLayout(...chunk)

            this.$requestsMenuItems.insert(layout)

            if (!this.requests.has(chunk[0])) {
                notifications.add(`${chunk[1]} wants to join the clan`, null, "clan_request_icon")
            }

            this.requests.set(chunk[0], true)

            if (this.isClanLeader) {
                const requestItem = document.querySelector(`.clan-request-item[memberid="${chunk[0]}"]`)

                this.initRequestEvents(requestItem)

                if (this.requests.size > 0) {
                    $toggleClanMenu.setAttr("data-notifications-count", this.requests.size.toString())
                } else {
                    $toggleClanMenu.removeAttr("data-notifications-count", "")
                }
            } else {
                $toggleClanMenu.removeAttr("data-notifications-count", "")
            }
        }
    }

    initClanEvents(clanItem) {
        clanItem.addEventListener("click", (event) => {
            if (!event?.isTrusted) return

            event.stopPropagation()
            
            if (!event.target.classList.contains("clan-join-btn")) return

            const clanID = parseInt(clanItem.getAttribute("clanid"))

            if (!clanID) return

            socket.send(clanRequestEvent * fourInt, clanID)
        })
    }

    initMemberEvents(memberItem) {
        memberItem.addEventListener("click", (event) => {
            if (!event?.isTrusted) return

            event.stopPropagation()

            const memberID = parseInt(memberItem.getAttribute("memberid"))

            if (!memberID) return

            if (event.target.classList.contains("clan-kick-btn")) {
                socket.send(kickClanMemberEvent * fourInt, memberID)
            }
        })
    }

    initRequestEvents(requestItem) {
        requestItem.addEventListener("click", (event) => {
            if (!event?.isTrusted) return

            event.stopPropagation()

            const memberID = parseInt(requestItem.getAttribute("memberid"))

            if (!memberID) return

            let target = event.target

            if (!target.classList.contains("clan-btn")) {
                target = target.parentElement
            }

            if (target.classList.contains("clan-resolve-btn")) {
                socket.send(clanRequestResolveEvent * fourInt, memberID)

                this.requests.delete(+memberID)
            } else if (target.classList.contains("clan-reject-btn")) {
                socket.send(clanRequestRejectEvent * fourInt, memberID)

                this.requests.delete(+memberID)
            }

            if (!this.isClanLeader) return

            if (this.requests.size > 0) {
                $toggleClanMenu.setAttr("data-notifications-count", this.requests.size.toString())
            } else {
                $toggleClanMenu.removeAttr("data-notifications-count")
            }
        })
    }

    init() {
        this.$clanCreateBtn.on("click", (event) => {
            if (!event?.isTrusted) return

            const value = formatText(this.$clanNameInput.value, config.maxClanNameLength, "")

            if (!value || playersManager.player.clan) return

            socket.send(createClanEvent * fourInt, value)

            this.$clanNameInput.value = ""
        })

        this.$clanDissolveBtn.on("click", (event) => {
            if (!event?.isTrusted) return

            if (!playersManager.player.clan) return

            socket.send(removeClanEvent * fourInt)
        })

        this.$navClanMembers.on("click", (event) => {
            if (!event?.isTrusted) return

            if (!playersManager.player.isClanLeader) return
            
            this.$navClanRequests.classes.remove("active-game-btn")
            this.$navClanMembers.classes.add("active-game-btn")

            this.$requestsMenu.hide()
            this.$membersMenu.show()
        })

        this.$navClanRequests.on("click", (event) => {
            if (!event?.isTrusted) return
            
            if (!playersManager.player.isClanLeader) return

            this.$navClanMembers.classes.remove("active-game-btn")
            this.$navClanRequests.classes.add("active-game-btn")

            this.$membersMenu.hide()
            this.$requestsMenu.show()
        })
    }
}

export default ClanMenu