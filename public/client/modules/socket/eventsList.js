import addGameObject from "./events/game_object/addGameObject.js"
import addPlayer from "./events/player/addPlayer.js"
import changeHealth from "./events/player/changeHealth.js"
import chatMessage from "./events/player/chatMessage.js"
import disconnect from "./events/system/disconnect.js"
import gatherAnimation from "./events/player/gatherAnimation.js"
import killPlayer from "./events/player/killPlayer.js"
import objectWiggle from "./events/game_object/objectWiggle.js"
import removeGameObject from "./events/game_object/removeGameObject.js"
import removePlayer from "./events/player/removePlayer.js"
import setupGame from "./events/system/setupGame.js"
import updateBushBerries from "./events/game_object/updateBushBerries.js"
import updateLeaderboard from "./events/ui/updateLeaderboard.js"
import updateLevel from "./events/player_stats/updateLevel.js"
import updatePlayers from "./events/player/updatePlayers.js"
import updateResource from "./events/player_stats/updateResource.js"
import updateItems from "./events/player_stats/updateItems.js"
import updateUpgradesItems from "./events/ui/updateUpgradesItems.js"
import updateItemsCount from "./events/player_stats/updateItemsCount.js"
import changeGameObjectHealth from "./events/game_object/changeGameObjectHealth.js"
import updateClanMembers from "./events/clan/updateClanMembers.js"
import updateClans from "./events/clan/updateClans.js"
import joinedClan from "./events/clan/joinedClan.js"
import leaveClan from "./events/clan/leaveClan.js"
import updateClanRequests from "./events/clan/updateClanRequests.js"
import updateMinimap from "./events/ui/updateMinimap.js"
import addAnimal from "./events/animals/addAnimal.js"
import removeAnimal from "./events/animals/removeAnimal.js"
import updateAnimals from "./events/animals/updateAnimals.js"
import addText from "./events/system/addText.js"
import dayNightCycle from "./events/system/dayNightCycle.js"
import dayNightCycleNotice from "./events/system/dayNightCycleNotice.js"

const eventsList = {
    27.75: setupGame,
    80.25: disconnect,
    113.25: addPlayer,
    131.75: removePlayer,
    114.5: updatePlayers,
    69: gatherAnimation,
    157.25: killPlayer,
    209.25: changeHealth,
    161: updateLeaderboard,
    74: updateResource,
    236.25: addGameObject,
    213.75: removeGameObject,
    43.5: objectWiggle,
    208.25: chatMessage,
    168: updateBushBerries,
    160.75: updateLevel,
    25.75: updateItems,
    43: updateUpgradesItems,
    107.75: updateItemsCount,
    200.75: changeGameObjectHealth,
    50.25: updateClanMembers,
    54.75: updateClanRequests,
    44.5: updateClans,
    50.5: joinedClan,
    55.25: leaveClan,
    133.5: updateMinimap,
    246: addAnimal,
    248: removeAnimal,
    244.5: updateAnimals,
    194.25: addText,
    56.25: dayNightCycle,
    56.5: dayNightCycleNotice
}

export default eventsList

