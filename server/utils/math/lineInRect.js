function lineInRect(recX, recY, recX2, recY2, x1, y1, x2, y2) {
    const dx = x2 - x1

    let minX = x1
    let minY = y1
    let maxX = x2
    let maxY = y2

    if (x1 > x2) {
        minX = x2
        maxX = x1
    }

    if (maxX > recX2) maxX = recX2
    if (minX < recX) minX = recX
    if (minX > maxX) return false

    if (Math.abs(dx) > 0.0000001) {
        const a = (y2 - y1) / dx
        const b = y1 - a * x1

        minY = a * minX + b
        maxY = a * maxX + b
    }
    
    if (minY > maxY) {
        const tmp = maxY

        maxY = minY
        minY = tmp
    }

    if (maxY > recY2) maxY = recY2
    if (minY < recY) minY = recY
    if (minY > maxY) return false

    return true
}

export default lineInRect