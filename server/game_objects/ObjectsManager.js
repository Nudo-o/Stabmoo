import config from "../config.js"
import { gridArray, socketsManager } from "../constants.js"
import Vector from "../utils/2d/Vector.js"
import sortByProperty from "../utils/math/sortByProperty.js"

class ObjectsManager {
    constructor() {
        this.objects = new Map()
    }

    get list() {
        return [...this.objects.values()]
    }

    checkItemLocation(x, y, scale) {
        for (let i = 0; i < this.list.length; ++i) {
            const object = this.list[i]
            const blockScale = object.data.blocker ? object.data.blocker : object.getScale(object.isItem)
            const distance = object.distanceTo(new Vector(x, y))

            if (distance < (scale + blockScale)) return false
        }

        /*if (!ignoreWater && indx != 18 && y >= (config.mapScale / 2) - (config.riverWidth / 2) && y <=
            (config.mapScale / 2) + (config.riverWidth / 2)) {
            return false
        }*/

        return true
    }

    add(id, cell, cellsSize, object) {
        if (!object.isItem && !object.noGrid) {
            let cells = gridArray.getFreeCells()

            const cellsDistances = cells.map((_cell) => ({
                id: _cell.id,
                distance: Math.hypot(_cell.y - cell.y, _cell.x - cell.x)
            }))
            const nearCells = sortByProperty(cellsDistances, "distance").slice(0, cellsSize)
    
            cell.isMain = true
    
            nearCells.forEach((_cell, index) => {
                cells[index] = gridArray.cells.get(_cell.id)
                cells[index].isEmpty = false
            })
    
            object.useCells = new Map(Array.from({
                 length: cellsSize 
            }, (_, i) => [i, cells[i]]))
        }
        
        this.objects.set(id, object)
    }

    remove(id) {
        if (!this.objects.has(id)) return

        const object = this.objects.get(id)

        if (!object.isItem && !object.noGrid) {
            object.useCells.forEach((cell) => {
                cell.isEmpty = true
                cell.isMain = false
            })
        }

        this.objects.delete(id)

        const sockets = socketsManager.list

        for (let i = 0; i < sockets.length; i++) {
            const socket = sockets[i]

            if (!socket.player.canSee(object)) continue

            delete socket.canSeeObjects[object.id]

            socket.send(config.packets.removeGameObject, object.id)
        }
    }

    update() {
        this.objects.forEach((object) => {
            object.update()
        })
    }
}

export default ObjectsManager