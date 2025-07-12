import config from "../../config.js"
import { camera, canvas, keys, renderer, socket } from "../../constants.js"
import Vector from "../../utils/2d/Vector.js"
import Player from "./Player.js"
import lerpAngle from "../../utils/math/lerpAngle.js"

const getEncodeIntIndex = 67.25
const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const changeDirEvent = 61.5
const changeMoveDirEvent = 91

class PlayersManager {
    constructor() {
        this.id = config.layers.playersManager[1]
        this.layer = config.layers.playersManager[0]

        this.players = new Map()

        this.player = null

        this.lastUpdate = null
    }

    get list() {
        return [...this.players.values()]
    }

    add(data) {
        this.players.set(data[0], new Player(data))

        return this.players.get(data[0])
    }

    remove(id) {
        this.players.delete(id)
    }

    updateData(data) {
        // data - [ id, x, y, dir, weaponIndex, buildIndex, hatIndex, clan, isClanLeader, effectsIDs ]
        const chunkLength = 10

        for (let i = 0; i < data.length; i += chunkLength) {
            const player = this.players.get(+data[i])
            const chunk = data.slice(i, i + chunkLength)

            player.setData(chunk)
        }
    }

    update() {
        if (this.player?.isAlive) {
            const mouseX = window.mouseX / canvas.viewport.scale
            const mouseY = window.mouseY / canvas.viewport.scale
            const playerPosition = new Vector(this.player.x - camera.xOffset, this.player.y - camera.yOffset)
            const mouseDir = parseFloat(playerPosition.angleTo(mouseX, mouseY).toFixed(3))

            if (!this.lastUpdate || renderer.nowUpdate - this.lastUpdate >= (1000 / config.clientSendRate)) {
                if (this.player.isAlive && !this.player.lockDir) {
                    socket.send(changeDirEvent * fourInt, mouseDir)
                }

                this.lastUpdate = renderer.nowUpdate
            }

            const clone = this.player.clone
            const left = keys.has("KeyA") || keys.has("ArrowLeft")
            const right = keys.has("KeyD") || keys.has("ArrowRight")
            const up = keys.has("KeyW") || keys.has("ArrowUp")
            const down = keys.has("KeyS") || keys.has("ArrowDown")
            const xDir = left && !right ? -1 : !left && right ? 1 : 0
            const yDir = up && !down ? -1 : !up && down ? 1 : 0

            if (xDir !== 0 || yDir !== 0) {
                clone.position.add(xDir, yDir)

                clone.updatePhysics()
    
                const moveDir = this.player.angleTo(clone)

                if (moveDir != this.player.moveDir) {
                    socket.send(changeMoveDirEvent * fourInt, moveDir)
                }

                this.player.moveDir = moveDir
            } else if (this.player.moveDir !== null) {
                this.player.moveDir = null

                socket.send(changeMoveDirEvent * fourInt, this.player.moveDir)
            }

            this.player.mouseDir = mouseDir
        }

        this.players.forEach((player) => {
            if (!player.isAlive) return

            const lastTime = renderer.nowUpdate - 1000 / config.serverUpdateRate
            const total = player.t2 - player.t1
            const fraction = lastTime - player.t1
            const ratio = total / fraction
            const rate = 170

            player.dt += renderer.delta

            const tmpRate = Math.min(1.7, player.dt / rate)

            let tmpDiff = player.x2 - player.x1

            player.x = player.x1 + (tmpDiff * tmpRate)
            tmpDiff = (player.y2 - player.y1)
            player.y = player.y1 + (tmpDiff * tmpRate)

            player.dir = lerpAngle(player.dir2, player.dir1, Math.min(1.2, ratio))

            player.update()
        })
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default PlayersManager