import config from "../config.js"
import { animalsManager, canvas, context, objectsManager, playersManager, renderer } from "../constants.js"

class EntitiesInfo {
    constructor() {
        this.name = "entitiesInfo"

        this.id = config.layers.entitiesInfo[1]
        this.layer = config.layers.entitiesInfo[0]

        this.isInit = false
    }

    render() {
        const objects = [ ...playersManager.list, ...objectsManager.list, ...animalsManager.list ]

        for (let i = 0; i < objects.length; i++) {
            const object = objects[i]

            object.renderNickname && object.renderNickname()
            object.renderHealthbar && object.renderHealthbar()
            object.renderChat && object.renderChat()
        }
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.render.bind(this)
        })
    }
}

export default EntitiesInfo 