import config from "../../config.js"
import { $actionBar, $upgradesBar, camera, clanMembers, context, playersManager, renderer, socket } from "../../constants.js"
import hats from "../../game_configs/hats.js"
import items from "../../game_configs/items.js"
import weapons from "../../game_configs/weapons.js"
import $Element from "../../utils/$Element.js"
import Point from "../../utils/2d/Point.js"
import lerp from "../../utils/math/lerp.js"
import renderCircle from "../../utils/render/renderCircle.js"
import BreathAnimation from "../animations/BreathAnimation.js"
import EffectsManager from "../effects/EffectsManager.js"
import getItemSprite from "../game_objects/getItemSprite.js"
import getHatImage from "./getHatImage.js"
import getIconImage from "./getIconImage.js"
import getWeaponImage from "./getWeaponImage.js"

class Player extends Point {
    constructor(data) {
        super(0, 0, config.player.scale)

        this.setTo(data[1], data[2])

        this.id = data[0]

        this.nickname = data[3]

        this.skinIndex = data[4] || 0

        this.t1 = null
        this.t2 = null

        this.x1 = this.x
        this.y1 = this.y
        this.x2 = this.x1
        this.y2 = this.y1

        this.dir = 0
        this.dir1 = null
        this.dir2 = null
        this.dirPlus = 0

        this.weaponIndex = 0
        this.buildIndex = -1

        this.hatIndex = 0

        this.speed = 0

        this.clan = null
        this.isClanLeader = false

        this.dt = 0

        this.isAttack = false
        this.animAttackTime = 0
        this.animAttackIndex = 0
        this.animAttackRatio = 0
        this.animSpeed = 0

        this.targetAngle = -config.hitAngle

        this.attackState = false
        this.autoAttackState = false

        this.health = data[5]
        this.maxHealth = config.player.maxHealth

        this.gold = 0
        this.food = 0
        this.wood = 0
        this.stone = 0

        this.weapons = []
        this.items = []
        
        this.messages = []

        this.lockDir = false

        this.itemsCount = {}

        this.skinRotate = 0

        this.hatImage = null
        this.hatSpriteIndex = 0
        this.hatSpriteReverse = false
        this.hatSpriteTime = null

        this.breathAnimation = new BreathAnimation({
            scaleRatio: 300,
            reductionWhenRunning: true,
            entity: this,
            speeds: {
                min: 1,
                max: 500
            }
        })

        this.inGame = true

        this.effectsIDs = 0
        this.effectsManager = new EffectsManager(this)
    }

    get weapon() {
        return weapons[this.weaponIndex]
    }

    get hat() {
        return hats[this.hatIndex]
    }

    get isAlly() {
        return clanMembers.isMemeber(this.id)
    }

    kill() {
        this.isAlive = false
        this.inGame = false
        this.weapons = []
        this.items = []
        
        this.isNeedSelectUpgrade = false
        this.selectUpgrades = []

        $upgradesBar.html = ""
    }

    updateLevel(level, xp, maxXP) {
        this.level = level
        this.xp = xp
        this.maxXP = maxXP
    }

    updateWeapons(weapons) {
        this.weapons = weapons
    }

    updateItems(items) {
        this.items = items
    }

    updateItemsCount(itemsCount) {
        this.itemsCount = itemsCount
    }

    updateUpgradesItems(data) { 
        $upgradesBar.html = ""

        for (let i = 0; i < data.length; i += 2) {
            const chunk = data.slice(i, i + 2)
            const settings = chunk[1] ? weapons[chunk[0]] : items[chunk[0]]

            if (!settings) continue

            if (chunk[1]) {
                const weaponImg = getWeaponImage(settings)

                $upgradesBar.insert(`
                <div class="action-bar-item" windex="${settings.id}">
                    <div class="action-bar-item-holder"></div>
                </div>
                `)

                const actionItem = new $Element(`.action-bar-item[windex="${settings.id}"] > .action-bar-item-holder`)

                weaponImg.image.classList.add("action-bar-item-icon", "action-weapon")
                weaponImg.image.setAttribute("draggable", "false")
                weaponImg.image.style.transform = `rotate(225deg) translateY(${settings.cssTranslate}px) scale(${settings.cssScale})`

                if (weaponImg.isLoaded) {
                    actionItem.append(weaponImg.image)
                } else {
                    weaponImg.image.addEventListener("load", () => {
                        actionItem.append(weaponImg.image)
                    })
                }

                continue
            }

            const itemImg = getItemSprite(settings, true, /berry/.test(settings.name) ? 3 : null)

            $upgradesBar.insert(`
            <div class="action-bar-item" index="${settings.id}">
                <div class="action-bar-item-holder">
                    <img class="action-bar-item-icon action-item" src="${itemImg.toDataURL()}" bindex="${settings.id}" draggable="false">
                </div>
            </div>
            `)
        }
    }

