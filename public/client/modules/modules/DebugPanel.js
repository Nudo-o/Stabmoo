import config from "../config.js"
import { $debugPanelHolder, animalsManager, objectsManager, particlesManager, playersManager, renderer, socket } from "../constants.js"
import $Element from "../utils/$Element.js"

class DebugPanel {
    constructor() {
        this.$wrapper = new $Element("#debug_panel_wrapper")
    }

    getTemplate(name, value) {
        return `
        <li class="debug-panel-item">
            <span>${name}</span>
            <span>${value}</span>
        </li>
        `
    }

    create(name, value) {
        const layout = this.getTemplate(name, value)

        this.$wrapper.insert(layout)
    }

    update() {
        if ($debugPanelHolder.isHidden) return

        this.$wrapper.html = ""

        const lastTime = renderer.nowUpdate - 1000 / config.serverUpdateRate
        const difTick = playersManager.player.t2 - playersManager.player.t1
        const timeDif = lastTime - playersManager.player.t1
        const tickRatio = difTick / timeDif
        
        this.create("FPS", renderer.fps.toFixed(2))
        this.create("PING", socket.ping || "...")
        this.create("DELTA", renderer.delta)
        this.create("WS_PROTOCOL", config.protocol.ws)
        this.create("HOST", config.host)
        this.create("PLAYERS", playersManager.players.size)
        this.create("ANIMALS", animalsManager.animals.size)
        this.create("OBJECTS", objectsManager.objects.size)
        this.create("PARTICLES", particlesManager.particles.size)
        this.create("DIF_TICK_2_1", Math.abs(difTick))
        this.create("DIF_TICK_TIME", Math.abs(timeDif).toFixed(2))
        this.create("TICK_RATIO", Math.abs(tickRatio).toFixed(2))
    }
}

export default DebugPanel