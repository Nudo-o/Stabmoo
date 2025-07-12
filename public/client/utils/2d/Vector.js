import toVector from "../toVector.js"

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    static random2D(angle, length = 1) {
        return new Vector(length * Math.cos(angle), length * Math.sin(angle))
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    get copy() {
        return new Vector(this.x, this.y)
    }

    setMag(length) {
        return this.normalize().mult(length)
    }

    set(x = 0, y = 0) {
        const vector = toVector(x, y)

        this.x = vector.x
        this.y = vector.y

        return this
    }

    add(x = 0, y = 0) {
        const vector = toVector(x, y)

        this.x += vector.x
        this.y += vector.y

        return this
    }

    sub(x, y) {
        const vector = toVector(x, y)

        this.x -= vector.x
        this.y -= vector.y

        return this
    }

    mult(x, y) {
        const vector = toVector(x, y)

        this.x *= vector.x
        this.y *= vector.y

        return this
    }

    div(x, y) {
        const vector = toVector(x, y)

        this.x /= vector.x
        this.y /= vector.y

        return this
    }

    mulScalar(scalar) {
        const vector = toVector(scalar)

        this.x *= vector.x
        this.y *= vector.y

        return this
    }

    normalize() {
        const magnitude = this.magnitude

        if (magnitude <= 0) return this

        return new Vector(this.x, this.y).div(magnitude || 1)
    }

    projection(vector) {
        const normalized = vector.normalize()
        const scalar = this.mulScalar(vector)

        normalized.mult(scalar)

        return normalized
    }

    clamp(min, max) {
		this.x = Math.max(min.x, Math.min(max.x, this.x))
		this.y = Math.max(min.y, Math.min(max.y, this.y))

		return this
	}

    floor() {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)

		return this
	}

    dot(vector) {
		return this.x * vector.x + this.y * vector.y
	}

	cross(vector) {
		return this.x * vector.y - this.y * vector.x
	}

	lengthSq() {
		return this.x * this.x + this.y * this.y
	}

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    lerp(vector, alpha) {
		this.x += (vector.x - this.x) * -alpha
		this.y += (vector.y - this.y) * -alpha

		return this
	}

    lerpVectors(vector1, vector2, alpha) {
		this.x = vector1.x + (vector2.x - vector1.x) * alpha
		this.y = vector1.y + (vector2.y - vector1.y) * alpha

		return this
	}

    distanceTo(x, y) {
        const vector = toVector(x, y)

        return this.copy.sub(vector).length()
    }

    angleTo(x, y) {
        const vector = toVector(x, y)
        const copy = vector.copy.sub(this)

        return Math.atan2(copy.y, copy.x)
    }

    random() {
		this.x = Math.random()
		this.y = Math.random()

		return this
	}

    reset() {
        this.x = 0
        this.y = 0

        return this
    }

    log() {
        console.log(this.x, this.y)
    }
}

export default Vector