    updateActionItems() {
        $actionBar.html = ""

        let hotkey = 1

        for (let i = 0; i < this.weapons.length; i++) {
            const weaponIndex = this.weapons[i]
            const weapon = weapons[weaponIndex]

            if (!weapon) continue

            const weaponImg = getWeaponImage(weapon)

            $actionBar.insert(`
            <div class="action-bar-item" index="${weaponIndex}" hotkey="${hotkey}">
                <div class="action-bar-item-holder"></div>
            </div>
            `)
            
            const actionItem = new $Element(`.action-bar-item[index="${weaponIndex}"] > .action-bar-item-holder`)

            weaponImg.image.classList.add("action-bar-item-icon", "action-weapon")
            weaponImg.image.setAttribute("draggable", "false")
            weaponImg.image.style.transform = `rotate(225deg) translateY(${weapon.cssTranslate}px) scale(${weapon.cssScale})`

            if (weaponImg.isLoaded) {
                actionItem.append(weaponImg.image)
            } else {
                weaponImg.image.addEventListener("load", () => {
                    actionItem.append(weaponImg.image)
                })
            }

            hotkey += 1
        }

        for (let i = 0 ; i < this.items.length; i++) {
            const itemIndex = this.items[i]
            const item = items[itemIndex]

            if (!item) continue

            const itemImg = getItemSprite(item, true, /berry/.test(item.name) ? 3 : null)

            $actionBar.insert(`
            <div class="action-bar-item" index="${itemIndex}" hotkey="${hotkey}">
                <div class="action-bar-item-holder">
                    <img class="action-bar-item-icon action-item" src="${itemImg.toDataURL()}" draggable="false">
                </div>
            </div>
            `)

            hotkey += 1
        }
    }

    setData(data) {        
        this.dt = 0
        this.x1 = this.x
        this.y1 = this.y
        this.x2 = data[1]
        this.y2 = data[2]
        this.speed = Math.hypot(this.y2 - this.y1, this.x2 - this.x1)
        this.dir1 = this.dir2 !== null ? this.dir2 : data[3]
        this.dir2 = data[3]
        this.t1 = this.t2 !== null ? this.t2 : Date.now()
        this.t2 = Date.now()
        this.isAlive = true
        this.weaponIndex = data[4]
        this.buildIndex = data[5]
        this.hatIndex = data[6]
        this.clan = data[7]
        this.isClanLeader = data[8]
        this.effectsIDs = data[9]?.toString()
    }

    receiveChat(message) {
        this.messages = this.messages.slice(0, config.player.chat.maxMessages)

        this.messages = [{
            value: message,
            createdTime: Date.now()
        }].concat(this.messages)
    }

    changeHealth(value) {
        this.health = value
    }

    startGatherAnimation(didHit) {
        if (this.isAttack || !this.weapon) return

        this.isAttack = true
        this.dirPlus = 0
        this.animAttackTime = 0
        this.animAttackRatio = 0
        this.animAttackIndex = 0

        this.animAttackTime = this.animSpeed = this.weapon.speed

        this.targetAngle = didHit ? -config.hitAngle : -Math.PI
    }

    stopGatherAnimation() {
        this.isAttack = false
        this.dirPlus = 0
        this.animAttackTime = 0
        this.animAttackRatio = 0
        this.animAttackIndex = 0
        this.animSpeed = 0
    }

    updateGatherAnimation() {
        if (!this.isAttack) return
        
        if (this.animAttackTime > 0) {
            this.animAttackTime -= renderer.delta

            if (this.animAttackTime <= 0) {
                this.stopGatherAnimation()
            } else {
                if (this.animAttackIndex == 0) {
                    this.animAttackRatio += renderer.delta / (this.animSpeed * config.hitReturnRatio)

                    this.dirPlus = lerp(0, this.targetAngle, Math.min(1, this.animAttackRatio))

                    if (this.animAttackRatio >= 1) {
                        this.animAttackRatio = 1
                        this.animAttackIndex = 1
                    }
                } else {
                    this.animAttackRatio -= renderer.delta / (this.animSpeed * (1 - config.hitReturnRatio))

                    this.dirPlus = lerp(0, this.targetAngle, Math.max(0, this.animAttackRatio))
                }
            }
        }
    }
    
