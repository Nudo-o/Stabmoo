import config from "./config.js"
import { needsInit, renderer, socket } from "./constants.js"
import initEventsOfElements from "./events/initEventsOfElements.js"

renderer.update()

for (const needInit of Object.values(needsInit)) {
    if (needInit.isInit) continue

    needInit.init()

    needInit.isInit = true
}

window.onload = async function() {
    initEventsOfElements()

    socket.connect(`${config.protocol.ws}://${config.host}/ws`)
}

document.oncontextmenu = () => false
window.oncontextmenu = () => false
  
window.addEventListener("contextmenu", (event) => {
    event.preventDefault()
}, false)
