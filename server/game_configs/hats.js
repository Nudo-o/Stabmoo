class Hat {
    constructor({
        id, 
        price,
        speedMult,
        damageMult,
        effects,
        debuffs
    }) {
        this.id = id
        this.price = price || 0

        this.speedMult = speedMult
        this.damageMult = damageMult

        this.effects = effects
        this.debuffs = debuffs
    }
}

// free [0 - 10]

export default {
    11: new Hat({ // boost hat
        id: 11,
        price: 4000,
        spdMult: 1.16
    }),
    12: new Hat({ // fire hat
        id: 12,
        price: 10000,
        effects: {
            permanentDamage: {
                effectID: 11,
                amount: 4,
                delay: 500,
                stopDelay: 5000
            }
        }
    }),
    13: new Hat({ // Demlood hat
        id: 13,
        price: 8000,
        damageMult: 1.6,
        debuffs: {
            lossHealth: {
                amount: 7,
                delay: 1000
            }
        }
    }),
    14: new Hat({ // fire hat
        id: 14,
        price: 13000,
        effects: {
            freezeMovement: {
                effectID: 12,
                stopDelay: 4000,
                noEffectsAfter: true
            }
        }
    }),
    1000: new Hat({ id: 1000 }), // Nudo
    1001: new Hat({ id: 1001 }), // Forbiddy's
    2000: new Hat({ id: 2000 }), // StabMoo cap
    2001: new Hat({ id: 2001 }), // Berry cap
    2002: new Hat({ id: 2002 }), // Diep cap
    // 2003: new Hat({ id: 2003 }), // Dark explorer hat
}
