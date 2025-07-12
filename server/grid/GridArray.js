import config from "../config.js"
import randInt from "../utils/math/randInt.js"
import Cell from "./Cell.js"

class GridArray {
    constructor() {
        this.cells = new Map()

        this.cells.getRandomCell = function() {
            return this.get(randInt(0, this.size - 1))
        }

        this.activeCell = null
        
        this.generateCells()
    }

    getCells() {
        return [...this.cells.values()]
    }

    getFreeCells() {
        return this.getCells().filter(((cell) => cell.isEmpty))
    }

    generateCells() {
        const startX = config.grid.width
        const endX = config.map.width - config.grid.width * 2
        const startY = config.grid.width
        const endY = config.map.height - config.grid.height * 2

        for (let x = startX, i = 0; x < endX; x += config.grid.width) {
            for (let y = startY; y < endY; y += config.grid.height) {
                this.cells.set(i, new Cell(i, x, y))

                i += 1
            }
        }
    }
}

export default GridArray