import config from "../config.js"
import { canvas, itemsInfo, playersManager, socket } from "../constants.js"
import hats from "../game_configs/hats.js"
import modules from "../game_configs/modules.js"
import $Element from "../utils/$Element.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const equipHatEvent = 32.75

class StoreMenu {
    constructor() {
        this.$navStoreHats = new $Element("#store_nav_hats")
        this.$navStoreModules = new $Element("#store_nav_modules")

        this.$hatsMenu = new $Element("#store_menu_hats")
        this.$modulesMenu = new $Element("#store_menu_modules")
        
        this.activeModules = []
        
        this.init()
    }

    hasModule(moduleName) {
        return this.activeModules.includes(moduleName) ?? false
    }

    getHatItemLayout(id, iconSrc, name, price, state) {
        return `
        <li class="store-hat-item ui-element${state === "Buy" ? " is-buy" : ""}" itemid="${id}">
            <div class="store-item-info">
                <img class="store-item-image" src="${iconSrc}"></img>
                <span class="store-info-text store-hat-name">${name}</span>
            </div>

            <div class="store-item-actions">
                <div class="store-btn store-action-btn game-button ui-element${state !== "Buy" ? " is-purchased" : ""}">
                    <span class="store-btn-text" price="${price}" state="${state}"></span>
                </div>
            </div>
        </li>
        `
    }

    getModuleItemLayout(id, iconSrc, name, price, state) {
        return `
        <li class="store-module-item ui-element${state === "Buy" ? " is-buy" : ""}" itemid="${id}">
            <div class="store-item-info">
                <img class="store-item-image" src="${iconSrc}"></img>
                <span class="store-info-text store-module-name">${name}</span>
            </div>

            <div class="store-item-actions">
                <div class="store-btn store-action-btn game-button ui-element${state !== "Buy" ? " is-purchased" : ""}">
                    <span class="store-btn-text" price="${price}" state="${state}"></span>
                </div>
            </div>
        </li>
        `
    }

    addHatsItems() {
        const sortedHats = Object.values(hats).sort((a, b) => a.price - b.price)

        for (const hat of sortedHats) {
            const layout = this.getHatItemLayout(hat.id, hat.iconSrc, hat.name, hat.price, hat.price ? "Buy" : "Equip")

            this.$hatsMenu.insert(layout)

            const hatItem = document.querySelector(`.store-hat-item[itemid="${hat.id}"]`)

            this.initItemEvents(hatItem, hats)
        }
    }

    addModulesItems() {
        const sortedModules = Object.values(modules).sort((a, b) => a.price - b.price)

        for (const module of sortedModules) {
            const layout = this.getModuleItemLayout(module.id, module.iconSrc, module.name, module.price, module.price ? "Buy" : "Equip")

            this.$modulesMenu.insert(layout)

            const moduleItem = document.querySelector(`.store-module-item[itemid="${module.id}"]`)

            this.initItemEvents(moduleItem, modules)
        }
    }

    unequipAllHats() {
        const hatItems = [...document.querySelectorAll(".store-hat-item")]

        for (const hatItem of hatItems) {
            const itemBtn = hatItem.querySelector(".store-action-btn")
            const btnText = itemBtn.querySelector(".store-btn-text")
            const state = btnText.getAttribute("state")

            if (state === "Buy") continue

            btnText.setAttribute("state", "Equip")
        }
    }

    initItemEvents(storeItem, itemsConfig) {
        storeItem.addEventListener("click", (event) => {
            if (!event?.isTrusted) return

            event.stopPropagation()

            const itemID = parseInt(storeItem.getAttribute("itemid"))

            if (!itemID) return
            
            const item = itemsConfig[itemID]

            if (
                !event.target.classList.contains("store-action-btn") &&
                !event.target.classList.contains("store-btn-text")
            ) return

            const itemBtn = storeItem.querySelector(".store-action-btn")
            const btnText = itemBtn.querySelector(".store-btn-text")
            const state = btnText.getAttribute("state")
            
            if (storeItem.classList.contains("is-buy")) {
                if (playersManager.player.gold < item.price) {
                    if (!itemBtn.classList.contains("red-anim")) {
                        itemBtn.classList.add("red-anim")

                        setTimeout(() => {
                            itemBtn.classList.remove("red-anim")
                        }, 500)
                    }
                    
                    return 
                }

                storeItem.classList.remove("is-buy")
                itemBtn.classList.add("is-purchased")

                btnText.setAttribute("state", item.isModule ? "Active": "Equip")

                if (item.isModule) {
                    this.activeModules.push(item.effect)

                    if (this.hasModule("zoom_out")) {
                        canvas.viewport.zoom = config.viewport.zoom + .2

                        canvas.resize()
                    } else {
                        canvas.viewport.zoom = config.viewport.zoom
                    }
                }

                return socket.send(equipHatEvent * fourInt, 1, itemID, Number(item.isModule))
            }

            if (item.isModule) return

            if (item.isHat) {
                this.unequipAllHats()
            }

            socket.send(equipHatEvent * fourInt, 0, itemID, Number(item.isModule))

            btnText.setAttribute("state", state === "Equip" ? "Unequip" : "Equip")
        })

        storeItem.addEventListener("mouseover", (event) => {
            if (!event?.isTrusted) return

            event.stopPropagation()

            const itemID = parseInt(storeItem.getAttribute("itemid"))

            if (!itemID) return
            
            const item = itemsConfig[itemID]

            if (
                !event.target.classList.contains("store-action-btn") &&
                !event.target.classList.contains("store-btn-text")
            ) return

            itemsInfo.show(item)
        })

        storeItem.addEventListener("mouseout", (event) => {
            itemsInfo.hide()
        })
    }

    init() {
        this.$navStoreHats.on("click", (event) => {   
            if (!event?.isTrusted) return

            this.$navStoreModules.classes.remove("active-game-btn")
            this.$navStoreHats.classes.add("active-game-btn")

            this.$modulesMenu.hide()
            this.$hatsMenu.show()
        })

        this.$navStoreModules.on("click", (event) => {
            if (!event?.isTrusted) return

            this.$navStoreHats.classes.remove("active-game-btn")
            this.$navStoreModules.classes.add("active-game-btn")

            this.$hatsMenu.hide()
            this.$modulesMenu.show()
        })

        this.addHatsItems()
        this.addModulesItems()
    }
}

export default StoreMenu