    renderClan() {
        if (!this.isAlive || !this.inGame || !this.clan) return

        const clan = config.player.clan
        const clanValue = `[${this.clan}]`

        context.save()
        context.font = `${clan.size}px ${config.textFont}`

        const size = context.measureText(clanValue)
        const clanValueHeight = size.actualBoundingBoxAscent + (size.actualBoundingBoxDescen || 0)

        context.fillStyle = clan.color
        context.strokeStyle = clan.outlineColor
        context.textBaseline = "middle"
        context.textAlign = "center"
        context.lineWidth = clan.outlineWidth
        context.lineJoin = "round"

        context.translate(
            this.x - camera.xOffset + clan.xOffset, 
            this.y - camera.yOffset - this.scale + clan.yOffset
        )
        context.strokeText(clanValue, 0, 0)
        context.fillText(clanValue, 0, 0)

        if (this.isClanLeader) {
            const leaderIcon = getIconImage("clan_leader")
         
            if (leaderIcon.isLoaded) {
                context.drawImage(
                    leaderIcon.image, 
                    -(clan.leaderIconScale + size.width / 2) + clan.leaderIconXOffset, 
                    -(clan.leaderIconScale - clanValueHeight / 2) + clan.leaderIconYOffset, 
                    clan.leaderIconScale,
                    clan.leaderIconScale
                )
            }
        }

        context.restore()
    }

    renderNickname() {
        if (!this.isAlive || !this.inGame) return

        const nickname = config.player.nickname

        this.renderClan()

        context.save()
        context.font = `${nickname.size}px ${config.textFont}`
        context.fillStyle = nickname.color
        context.strokeStyle = nickname.outlineColor
        context.textBaseline = "middle"
        context.textAlign = "center"
        context.lineWidth = nickname.outlineWidth
        context.lineJoin = "round"

        context.translate(
            this.x - camera.xOffset, 
            this.y - camera.yOffset - this.scale
        )
        context.strokeText(this.nickname, nickname.xOffset, nickname.yOffset)
        context.fillText(this.nickname, nickname.xOffset, nickname.yOffset)
        context.restore()
    }

    renderHealthbar() {
        if (!this.isAlive || !this.inGame) return

        const healthbar =  config.player.healthbar

        context.save()
        context.translate(
            this.x - camera.xOffset, 
            this.y - camera.yOffset + this.scale
        )

        context.fillStyle = healthbar.outlineColor

        context.roundRect(
            -healthbar.width - healthbar.padding + healthbar.xOffset,
            healthbar.yOffset,
            (healthbar.width * 2) + (healthbar.padding * 2), 
            healthbar.height, healthbar.radius
        )
        context.fill()

        const gradient = context.createLinearGradient(
            -healthbar.width + healthbar.xOffset, 
            healthbar.yOffset + healthbar.padding + (healthbar.height - healthbar.padding * 2) / 2, 
            0, healthbar.height - healthbar.padding * 2
        )

        gradient.addColorStop(0, this.isAlly ? healthbar.allyColor[0] : healthbar.enemyColor[0])
        gradient.addColorStop(1, this.isAlly ? healthbar.allyColor[1] : healthbar.enemyColor[1])

        context.fillStyle = gradient

        context.roundRect(
            -healthbar.width + healthbar.xOffset,
            healthbar.yOffset + healthbar.padding,
            healthbar.width * 2 * (this.health / this.maxHealth),
            healthbar.height - healthbar.padding * 2, healthbar.radius - 1
        )
        context.fill()
        context.restore()
    }

    renderWeapon() {    
        if (!this.weapon || !this.isAlive || !this.inGame) return

        const weaponImage = getWeaponImage(this.weapon)
        const dir = this.id === playersManager.player.id && !this.lockDir ? this.mouseDir : this.dir
        const playerScale = this.scale + this.breathAnimation.breathScale
        
        if (weaponImage.isLoaded) {
            context.save()
            context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
            context.rotate(dir + this.dirPlus - (this.weapon.plusRotate || 0))

            context.drawImage(
                weaponImage.image, 
                playerScale / 2 - this.weapon.xOffset - (this.weapon.length / 2), 
                playerScale / 2 - this.weapon.yOffset - (this.weapon.width / 2),
                this.weapon.length, this.weapon.width
            )
            context.restore()
        }
    }

    renderChat() {
        if (!this.isAlive || !this.inGame) return

        const chat = config.player.chat

        for (let i = 1; i <= this.messages.length; i++) {
            const message = this.messages[i - 1]
            const time = Date.now() - message.createdTime

            if (time >= config.chatRemoveTime) {
                this.messages.pop()

                continue
            }

            context.save()
            context.font = `${chat.textSize}px ${config.textFont}`

            const size = context.measureText(message.value)

            let alpha = 1

            if (time >= config.chatRemoveTime - chat.alphaTime) {
                alpha = 1 - ((time - ( config.chatRemoveTime - chat.alphaTime)) / chat.alphaTime)
            } else if (time <= chat.alphaTime) {
                alpha = (time / chat.alphaTime)
            }

            context.globalAlpha = alpha
            context.textBaseline = "middle"
            context.textAlign = "center"

            context.translate(
                this.x - camera.xOffset, 
                this.y - camera.yOffset - this.scale * i - chat.margin * i
            )

            const width = size.width + chat.width
            const height = chat.height
            const yOffset = chat.yOffset * (this.clan ? 1.5 : 1)
            
            context.fillStyle = chat.bgColor

            context.roundRect(-width / 2 + chat.xOffset, -height / 2 + yOffset, width, height, 6)
            context.fill()

            context.fillStyle = chat.color
            
            context.fillText(message.value, chat.xOffset, yOffset)
            context.restore()
        }
    }

