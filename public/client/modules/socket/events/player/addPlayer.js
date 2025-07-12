import { $gameStateText, $gameUI, $mainMenu, $menuCardHolder, objectsManager, playersManager, profileCard } from "../../../../constants.js"

function addPlayer(data) {
    if (typeof data[0] === 'boolean' && data[0] === true) {
        const player = playersManager.add(data.slice(1))
        
        playersManager.player = player

        player.inGame = true

        $mainMenu.hide()
        $gameUI.show()
        $gameStateText.hide()
        $menuCardHolder.hide()

        profileCard.updateNickname()
        profileCard.updateHealthBar()
        profileCard.updateLevelBar()

        return
    }

    playersManager.add(data)
}

export default addPlayer
