import Vector from "./Vector.js"

class Physics {
    constructor(x, y, mass = 5, time = 0.9) {
        this.mass = mass
        this.time = time

        this.position = new Vector(x, y)
        this.velocity = new Vector()
        this.acceleration = new Vector()
        this.force = new Vector()

        this.position.lastX = this.position.x
        this.position.lastY = this.position.y

        this.velocity.lastX = this.velocity.x
        this.velocity.lastY = this.velocity.y
    }

    updatePhysics() {
        this.position.lastX = this.position.x
        this.position.lastY = this.position.y

        this.velocity.lastX = this.velocity.x
        this.velocity.lastY = this.velocity.y

        this.force.div(this.mass)

        this.acceleration.add(this.force.x, this.force.y)
        this.acceleration.mult(this.time)

        this.velocity.add(this.acceleration.x, this.acceleration.y)
        this.velocity.mult(this.time)

        this.position.add(this.velocity.x, this.velocity.y)
    }

    resetPhysics() {
        this.force.reset()
        this.acceleration.reset()
        this.velocity.reset()
    }
}

export default Physics