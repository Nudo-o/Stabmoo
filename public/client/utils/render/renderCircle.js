function renderCircle(x, y, scale, tmpContext) {
    tmpContext = tmpContext

    tmpContext.beginPath()
    tmpContext.arc(x, y, scale, 0, Math.PI * 2)
    tmpContext.closePath()
}

export default renderCircle