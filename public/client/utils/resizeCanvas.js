import config from "../config.js"


function resizeCanvas(canvas) {
    const { innerWidth, innerHeight } = window
    const zoom = canvas.viewport.zoom || config.viewport.zoom
    const resolutionWidth = config.viewport.resolution[0] * zoom 
    const resolutionHeight = config.viewport.resolution[1] * zoom
    const scale = Math.max(innerWidth / resolutionWidth, innerHeight / resolutionHeight)
    
    canvas.viewport = {
        resolution: [ resolutionWidth, resolutionHeight ],
        width: innerWidth / scale,
        height: innerHeight / scale,
        scale: scale,
        zoom: zoom
    }

    canvas.width = innerWidth
    canvas.height = innerHeight

    canvas.style.width = `${innerWidth}px`
    canvas.style.height = `${innerHeight}px`

    canvas.context.scale(canvas.viewport.scale, canvas.viewport.scale)
}

export default resizeCanvas
