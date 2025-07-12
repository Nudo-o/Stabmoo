import config from "../../config.js"
import { camera, context, renderer } from "../../constants.js"
import animals from "../../game_configs/animals.js"
import Point from "../../utils/2d/Point.js"
import EffectsManager from "../effects/EffectsManager.js"
import SpriteAnimation from "./SpriteAnimation.js"

class Animal extends Point {
    constructor(data) {
        super(0, 0, 0)

        this.setTo(data[1], data[2])

        this.id = data[0]

        this.data = animals[data[4]]
        this.nickname = this.data.nickname

        this.t1 = null
        this.t2 = null

        this.x1 = this.x
        this.y1 = this.y
        this.x2 = this.x1
        this.y2 = this.y1

        this.dir = data[3]
        this.dir1 = null
        this.dir2 = null

        this.health = data[5]
        this.maxHealth = this.data.health

        this.moodState = data[6]

        this.head = new SpriteAnimation(
            this.data.model.head,
            this.data.reverseSpriteAnim,
            this.data.spriteFrameSpeed,
            true
        )
        this.headDir = 0
        this.body = new SpriteAnimation(
            this.data.model.body,
            this.data.reverseSpriteAnim,
            this.data.spriteFrameSpeed
        )
        this.tail = new SpriteAnimation(
            this.data.model.tail,
            this.data.reverseSpriteAnim,
            this.data.spriteFrameSpeed
        )

        this.head.setSprite(this.moodState)

        this.dt = 0

        this.isHeadLookActive = false
        this.lastHeadLookActive = Date.now()
        this.headLookActiveDelay = 5000
        this.headLookState = 0
        this.changeLookState = 2000
        this.staticChangeLookState = this.changeLookState

        this.resetHeadDirTime = Date.now()

        this.effectsManager = new EffectsManager(this)
        this.effectsIDs = 0

        this.active = true
    }

    setData(data) {
        this.dt = 0
        this.x1 = this.x
        this.y1 = this.y
        this.x2 = data[1]
        this.y2 = data[2]
        this.dir1 = this.dir2 !== null ? this.dir2 : data[3]
        this.dir2 = data[3]
        this.speed = Math.hypot(this.y2 - this.y1, this.x2 - this.x1)
        this.t1 = this.t2 !== null ? this.t2 : Date.now()
        this.t2 = Date.now()
        this.health = data[4]
        this.active = true
        this.moodState = data[5]
        this.effectsIDs = data[6]?.toString()
    }

    renderBody() {
        if (!this.body.currentImage.isLoaded) return

        const offsetX = -this.data.width / 2
        const offsetY = -this.data.height / 2

        context.rotate(-Math.PI / 2)
        context.drawImage(this.body.currentImage.image, offsetX, offsetY, this.data.width, this.data.height)
    }

    renderHead() {
        this.head.setSprite(this.moodState)

        if (!this.head.currentImage.isLoaded) return

        const offsetX = -(this.data.width / 2) + 0
        const offsetY = -(this.data.height / 2) + 100

        context.rotate(this.headDir)
        context.rotate(-Math.PI / 2)
        context.drawImage(this.head.currentImage.image, offsetX, offsetY, this.data.width, this.data.height)
    }

    renderTail() {
        if (!this.tail.currentImage.isLoaded) return

        const offsetX = -(this.data.width / 2) - 0
        const offsetY = -(this.data.height / 2) - 80

        context.rotate(-Math.PI / 2)
        context.drawImage(this.tail.currentImage.image, offsetX, offsetY, this.data.width, this.data.height)
    }
    
    renderHealthbar() {
        if (!this.health) return

        const healthbar = config.animals.healthbar

        context.save()
        context.translate(
            this.x - camera.xOffset, 
            this.y - camera.yOffset
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

        gradient.addColorStop(0, healthbar.color[0])
        gradient.addColorStop(1, healthbar.color[1])

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

    render() {
        if (!this.active) return

        this.head.update()
        this.body.update()
        this.tail.update()

        context.save()
        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        context.rotate(this.dir)
        this.renderTail()
        context.restore()
        
        context.save()
        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        context.rotate(this.dir)
        this.renderBody()
        context.restore()

        context.save()
        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        context.rotate(this.dir)
        this.renderHead()
        context.restore()
    }

    update() {
        if (!this.active) return

        if (this.moodState === 0 && parseInt(this.speed) <= 5) {
            if (!this.resetHeadDirTime || Date.now() - this.resetHeadDirTime >= 15000) {
                this.headDir = 0
                this.isHeadLookActive = false

                this.lastHeadLookActive = Date.now()
                this.resetHeadDirTime = Date.now()
            }

            if (!this.lastHeadLookActive || Date.now() - this.lastHeadLookActive >= this.headLookActiveDelay) {
                this.isHeadLookActive = !this.isHeadlookActive
                this.headLookActiveDelay = 5000
                this.lastHeadLookActive = Date.now()
            }

            if (this.isHeadLookActive) {
                if (this.changeLookState > 0 && this.headLookState === 0) {
                    this.changeLookState -= Math.min(renderer.delta, 100)
    
                    this.headLookState = 0
    
                    if (this.changeLookState <= 0) {
                        this.headLookState = 1

                        this.headLookActiveDelay /= 3
                    }
                } else if (this.changeLookState < this.staticChangeLookState && this.headLookState === 1) {
                    this.changeLookState += Math.min(renderer.delta, 100)
    
                    this.headLookState = 1
    
                    if (this.changeLookState >= this.staticChangeLookState) {
                        this.headLookState = 0

                        this.headLookActiveDelay /= 2
                    }
                }
    
                if (this.headLookState === 0) {
                    this.headDir -= .000015 * renderer.delta
                } else {
                    this.headDir += .000015 * renderer.delta
                }
            }

            this.headDir = Math.min(Math.max(this.headDir, -1), 1)
        } else {
            this.headDir = 0
        }

        this.render()

        this.effectsManager.update()

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

export default Animal