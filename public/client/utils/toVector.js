import Vector from "./2d/Vector.js"

function toVector(x, y) {
    let vector = null

    if (arguments[0] instanceof Vector) {
        vector = new Vector(arguments[0].x, arguments[0].y)
    } else if (typeof arguments[0] === 'number' && typeof arguments[1] === 'undefined') {
        vector = new Vector(arguments[0], arguments[0])
    } else if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
        vector = new Vector(x, y)
    } else {
        vector = new Vector(0, 0)
    }

    return vector
}

export default toVector