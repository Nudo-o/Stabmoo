import config from "../config.js"
import { camera, canvas, context, renderer } from "../constants.js"

class Boundings {
    constructor() {
        this.name = "boundings"

        this.id = config.layers.boundings[1]
        this.layer = config.layers.boundings[0]
    }

    get width() {
        return canvas.viewport.width
    }

    get height() {
        return canvas.viewport.height
    }

    render() {
        context.save()
        context.fillStyle = config.boundings.color
        context.globalAlpha = config.boundings.alpha

        if (camera.xOffset <= 0) {
            context.fillRect(0, 0, -camera.xOffset, this.height)
        }

        if (config.map.width - camera.xOffset <= this.width) {
            const tmpY = Math.max(0, -camera.yOffset)
    
            context.fillRect(config.map.width - camera.xOffset, tmpY, this.width - (config.map.width - camera.xOffset), this.height - tmpY)
        }

        if (camera.yOffset <= 0) {
            context.fillRect(-camera.xOffset, 0, this.width + camera.xOffset, -camera.yOffset)
        }

        if (config.map.height - camera.yOffset <= this.height) {
            const tmpX = Math.max(0, -camera.xOffset)
    
            let tmpMin = 0
    
            if (config.map.width - camera.xOffset <= this.width) {
                tmpMin = this.width - (config.map.width - camera.xOffset)
            }
    
            context.fillRect(
                tmpX, config.map.height - camera.yOffset,
                (this.width - tmpX) - tmpMin,
                this.height - (config.map.height - camera.yOffset)
            )
        }

        context.restore()
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.render.bind(this)
        })
    }
}

export default Boundings