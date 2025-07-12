import config from "../config.js"
import { $gameUI, canvas, context, notifications, playersManager, renderer } from "../constants.js"

class DayNight {
    constructor() {
        this.id = config.layers.dayNight[1]
        this.layer = config.layers.dayNight[0]

        this.state = 1

        this.nightCount = 0
    }

    setState(_state) {
        this.state = _state
    }

    showDayNotification() {
        notifications.add("The morning will start soon!", null, "day_icon")
    }

    showNightNotification() {
        notifications.add("The night will begin soon!", null, "night_icon")
    }

    render() {
        this.nightCount += ((this.state === 0 ? 1 : 0) - this.nightCount) / 160

        const oldTransform = context.getTransform()
        const color = `rgba(${[24, 0, 82, .3].map((item) => item * this.nightCount).join(", ")})`

        context.setTransform(1, 0, 0, 1, 0, 0)

        context.fillStyle = color

        $gameUI.setStyles("background", color)

        context.fillRect(0, 0, canvas.width, canvas.height)
        context.setTransform(oldTransform)
    }

    init() {
        renderer.add(this.layer, {
            id: this.id,
            _function: this.render.bind(this)
        })
    }
}

export default DayNight