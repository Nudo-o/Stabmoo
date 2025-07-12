class Module {
    constructor({
        id,
        price,
        effect
    }) {
        this.id = id
        this.price = price
        this.effect = effect

        this.isModule = true
    }
}

export default {
    500: new Module({
        id: 500,
        price: 15000,
        effect: "more_buildings"
    }),
    501: new Module({
        id: 501,
        price: 20000,
        effect: "zoom_out"
    })
}