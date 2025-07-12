function renderLeaf(x, y, length, radius, tmpContext) {
    const endX = x + (length * Math.cos(radius))
    const endY = y + (length * Math.sin(radius))
    const width = length * 0.4

    tmpContext.moveTo(x, y)
    tmpContext.beginPath()
    tmpContext.quadraticCurveTo(
        ((x + endX) / 2) + (width * Math.cos(radius + Math.PI / 2)),
        ((y + endY) / 2) + (width * Math.sin(radius + Math.PI / 2)), 
        endX, endY
    )
    tmpContext.quadraticCurveTo(
        ((x + endX) / 2) - (width * Math.cos(radius + Math.PI / 2)),
        ((y + endY) / 2) - (width * Math.sin(radius + Math.PI / 2)), 
        x, y
    )
    tmpContext.closePath()
    tmpContext.fill()
    tmpContext.stroke()
}

export default renderLeaf