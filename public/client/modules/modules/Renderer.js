import { canvas, context, debugPanel, profileCard } from "../constants.js"

class Renderer {
    constructor() {
        this.fps = 0
        this.delta = 0

        this.layers = new Map([
            [ 1, new Map() ], // Systems, backgrounds, grids...
            [ 2, new Map() ], // Entities
            [ 3, new Map() ], // Resources, buildings
            [ 4, new Map() ]  // Other...
        ])

        this.nowUpdate = 0
        this.lastUpdate = Date.now()
    }

    add(layer, { id, delay = false, _function }) {
        return this.layers.get(layer).set(id, {
            layer: layer,
            id: id,
            delay: delay,
            _function: _function,
            lastUpdate: Date.now()
        })
    }

    remove(layer, id) {
        this.layers.get(layer).delete(id)
    }

    update() {
        this.nowUpdate = Date.now()
        this.fps += (1000 / Math.max(Date.now() - this.lastUpdate, 1) - this.fps) / 10
        this.delta = this.nowUpdate - this.lastUpdate
        this.lastUpdate = this.nowUpdate

        context.clearRect(0, 0, canvas.viewport.width, canvas.viewport.height)

        const layers = this.layers.values()

        for (let i = 0; i < this.layers.size; i++) {
            const layer = layers.next().value

            layer.forEach((render) => {
                if (render.delay) {
                    if (Date.now() - render.lastUpdate < render.delay) return

                    render.lastUpdate = Date.now()
                }

                render._function(this.delta)
            })
        }

        profileCard.updateProfileCanvas()
        debugPanel.update()

        requestAnimationFrame(this.update.bind(this))
    }
}

export default Renderer