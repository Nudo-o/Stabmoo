function renderTriangle(scale, tmpContext) {
    const height = scale * (Math.sqrt(3) / 2)

    tmpContext.beginPath()
    tmpContext.moveTo(0, -height / 2)
    tmpContext.lineTo(-scale / 2, height / 2)
    tmpContext.lineTo(scale / 2, height / 2)
    tmpContext.lineTo(0, -height / 2)
    tmpContext.closePath()
}

export default renderTriangle