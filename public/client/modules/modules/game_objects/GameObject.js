import randInt from "../../../../server/utils/math/randInt.js"
import config from "../../config.js"
import { camera, clanMembers, context, particlesManager, playersManager, renderer } from "../../constants.js"
import items from "../../game_configs/items.js"
import resources from "../../game_configs/resources.js"
import Point from "../../utils/2d/Point.js"
import renderBlob from "../../utils/render/renderBlob.js"
import renderCircle from "../../utils/render/renderCircle.js"
import getItemSprite from "./getItemSprite.js"
import getResourceSprite from "./getResourceSprite.js"

class GameObject extends Point {
    constructor(data) {
        super(0, 0, data[4])

        this.setTo(data[1], data[2])

        this.id = data[0]
        this.dir = data[3]
        this.type = data[5]
        this.data = (data[6] || data[6] === 0) ? items[data[5]] : resources[data[5]]
        this.ownerID = data[6]
        this.berries = data[7] || 0
        this.health = data[8]

        this.maxHealth = this.data.health

        this.dir2 = this.dir
        
        this.xWiggle = 0
        this.yWiggle = 0

        this.isItem = Boolean(data[6] || data[6] === 0)

        this.lastChangeHealth = null
    }

    get isAlly() {
        return clanMembers.isMemeber(this.ownerID)
    }

    changeHealth(health) {
        this.health = health

        this.lastChangeHealth = Date.now()
    }

    doGatherWiggle(angle) {        
        this.xWiggle += config.gatherWiggle * Math.cos(angle)
        this.yWiggle += config.gatherWiggle * Math.sin(angle)

        if (!this.isItem) {
            const particleX = this.x + (this.scale / 1.25) * -Math.cos(angle)
            const particleY = this.y + (this.scale / 1.25) * -Math.sin(angle)
            
            for (let i = 0; i < this.data.gatherParticlesAmount; i++) {
                const xAngle = angle + [Math.random(), -Math.random()][randInt(0, 1)]
                const yAngle = angle + [Math.random(), -Math.random()][randInt(0, 1)]

                particlesManager.add(
                    particleX, particleY, 
                    this.scale / 7, 350, config.gatherPacrticlesSpeed, 
                    -Math.cos(xAngle), -Math.sin(yAngle), 
                    () => {
                        const sprite = getResourceSprite(this)
        
                        context.scale(.18, .18)
                        context.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2))
                    }
                )
            }
        }
    }

    updateBerries(berries) {
        if (this.isItem && this.type !== 3) return

        this.berries = berries
    }

    renderHealthbar() {
        if (!this.isItem || !this.health) return

        const healthbar = config.buildings.healthbar

        if (!this.lastChangeHealth || Date.now() - this.lastChangeHealth >= healthbar.hideDelay) return

        context.save()
        context.translate(
            this.x + this.xWiggle - camera.xOffset, 
            this.y + this.yWiggle - camera.yOffset
        )

        context.fillStyle = healthbar.outlineColor

        context.roundRect(
            -healthbar.width - healthbar.padding + healthbar.xOffset,
            this.scale + healthbar.yOffset,
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
            this.scale + healthbar.yOffset + healthbar.padding,
            healthbar.width * 2 * (this.health / this.maxHealth),
            healthbar.height - healthbar.padding * 2, healthbar.radius - 1
        )
        context.fill()
        context.restore()
    }

    render() {
        let sprite = null

        if (!this.isItem) {
            sprite = getResourceSprite(this)
        } else {
            sprite = getItemSprite(this.data)
        }

        if (this.data.turnSpeed) {
            this.dir2 += this.data.turnSpeed * renderer.delta
        }

        context.save()
        context.translate(this.x + this.xWiggle - camera.xOffset, this.y + this.yWiggle - camera.yOffset)
        context.rotate(this.dir)
        context.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2))

        if (this.isItem) {
            if (/windmill/.test(this.data.name)) {
                context.strokeStyle = this.data.outlineColor
                context.lineWidth = this.data.outlineWidth

                context.rotate(this.dir2)

                for (let i = 0; i < this.data.blades; i++) {
                    const width = this.data.scale * 1.5
                    const height = this.data.scale / 2.25

                    context.fillStyle = this.data.colors[3]

                    context.rotate((Math.PI / 2) * i)
                    context.roundRect(-width, -height / 2, width * 2, height, 8)
                    context.fill()
                    context.stroke()
                }

                context.fillStyle = this.data.colors[2]

                context.rotate(this.dir2)
                renderBlob(context, this.data.sides - 1, (this.data.scale / 2) * 1.1, (this.data.scale / 2) * .8)
                context.fill()
                context.stroke()
            }
        } else {
            if ((this.type === 3 || this.type === 4) && this.berries > 0) {
                const biomeID = 0
                const rotVal = Math.PI * 2 / this.data.maxBerries
    
                for (var i = 0; i < this.berries; ++i) {
                    const tmpRange = this.scale / ((3.5 + 2.3) / 2)
    
                    context.fillStyle = this.data.colors[biomeID][1]
                    context.strokeStyle = this.data.outlineColor
                    context.lineWidth = this.data.outlineWidth
    
                    renderCircle(
                        tmpRange * Math.cos(rotVal * i), 
                        tmpRange * Math.sin(rotVal * i),
                        11, context
                    )
                    context.fill()
                    context.stroke()
                }
            }
        }
   
        context.restore()
    }

    update() {
        if (this.xWiggle) {
            this.xWiggle *= Math.pow(0.99, renderer.delta)
        }
        if (this.yWiggle) {
            this.yWiggle *= Math.pow(0.99, renderer.delta)
        }

        this.render()
    }
}

export default GameObject