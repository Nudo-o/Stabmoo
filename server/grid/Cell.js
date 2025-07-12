import config from "../config.js"

class Cell {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        
        this.width = config.grid.width
        this.height = config.grid.height

        this.isEmpty = true
        this.isMain = false
    }

    get middleX() {
        return this.x + this.width / 2
    }

    get middleY() {
        return this.y + this.height / 2
    }
}

export default Cell