import { $gameUI, $mainMenu, $menuCardHolder, lastOpenedElements, particlesManager, playersManager } from "../../../../constants.js"

function killPlayer() {
    playersManager.player.kill()

    $mainMenu.show()
    $gameUI.hide()
    $menuCardHolder.show()

    particlesManager.reset()

    lastOpenedElements.forEach((element) => {
        element.hide()
    })

    lastOpenedElements.clear()
}

export default killPlayer
