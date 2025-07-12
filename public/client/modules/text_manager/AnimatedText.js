import config from "../../config.js"
import { camera, context, renderer } from "../../constants.js"
import Point from "../../utils/2d/Point.js"

class AnimatedText extends Point {
    constructor(id, text, x, y, colorIndex) {
        super(x, y, 0)

        this.id = id
        this.text = text

        this.color = config.animatedText.colors[colorIndex || 0]

        this._scale = 25
        this.staticScale = this._scale
        this.maxScale = this.staticScale * 1.5
        this.scaleSpeed = .03
        
        this._lifeTime = 1000
        this.staticLifeTime = this._lifeTime

        this.speed = .02

        this._alpha = 1

        this.active = true
    }

    get lifeTime() {
        return Math.max(Math.min(this._lifeTime, this.staticLifeTime), 0)
    }

    set lifeTime(value) {
        this._lifeTime = value
    }

    get scale() {
        return Math.max(Math.min(this._scale, this.maxScale), 0)
    }

    set scale(value) {
        this._scale = value
    }

    get alpha() {
        return Math.max(this._alpha, 0)
    }

    set alpha(value) {
        this._alpha = value
    }

    destroy() {}

    render() {
        if (!this.active) return
        
        context.save()
        context.fillStyle = this.color
        context.font = `${this.scale}px Hammersmith One`
        context.strokeStyle = config.animatedText.outlineColor
        context.textBaseline = "middle"
        context.textAlign = "center"
        context.lineWidth = config.animatedText.outlineWidth
        context.lineJoin = "round"
        context.globalAlpha = this.alpha

        context.translate(this.x - camera.xOffset, this.y - camera.yOffset)
        context.strokeText(this.text, 0, 0)
        context.fillText(this.text, 0, 0)
        context.restore()
    }

    update() {
        if (this.lifeTime <= 0) {
            this.active = false

            return this.destroy()
        }

        this.lifeTime -= renderer.delta
        this.alpha = this.lifeTime / this.staticLifeTime

        this.velocity.sub(0, this.speed * renderer.delta)

        this.scale += this.scaleSpeed * renderer.delta

        if (this.scale >= this.maxScale) {
            this.scale = this.maxScale
            this.scaleSpeed *= -1
        } else if (this.scale <= this.staticScale) {
            this.scale = this.staticScale
            this.scaleSpeed = 0
        }

        this.updatePhysics()

        this.render()
    }
}

export default AnimatedText