import config from "../config.js"
import { camera, canvas, context, renderer } from "../constants.js"

class Grid {
    constructor() {
        this.name = "background"

        this.id = config.layers.grid[1]
        this.layer = config.layers.grid[0]

        this.x = 0
        this.y = 0

        this.isInit = false
    }

    get width() {
        return canvas.viewport.width
    }

    get height() {
        return canvas.viewport.height
    }

    render() {
        context.save()
        context.strokeStyle = config.grid.color
        context.lineWidth = config.grid.width
        context.globalAlpha = config.grid.alpha

        context.beginPath()

        for (let x = -camera.x; x < this.width; x += this.height / config.grid.difX) {
            if (x > 0) {
                context.moveTo(x, 0)
                context.lineTo(x, this.height)
            }
        }

        for (let y = -camera.y; y < this.height; y += this.height / config.grid.difY) {
            if (y > 0) {
                context.moveTo(0, y)
                context.lineTo(this.width, y)
            }
        }

        context.stroke()
        context.restore()

        camera.xOffset = camera.x - (canvas.viewport.width / 2)
        camera.yOffset = camera.y - (canvas.viewport.height / 2)
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.render.bind(this)
        })
    }
}

export default Grid