    render() {
        if (!this.isAlive || !this.inGame) return
        
        const handAngle = Math.PI / 4
        const handXOffsets = this.buildIndex < 0 ? this.weapon.handXOffsets || [ 0, 0 ] : [ 0, 0 ]
        const handYOffsets = this.buildIndex < 0 ? this.weapon.handYOffsets || [ 0, 0 ] : [ 0, 0 ]
        const dir = this.id === playersManager.player.id && !this.lockDir ? this.mouseDir : this.dir
        const player = config.player
        const playerScale = this.scale + this.breathAnimation.breathScale
        const handScale = player.handScale + this.breathAnimation.breathScale

        if (this.buildIndex < 0 && !this.weapon.aboveHand) {
            this.renderWeapon()
        }

        context.save()
        context.strokeStyle = player.outlineColor
        context.fillStyle = player.colors[this.skinIndex]
        context.lineWidth = player.outlineWidth
        context.lineJoin = "miter"

        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        context.rotate(dir + this.dirPlus)

        renderCircle(
            playerScale * Math.cos(handAngle) + handXOffsets[0], 
            (playerScale * Math.sin(handAngle)) + handYOffsets[0], 
            handScale, context
        )
        context.fill()
        context.stroke()

        renderCircle(
            playerScale * Math.cos(-handAngle) + handXOffsets[1], 
            playerScale * Math.sin(-handAngle) + handYOffsets[1], 
            handScale, context
        )
        context.fill()
        context.stroke()

        if (this.buildIndex >= 0) {
            const item = items[this.buildIndex]
            
            if (item) {
                const itemSprite = getItemSprite(item, /windmill/.test(item.name))
        
                context.drawImage(itemSprite, playerScale - item.holdOffset, -itemSprite.width / 2)
            }
        }

        renderCircle(0, 0, playerScale, context)
        context.fill()
        context.stroke()

        if (this.hatIndex > 0) {
            let hatSrc = this.hat.src
            
            if (Array.isArray(hatSrc)) {
                if (this.hat.reverseSpriteAnim) {
                    if (this.hatSpriteIndex >= hatSrc.length - 1) {
                        this.hatSpriteReverse = true
                    } else if (this.hatSpriteIndex < 1) {
                        this.hatSpriteReverse = false
                    }
                } else {
                    this.hatSpriteReverse = false

                    if (this.hatSpriteIndex >= hatSrc.length) {
                        this.hatSpriteIndex = 0
                    }
                }
                
                hatSrc = hatSrc[this.hatSpriteIndex]

                if (!this.hatSpriteTime || Date.now() - this.hatSpriteTime >= this.hat.spriteFrameSpeed) {
                    this.hatSpriteIndex += this.hatSpriteReverse ? -1 : 1

                    this.hatSpriteTime = Date.now()
                }
            }

            const hat = this.hatImage = getHatImage(hatSrc)

            if (hat.isLoaded) {
                const scale = this.hat.scale + this.breathAnimation.breathScale
                
                context.rotate(Math.PI / 2)
                context.rotate(this.skinRotate)
                context.drawImage(hat.image, -scale / 2, -scale / 2, scale, scale)
            }

            if (this.hat.skinRotate) {
                this.skinRotate += this.hat.skinRotate * renderer.delta
            }
        }
        context.restore()

        this.effectsManager.update()
    }

    update() {
        if (!this.isAlive || !this.inGame) return

        if (this.isAttack) {
            this.updateGatherAnimation()
        }

        this.breathAnimation.update(renderer.delta)

        this.render()

        if (this.effectsIDs) {
            const effectsIDs = this.effectsIDs.match(/../g)

            if (!effectsIDs) return this.effectsManager.effects.clear()

            this.effectsManager.effects.forEach((effect, effectID) => {
                if (effectsIDs.includes(effectID.toString())) return
    
                effect.destroy()
            })
    
            for (let i = 0; i < effectsIDs.length; i++) {
                const effectID = parseInt(effectsIDs[i])
    
                this.effectsManager.add(effectID)
            }
        } else {
            this.effectsManager.effects.clear()
        }
    }
}

export default Player