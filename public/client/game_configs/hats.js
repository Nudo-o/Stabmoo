class Hat {
    constructor({
        id,
        iconSrc,
        src,
        name,
        type,
        desc,
        scale,
        price,
        skinRotate,
        reverseSpriteAnim,
        spriteFrameSpeed
    }) {
        this.id = id
        this.iconSrc = iconSrc
        this.src = src
        this.name = name
        this.type = type
        this.desc = desc
        this.scale = scale || 120
        this.price = price || 0
        this.skinRotate = skinRotate
        this.reverseSpriteAnim = reverseSpriteAnim
        this.spriteFrameSpeed = spriteFrameSpeed
        
        this.isHat = true
    }
}

export default {
    11: new Hat({
        id: 11,
        iconSrc: "/assets/hats/boost/boost_hat_gif.gif",
        src: ["boost/boost_1", "boost/boost_2", "boost/boost_3", "boost/boost_4"],
        name: "Booster Hat",
        type: "Physical",
        desc: "Increases the speed of movement",
        price: 4000,
        spriteFrameSpeed: 50
    }),
    12: new Hat({
        id: 12,
        iconSrc: "/assets/hats/fire/fire_hat_gif.gif",
        src: [
            "fire/fire_1", "fire/fire_2", 
            "fire/fire_3", "fire/fire_4"
        ],
        name: "Fire Hat",
        type: "Magic",
        desc: "Sets the player on fire and deals permanent 4 damage to the player for 5 seconds",
        price: 10000,
        spriteFrameSpeed: 75
    }),
    13: new Hat({
        id: 13,
        iconSrc: "/assets/hats/demlood/demlood_hat_gif.gif",
        src: [
            "demlood/demlood_1", "demlood/demlood_2", 
            "demlood/demlood_3", "demlood/demlood_4",
            "demlood/demlood_5"
        ],
        name: "Demlood Hat",
        type: "Mythical",
        desc: "Demon blood hat is so called because it increases your damage, but at the same time takes away your health",
        price: 8000,
        spriteFrameSpeed: 75,
        scale: 140
    }),
    14: new Hat({
        id: 14,
        iconSrc: "/assets/hats/ice/ice_hat.png",
        src: "ice/ice",
        name: "Ice Hat",
        type: "Magic",
        desc: "The player will be frozen for 4 seconds. Reuse after 3 seconds",
        price: 13000,
    }),
    1000: new Hat({
        id: 1000,
        iconSrc: "/assets/hats/credits/nudo_hat.png",
        src: "credits/nudo",
        name: "Nudo Hat",
        type: "Credit",
        desc: "Main dev :3"
    }),
    1001: new Hat({
        id: 1001,
        iconSrc: "/assets/hats/credits/forbiddy_hat.png",
        src: "credits/forbiddy",
        type: "Credit",
        name: "Mysthiccy Eaten",
        desc: "haii ^-^ hiii haiii~ <3 hiiiii :33"
    }),
    2000: new Hat({
        id: 2000,
        iconSrc: "/assets/hats/free/stabmoo_hat.png",
        src: "free/stabmoo",
        type: "Free",
        name: "StabMoo Cap",
        desc: "Good cap :3"
    }),
    2001: new Hat({
        id: 2001,
        iconSrc: "/assets/hats/free/berry_hat.png",
        src: "free/berry",
        type: "Free",
        name: "Berry Cap",
        desc: "Well, what can I say?! This is a berry cap"
    }),
    2002: new Hat({
        id: 2002,
        iconSrc: "/assets/hats/free/diep_hat.png",
        src: "free/diep",
        type: "Free",
        name: "Diep Cap",
        desc: "Diep.io???"
    })
    /*2003: new Hat({
        id: 2003,
        iconSrc: "/assets/hats/free/dark_explorer_hat.png",
        src: "free/dark_explorer",
        type: "Free",
        name: "Dark Explorer Hat",
        desc: "It's better not to mess with this guy.. He knows a lot about things that are not worth knowing"
    })*/
}