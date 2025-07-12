class Module {
    constructor({
        id,
        iconSrc,
        name,
        desc,
        effect,
        price,
    }) {
        this.id = id
        this.iconSrc = iconSrc
        this.name = name
        this.desc = desc
        this.effect = effect
        this.price = price || 0
        
        this.type = "Module"

        this.isModule = true
    }
}

export default {
    500: new Module({
        id: 500,
        iconSrc: "/assets/icons/modules/more_buildings_icon.png",
        name: "More buildings",
        desc: "Increases the placement limit for each building",
        effect: "more_buildings",
        price: 15000,
    }),
    501: new Module({
        id: 501,
        iconSrc: "/assets/icons/modules/zoom_out_icon.png",
        name: "Zoom out",
        desc: "Increases the range of drawing and scaling of the game",
        effect: "zoom_out",
        price: 20000,
    })
}