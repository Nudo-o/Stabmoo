import config from "../config.js"
import { playersManager, renderer } from "../constants.js"
import $Element from "../utils/$Element.js"

class Minimap {
    constructor() {
        this.id = config.layers.minimap[1]
        this.layer = config.layers.minimap[0]

        this.canvas = document.getElementById("minimap_canvas")
        this.context = this.canvas.getContext("2d")

        this.points = []
    }

    get width() {
        return config.minimap.width
    }
    
    get height() {
        return config.minimap.height
    }

    resize() {
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.canvas.style.width = `${this.width}px`
        this.canvas.style.height = `${this.height}px`
    }

    getPosition(x, y) {
        return {
            x: (x / config.map.width) * this.width,
            y: (y / config.map.height) * this.height
        }
    }

    update(data) {
        this.points = data
    }

    renderPoint(type) {
        this.context.fillStyle = config.minimap.pointColors[type]

        this.context.beginPath()
        this.context.arc(0, 0, config.minimap.pointScale, 0, Math.PI * 2)
        this.context.closePath()
        this.context.fill()
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height)

        if (!playersManager.player?.isAlive) return

        for (let i = 0; i < this.points.length; i += 3) {
            const chunk = this.points.slice(i, i + 3)
            const position = this.getPosition(chunk[0], chunk[1])

            this.context.save()

            this.context.globalAlpha = .6
            
            this.context.translate(position.x, position.y)
            this.renderPoint(chunk[2])
            this.context.restore()
        }

        this.context.save()
        
        const position = this.getPosition(playersManager.player.x, playersManager.player.y)

        this.context.translate(position.x, position.y)
        this.renderPoint(0)
        this.context.restore()
    }

    init() {
        this.resize()

        renderer.add(this.layer, {
            id: this.id,
            _function: this.render.bind(this)
        })
    }
}

export default Minimap