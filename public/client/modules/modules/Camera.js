import config from "../config.js"
import { playersManager, renderer } from "../constants.js"
import Vector from "../utils/2d/Vector.js"
import Point from "../utils/2d/Point.js"

class Camera extends Point {
    constructor() {
        super(0, 0, 0)

        this.name = "camera"

        this.id = config.layers.camera[1]
        this.layer = config.layers.camera[0]
        
        this.target = null

        this.xVel = 0
        this.yVel = 0

        this.isInit = false

        this.x1 = null
        this.y1 = null
    }

    get x() {
        return this.position.x
    }

    get y() {
        return this.position.y
    }

    set x(value) {
        this.position = new Vector(value, this.y)
    }

    set y(value) {
        this.position = new Vector(this.x, value)
    }

    toMapMiddle() {
        this.setTo(config.map.width / 2, config.map.height / 2)
    }

    update() {
        this.target = playersManager.player

        if (this.target?.isAlive) {
            const distance = this.distanceTo(this.target)
            const angle = this.angleTo(this.target)
            const optimizedSpeed = Math.min(distance * 0.01 * renderer.delta, distance)

            if (distance > .05) {
                this.xVel = optimizedSpeed * Math.cos(angle)
                this.yVel = optimizedSpeed * Math.sin(angle)

                this.position.add(this.xVel, this.yVel)
            } else {
                this.x = this.target.x
                this.y = this.target.y
            }

            this.x1 = this.x
            this.y1 = this.y
        } else if (this.x1 !== null && this.y1 !== null) {
            this.position = new Vector(this.x1, this.y1)
        } else {
            this.toMapMiddle()
        }

        this.updatePhysics()
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default Camera