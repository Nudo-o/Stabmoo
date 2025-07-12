import { camera, context, particlesManager, renderer } from "../../constants.js"
import Point from "../../utils/2d/Point.js"

class Particle extends Point {
    constructor(id, x, y, scale, lifeTime, speed, xAngle, yAngle, render) {
        super(0, 0, scale)

        this.setTo(x, y)

        this.id = id
        this.lifeTime = this.maxLifeTime = lifeTime
        this.speed = speed
        this.xAngle = xAngle
        this.yAngle = yAngle
        this.render = render

        this.x1 = this.x
        this.y1 = this.y
        this.x2 = this.x1
        this.y2 = this.y1

        this.dt = 0

        this.createdTime = Date.now()
    }

    update() {
        this.dt = 0

        if (this.lifeTime <= 0) {
            return particlesManager.remove(this.id)
        }

        this.lifeTime -= renderer.delta

        const speed = this.speed * renderer.delta

        this.acceleration.add(speed * this.xAngle, speed * this.yAngle)

        this.x1 = this.x
        this.y1 = this.y

        this.updatePhysics()

        this.x2 = this.x
        this.y2 = this.y

        context.save()
        context.globalAlpha = Math.max(this.lifeTime / this.maxLifeTime, .5)

        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        context.rotate(this.angle)
        this.render()
        context.restore()
    }
}

export default Particle