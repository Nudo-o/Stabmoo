import config from "../../config.js"
import { renderer } from "../../constants.js"
import Particle from "./Particle.js"

class ParticlesManager {
    constructor() {
        this.id = config.layers.particlesManager[1]
        this.layer = config.layers.particlesManager[0]

        this.particles = new Map()
    }

    get list() {
        return [...this.particles.values()]
    }

    reset() {
        this.particles = new Map()
    }

    add(x, y, scale, lifeTime, speed, xAngle, yAngle, render) {
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))

        this.particles.set(id, new Particle(id, x, y, scale, lifeTime, speed, xAngle, yAngle, render))
    }

    remove(id) {
        this.particles.delete(id)
    }

    update() {
        this.particles.forEach((particle) => {
            const rate = 170

            particle.dt += renderer.delta

            const tmpRate = Math.min(1.7, particle.dt / rate)

            let tmpDiff = (particle.x2 - particle.x1)

            particle.x = particle.x1 + (tmpDiff * tmpRate)
            tmpDiff = (particle.y2 - particle.y1)
            particle.y = particle.y1 + (tmpDiff * tmpRate)

            particle.update()
        })
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default ParticlesManager