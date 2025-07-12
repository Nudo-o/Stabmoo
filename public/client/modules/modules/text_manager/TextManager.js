import config from "../../config.js"
import { renderer } from "../../constants.js"
import AnimatedText from "./AnimatedText.js"

class TextManager {
    constructor() {
        this.id = config.layers.textManager[1]
        this.layer = config.layers.textManager[0]

        this.texts = new Map()
    }

    get list() {
        return [...this.texts.values()]
    }

    add(type, text, x, y, colorIndex) {
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))
        const constructors = {
            "animated": AnimatedText
        }

        text = new constructors[type](id, text, x, y, colorIndex)

        text.destroy = () => {
            this.remove(id)
        }        

        this.texts.set(id, text)

        return this.texts.get(id)
    }

    remove(id) {
        this.texts.delete(id)
    }

    update() {
        this.texts.forEach((text) => {
            if (!text.active) return

            text.update()
        })
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default TextManager