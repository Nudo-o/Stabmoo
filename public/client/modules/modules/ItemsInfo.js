import { playersManager, storeMenu } from "../constants.js"
import $Element from "../utils/$Element.js"
import getItemSprite from "./game_objects/getItemSprite.js"
import getHatImage from "./players/getHatImage.js"
import getWeaponImage from "./players/getWeaponImage.js"

class ItemsInfo {
    constructor() {
        this.$itemInfoHolder = new $Element("#item_info_holder")
        this.$itemInfoImage = new $Element("#item_info_image")
        this.$itemInfoName = new $Element("#item_info_name")
        this.$itemInfoCount = new $Element("#item_info_count")
        this.$itemInfoDescription = new $Element("#item_info_description")
        this.$itemInfoReq = new $Element("#item_info_req")
    }

    getItemReqLayout(name, amount) {
        name = name === "wood" ? "tree" : name

        return `
        <div class="item-info-req-item">
            <img class="item-info-req-image" src="./assets/icons/${name}_icon.png">
            <span class="item-info-req-text">${amount}</span>
        </div>
        `
    }

    setItemIcon(item) {
        this.$itemInfoCount.hide()
        this.$itemInfoReq.hide()

        if (item.group) {
            const icon = getItemSprite(item, /windmill/.test(item.name), /berry/.test(item.name) ? 3 : null)

            if (item.group.limit) {
                const limit = item.group.limit * (storeMenu.hasModule("more_buildings") ? 2 : 1)

                this.$itemInfoCount.show()

                this.$itemInfoCount.text = `${playersManager.player.itemsCount[item.group.id] || 0}/${limit}`
            }

            if (item.req?.length > 1) {
                this.$itemInfoReq.show()
                this.$itemInfoReq.html = ""

                for (let i = 0; i < item.req.length; i += 2) {
                    const reqItem = this.getItemReqLayout(item.req[i], item.req[i + 1])

                    this.$itemInfoReq.insert(reqItem)
                }
            }

            this.$itemInfoImage.setStyles("transform", "none")
            this.$itemInfoImage.classes.add("is-item")

            this.$itemInfoImage.element.src = icon.toDataURL()

            return
        }

        const icon = getWeaponImage(item)

        this.$itemInfoImage.setStyles("transform", `rotate(225deg) translateY(${item.cssTranslate}px) scale(${item.cssScale / 1.75})`)
        this.$itemInfoImage.classes.remove("is-item")

        this.$itemInfoImage.element.src = icon.image.src
    }

    setCapIcon(cap) {
        this.$itemInfoReq.hide()
        this.$itemInfoImage.setStyles("transform", `rotate(0deg)`)
        this.$itemInfoImage.classes.add("is-item")

        this.$itemInfoCount.text = cap.type

        this.$itemInfoImage.element.src = cap.iconSrc
    }

    setName(name) {
        this.$itemInfoName.html = name
    }

    setDescription(description) {
        this.$itemInfoDescription.text = description
    }

    show(item) {
        if (!item) return

        if (!item.isHat && !item.isModule) {
            this.setItemIcon(item)
        } else {
            this.setCapIcon(item)
        }

        this.setName(item.name)
        this.setDescription(item.desc)

        this.$itemInfoHolder.show()
    }

    hide() {
        this.$itemInfoHolder.hide()
    }
}

export default ItemsInfo