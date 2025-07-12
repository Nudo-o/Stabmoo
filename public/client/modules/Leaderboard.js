import { playersManager, profileCard } from "../constants.js"
import $Element from "../utils/$Element.js"
import formatNumber from "../utils/formatNumber.js"

class Leaderboard {
    constructor() {
        this.$list = new $Element("#leader_board_list")

        this.chunkSize = 5
    }

    get contentTemplate() {
        return `
        <span class="table-title rank-title"></span>
        <span class="table-title nickname-title">
            <span></span>
        </span>
        <span class="table-title gold-title"></span>
        <span class="table-title kill-title"></span>
        `
    }

    addItem(id, rank, nickname, gold, kills) {
        const element = document.createElement("li")

        element.classList.add("table-titles", "no-border", "leader-board-item")

        if (id === playersManager.player.id) {
            element.classList.add("my-leader-board-item")
        }

        element.insertAdjacentHTML("beforeend", this.contentTemplate)

        const titles = element.querySelectorAll(".table-title")

        titles[0].insertAdjacentText("beforeend", `#${rank}`)
        titles[1].querySelector("span").insertAdjacentText("beforeend", nickname)
        titles[2].insertAdjacentText("beforeend", formatNumber(gold))
        titles[3].insertAdjacentText("beforeend", kills)

        this.$list.element.appendChild(element)
    }

    update(data) {
        this.$list.html = ""

        this.myData = data.slice(data.length - this.chunkSize, data.length)

        profileCard.updateRank(this.myData[1])

        data = data.slice(0, data.length - this.chunkSize)

        for (let i = 0; i < data.length; i += this.chunkSize) {
            this.addItem(...data.slice(i, i + this.chunkSize))
        }

        if (!data.includes(this.myData[0])) {
            this.addItem(...this.myData)
        }
    }
}

export default Leaderboard