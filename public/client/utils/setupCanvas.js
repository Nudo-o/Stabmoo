import config from "../config.js"
import resizeCanvas from "./resizeCanvas.js"

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    if (r < 0) r = 0

    this.beginPath()
    this.moveTo(x + r, y)
    this.arcTo(x + w, y, x + w, y + h, r)
    this.arcTo(x + w, y + h, x, y + h, r)
    this.arcTo(x, y + h, x, y, r)
    this.arcTo(x, y, x + w, y, r)
    this.closePath()
    
    return this
}

function setupCanvas(canvas) {
    canvas.context = canvas.getContext("2d")

    canvas.viewport = config.viewport

    canvas.resize = () => resizeCanvas(canvas)
    
    window.addEventListener("resize", canvas.resize)

    canvas.resize()

    return canvas
}

export default setupCanvas