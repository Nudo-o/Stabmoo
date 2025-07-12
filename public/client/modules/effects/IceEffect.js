import randInt from "../../../../server/utils/math/randInt.js"
import { camera, context, renderer } from "../../constants.js"
import Point from "../../utils/2d/Point.js"
import Vector from "../../utils/2d/Vector.js"
import renderStar from "../../utils/render/renderStar.js"

class FireParticle extends Point {
    constructor(x, y) {
        super(x, y, 0)

        this.velocity = Vector.random2D(Math.random() * Math.PI * 2).setMag(randInt(2, 6))

        this._scale = 16
        this.staticScale = this._scale

        this._lifeTime = 1000
        this.staticLifeTime = this._lifeTime
    }

    get lifeTime() {
        return Math.max(Math.min(this._lifeTime, this.staticLifeTime), 0)
    }

    set lifeTime(value) {
        this._lifeTime = value
    }

    get scale() {
        return Math.max(Math.min(this._scale, this.staticScale), 0)
    }

    set scale(value) {
        this._scale = value
    }

    destroy() {}

    render() {
        context.save()
        context.fillStyle = "#ade4eb"
        context.strokeStyle = "#2fb0c1"
        context.lineWidth = 2

        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        renderStar(context, 4, this.scale * 1.2, this.scale * 0.6)
        context.fill()
        context.stroke()
        context.restore()
    }

    update() {
        if (this.lifeTime <= 0) return this.destroy()

        this.lifeTime -= renderer.delta
        this.scale -= 0.014 * renderer.delta

        this.updatePhysics()

        this.render()
    }
}

class IceEffect {
    constructor(target) {
        this.target = target

        this.effectID = 11

        this.particles = new Map()

        this.lastSpawnParticle = null
    }

    destroy() {}

    spawnParticle() {
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))
        const particle = new FireParticle(this.target.x, this.target.y)

        particle.destroy = () => {
            this.particles.delete(id)
        }

        this.particles.set(id, particle)
    }

    update() {
        /*context.save()
        context.fillStyle = "rgba(22, 195, 218, .3)"
        context.strokeStyle = "#2fb0c1"
        context.lineWidth = 6
        context.lineJoin = "miter"

        context.translate(this.target.x - camera.xOffset, this.target.y - camera.yOffset)
        context.beginPath()
        context.arc(0, 0, (this.target.scale || this.target.data.scale) + (this.target.breathAnimation?.breathScale || 0), 0, Math.PI * 2)
        context.fill()
        context.stroke()
        context.closePath()
        context.restore()*/

        if (!this.lastSpawnParticle || Date.now() - this.lastSpawnParticle >= 800) {
            this.spawnParticle()

            this.lastSpawnParticle = Date.now()
        }
    }
}

export default IceEffect