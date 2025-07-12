import config from "../../config.js"
import { renderer } from "../../constants.js"
import GameObject from "./GameObject.js"

class ObjectsManager {
    constructor() {
        this.id = config.layers.objectsManager[1]
        this.layer = config.layers.objectsManager[0]
        this.bpId = config.layers.objectsManagerBP[1]
        this.bpLayer = config.layers.objectsManagerBP[0]

        this.objects = new Map()
        this.renderLayers = new Map([
            ["items", {}],
            ["stone", {}],
            ["food", {}],
            ["tree", {}],
        ])
        this.renderLayersBP = new Map([
            ["traps", {}]
        ])
    }

    get list() {
        return [...this.objects.values()]
    }

    reset() {
        this.objects = new Map()
        this.renderLayers = new Map([
            ["items", {}],
            ["stone", {}],
            ["food", {}],
            ["tree", {}],
        ])
        this.renderLayersBP = new Map([
            ["traps", {}]
        ])
    }

    add(data) {
        this.objects.set(data[0], new GameObject(data))

        const object = this.objects.get(data[0])

        if (this.renderLayers.has(object.data.layer)) {
            this.renderLayers.get(object.data.layer)[object.id] = object.update.bind(object)
        } else if (this.renderLayersBP.has(object.data.layer)) {
            this.renderLayersBP.get(object.data.layer)[object.id] = object.update.bind(object)
        }

        return object
    }

    remove(id) {
        const object = this.objects.get(id)

        if (object.data?.layer) {
            if (this.renderLayers.has(object.data.layer)) {
                delete this.renderLayers.get(object.data.layer)[object.id]
            }

            if (this.renderLayersBP.has(object.data.layer)) {
                delete this.renderLayersBP.get(object.data.layer)[object.id]
            }
        }

        this.objects.delete(id)
    }

    updateBP() {
        this.renderLayersBP.forEach((renderLayerBP) => {
            const renders = [...Object.values(renderLayerBP)]

            for (let i = 0; i < renders.length; i++) {
                renders[i]()
            }
        })
    }

    update() {
        this.renderLayers.forEach((renderLayer) => {
            const renders = [...Object.values(renderLayer)]

            for (let i = 0; i < renders.length; i++) {
                renders[i]()
            }
        })
    }

    init() {
        renderer.add(this.bpLayer, {
            id: this.bpId,
            _function: this.updateBP.bind(this)
        })

        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default ObjectsManager