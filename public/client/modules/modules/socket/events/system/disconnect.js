import { $gameStateText, $gameUI, $mainMenu, $menuCardHolder } from "../../../../constants.js"

function disconnect(data) {
    $menuCardHolder.hide()
    $gameUI.hide()
    $mainMenu.show()
    $gameStateText.show()

    $gameStateText.text = "disconnected"

    if (!data?.length) return

    if (data[0] === "") return

    $gameStateText.element.innerHTML += `<span>${data[0]}</span>`
}

export default disconnect