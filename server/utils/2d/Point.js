import Vector from "./Vector.js"
import Physics from "./Physics.js"
import toVector from "../toVector.js"

class Point extends Physics {
    constructor(x, y, width, height) {
        height = height || width

        super(x, y)

        this.width = width
        this.height = height
        this.scale = (this.width + this.height) / 2
    }

    get x() {
        return this.position.x - this.width / 2
    }

    get y() {
        return this.position.y - this.height / 2
    }

    get lastX() {
        return this.position.lastX - this.width / 2
    }

    get lastY() {
        return this.position.lastY - this.height / 2
    }

    set x(number) {
        this.position.set(number + this.width / 2, this.position.y)
    }

    set y(number) {
        this.position.set(this.position.x, number + this.height / 2)
    }

    get clone() {
        return new Point(this.position.x, this.position.y, this.width, this.height)
    }

    setTo(x, y) {
        const vector = toVector(x, y)
        
        this.position.set(vector)
    }

    copyFrom(point) {
        this.setTo(point.position.x, point.position.y)
    }

    copyTo(point) {
        point.setTo(point.position.x, point.position.y)
    }

    distanceTo(x, y) {
        if (x instanceof Point) {
            x = new Vector(x.x, x.y)
        }

        const myPoistion = toVector(this.x, this.y)
        const otherPosition = toVector(x, y)

        return myPoistion.distanceTo(otherPosition)
    }

    angleTo(x, y) {
        if (x instanceof Point) {
            x = new Vector(x.x, x.y)
        }

        const myPoistion = toVector(this.x, this.y)
        const otherPosition = toVector(x, y)

        return myPoistion.angleTo(otherPosition)
    }
}

export default Point