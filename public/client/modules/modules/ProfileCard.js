import config from "../config.js"
import { playersManager } from "../constants.js"
import items from "../game_configs/items.js"
import $Element from "../utils/$Element.js"
import formatNumber from "../utils/formatNumber.js"
import formatText from "../utils/formatText.js"
import renderCircle from "../utils/render/renderCircle.js"
import getItemSprite from "./game_objects/getItemSprite.js"
import getHatImage from "./players/getHatImage.js"
import getWeaponImage from "./players/getWeaponImage.js"

class ProfileCard {
    constructor() {
        this.$food = new $Element("#food_display")
        this.$gold = new $Element("#gold_display")
        this.$wood = new $Element("#wood_display")
        this.$stone = new $Element("#stone_display")
        this.$nickname = new $Element("#profile_nickname")
        this.$rank = new $Element("#profile_rank")
        this.$healtbar = new $Element("#profile_health_bar")
        this.$levelbar = new $Element("#profile_level_bar")

        this.profileCanvas = document.getElementById("profile_canvas")
        this.profileContext = this.profileCanvas.getContext("2d")
    }

    get player() {
        return playersManager.player
    }
    
    updateNickname() {
        this.$nickname.text = formatText(this.player.nickname)
    }

    updateRank(rank) {
        this.$rank.text = `#${rank}`
    }

    updateResources() {
        this.$gold.text = formatNumber(this.player.gold)
        this.$food.text = formatNumber(this.player.food)
        this.$wood.text = formatNumber(this.player.wood)
        this.$stone.text = formatNumber(this.player.stone)
    }

    updateHealthBar() {
        this.$healtbar.setAttr("health", this.player.health)

        const width = (this.player.health / this.player.maxHealth) * 100

        this.$healtbar.setStyles("width", `${width}%`)
    }

    updateLevelBar() {
        this.$levelbar.setAttr("level", this.player.level)
        this.$levelbar.setAttr("xp", this.player.xp)
        this.$levelbar.setAttr("maxXP", this.player.maxXP)

        const width = (this.player.xp / this.player.maxXP) * 100

        this.$levelbar.setStyles("width", `${width}%`)
    }

    updateProfileCanvas() {
        if (!this.player?.isAlive) return

        const canvasMiddle = this.profileCanvas.width / 2
        const handAngle = Math.PI / 4
        const handXOffsets = this.player.buildIndex < 0 ? this.player.weapon.handXOffsets || [ 0, 0 ] : [ 0, 0 ]
        const handYOffsets = this.player.buildIndex < 0 ? this.player.weapon.handYOffsets || [ 0, 0 ] : [ 0, 0 ]
        const dir = !this.player.lockDir ? this.player.mouseDir : this.player.dir
        const player = config.player

        this.profileContext.clearRect(0, 0, this.profileCanvas.width, this.profileCanvas.height)

        if (this.player.buildIndex < 0 && !this.player.weapon.aboveHand && this.player.weapon) {
            const weaponImage = getWeaponImage(this.player.weapon)
            
            if (weaponImage.isLoaded) {
                this.profileContext.save()
                this.profileContext.translate(canvasMiddle, canvasMiddle)
                this.profileContext.rotate(dir + this.player.dirPlus - (this.player.weapon.plusRotate || 0))
                this.profileContext.scale(.35, .35)
    
                this.profileContext.drawImage(
                    weaponImage.image, 
                    this.player.scale / 2 - this.player.weapon.xOffset - (this.player.weapon.length / 2), 
                    this.player.scale / 2 - this.player.weapon.yOffset - (this.player.weapon.width / 2),
                    this.player.weapon.length, this.player.weapon.width
                )
                this.profileContext.restore()
            }
        }

        this.profileContext.save()
        this.profileContext.translate(canvasMiddle, canvasMiddle)
        this.profileContext.rotate(dir + this.player.dirPlus)
        this.profileContext.scale(.35, .35)

        this.profileContext.strokeStyle = player.outlineColor
        this.profileContext.fillStyle = player.colors[this.player.skinIndex]
        this.profileContext.lineWidth = player.outlineWidth
        this.profileContext.lineJoin = "miter"

        renderCircle(
            this.player.scale * Math.cos(handAngle) + handXOffsets[0], 
            (this.player.scale * Math.sin(handAngle)) + handYOffsets[0], 
            player.handScale, this.profileContext
        )
        this.profileContext.fill()
        this.profileContext.stroke()

        renderCircle(
            this.player.scale * Math.cos(-handAngle) + handXOffsets[1], 
            this.player.scale * Math.sin(-handAngle) + handYOffsets[1], 
            player.handScale, this.profileContext
        )
        this.profileContext.fill()
        this.profileContext.stroke()

        if (this.player.buildIndex >= 0) {
            const item = items[this.player.buildIndex]
            const itemSprite = getItemSprite(item, /windmill/.test(item.name))

            if (item) {
                this.profileContext.drawImage(itemSprite, this.player.scale - item.holdOffset, -itemSprite.width / 2)
            }
        }

        renderCircle(0, 0, this.player.scale, this.profileContext)
        this.profileContext.fill()
        this.profileContext.stroke()

        if (this.player.hatIndex > 0 && this.player.hatImage) {
            let hat = this.player.hatImage

            if (hat.isLoaded) {
                this.profileContext.rotate(Math.PI / 2)
                this.profileContext.rotate(this.player.skinRotate)
                this.profileContext.drawImage(hat.image, -this.player.hat.scale / 2, -this.player.hat.scale / 2, this.player.hat.scale, this.player.hat.scale)
            }
        }

        this.profileContext.restore()
    }
}

export default ProfileCard