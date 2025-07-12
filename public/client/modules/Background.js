import config from "../config.js"
import { camera, canvas, context, renderer } from "../constants.js"

class Background {
    constructor() {
        this.name = "background"

        this.id = config.layers.background[1]
        this.layer = config.layers.background[0]

        this.x = 0
        this.y = 0
    }

    get width() {
        return canvas.viewport.width
    }

    get height() {
        return canvas.viewport.height
    }

    render() {
        context.save()
        context.fillStyle = config.map.color
        context.fillRect(this.x, this.y, this.width, this.height)
        context.restore()
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.render.bind(this)
        })
    }
}

export default Background