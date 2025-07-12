import config from "../config.js"
import { renderer } from "../constants.js"
import $Element from "../utils/$Element.js"

class Notification {
    constructor(id, element) {
        this.id = id
        this.element = element

        this.bar = this.element.querySelector(".notification-bar-inner")

        this.lifeTime = 10000
        this.staticLifeTime = this.lifeTime
    }

    get barWidth() {
        return (this.lifeTime / this.staticLifeTime) * 100
    }

    destroy() {}

    update() {
        if (this.lifeTime <= 1000 && !/hide/.test(this.element.style.animation)) {
            this.element.style.animation = "notification-hide 0.4s forwards"
        }

        if (this.lifeTime <= 0) {
            this.element.remove()

            return this.destroy()
        }

        this.lifeTime -= renderer.delta

        this.bar.style.width = `${this.barWidth}%`
    }
}

class Notifications {
    constructor() {
        this.id = config.layers.notifications[1]
        this.layer = config.layers.notifications[0]

        this.$list = new $Element("#notifications_list")

        this.notifications = new Map()
    }

    getNotificationLayout(id, text, color, icon) {
        return `
        <li class="ui-element notification-item" data-notification-id="${id}">
            <div class="notification-item-header">
                <img class="notification-icon" src="./assets/icons/${icon}.png">
                <span class="notification-text" style="color: ${color}">${text}</span>
            </div>

            <div class="notification-bar-wrapper">
                <div class="notification-bar-inner"></div>
            </div>
         </li>
        `
    }

    add(text, color, icon) {
        const id = parseInt(Math.random() * (Date.now() / 1000) - (Math.random() * 1000))
        const layout = this.getNotificationLayout(id, text, color, icon)

        this.$list.insert(layout)

        let notification = document.querySelector(`.notification-item[data-notification-id="${id}"]`)

        notification = new Notification(id, notification)

        notification.destroy = () => {
            this.remove(id)
        }

        this.notifications.set(id, notification)
    }

    remove(id) {
        this.notifications.delete(id)
    }
    
    update() {
        this.notifications.forEach((notification) => {
            notification.update()
        })
    }

    init() {
        window.notifications = this

        renderer.add(this.layer, {
            id: this.id,
            _function: this.update.bind(this)
        })
    }
}

export default Notifications