import FireEffect from "./FireEffect.js"
import IceEffect from "./IceEffect.js"

class EffectsManager {
    constructor(target) {
        this.target = target

        this.effects = new Map()
    }

    get list() {
        return [...this.effects.values()]
    }

    add(effectID) {
        if (this.effects.has(+effectID)) return this.effects.get(effectID)

        const effects = {
            11: FireEffect,
            12: IceEffect
        }

        const effect = new effects[+effectID](this.target)
        
        effect.destroy = () => {
            this.remove(effectID)
        }
        
        this.effects.set(effectID, effect)

        return this.effects.get(effectID)
    }

    remove(id) {
        this.effects.delete(id)
    }

    update() {
        this.effects.forEach((effect) => {
            effect.update()
        })

        this.effects.forEach((effect) => {
            effect.particles.forEach((particle) => {
                particle.update()
            })
        })
    }
}

export default EffectsManager