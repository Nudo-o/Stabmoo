import { $gameStateText, $gameUI, $menuCardHolder } from "../../../../constants.js"

function setupGame(data) {
    $menuCardHolder.show()
    $gameUI.hide()
    $gameStateText.hide()
}

export default setupGame