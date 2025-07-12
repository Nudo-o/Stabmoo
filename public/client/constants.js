import Background from "./modules/Background.js"
import Boundings from "./modules/Boundings.js"
import Camera from "./modules/Camera.js"
import ClanMenu from "./modules/ClanMenu.js"
import DayNight from "./modules/DayNight.js"
import DebugPanel from "./modules/DebugPanel.js"
import EntitiesInfo from "./modules/EntitiesInfo.js"
import Grid from "./modules/Grid.js"
import ItemsInfo from "./modules/ItemsInfo.js"
import Leaderboard from "./modules/Leaderboard.js"
import Minimap from "./modules/Minimap.js"
import Notifications from "./modules/Notifications.js"
import ProfileCard from "./modules/ProfileCard.js"
import Renderer from "./modules/Renderer.js"
import StoreMenu from "./modules/StoreMenu.js"
import AnimalsManager from "./modules/animals/AnimalsManager.js"
import ObjectsManager from "./modules/game_objects/ObjectsManager.js"
import ParticlesManager from "./modules/particles/ParticlesManager.js"
import PlayersManager from "./modules/players/PlayersManager.js"
import Socket from "./modules/socket/Socket.js"
import TextManager from "./modules/text_manager/Textmanager.js"
import $Element from "./utils/$Element.js"
import setupCanvas from "./utils/setupCanvas.js"

export const $canvas = document.getElementById("game_canvas")
export const canvas = setupCanvas($canvas)
export const context = canvas.context

export const $mainMenu = new $Element("#main_menu")
export const $menuCardHolder = new $Element("#menu_card_holder")
export const $gameUI = new $Element("#game_ui")
export const $gameStateText = new $Element("#game_state_text")
export const $nameInput = new $Element("#name_input")
export const $enterGame = new $Element("#enter_game")
export const $skinList = new $Element("#skin_list")
export const $actionBar = new $Element("#action_bar")
export const $upgradesBar = new $Element("#upgrades_bar")
export const $chatHolder = new $Element("#chat_holder")
export const $chatInput = new $Element("#chat_input")
export const $leaderBoard = new $Element("#leader_board")
export const $debugPanelHolder = new $Element("#debug_panel_holder")
export const $toggleClanMenu = new $Element("#toggle_clan_menu")
export const $clanMenuHolder = new $Element("#clan_menu_holder")
export const $toggleStoreMenu = new $Element("#toggle_store_menu")
export const $storeMenuHolder = new $Element("#store_menu_holder")

export const lastOpenedElements = new Map()

lastOpenedElements.hideAll = function() {
    this.forEach((element) => {
        element.hide()

        this.delete(element.element.id)
    })
}

export const renderer = new Renderer()
export const camera = new Camera()
export const background = new Background()
export const grid = new Grid()
export const boundings = new Boundings()
export const playersManager = new PlayersManager()
export const entitiesInfo = new EntitiesInfo()
export const objectsManager = new ObjectsManager()
export const particlesManager = new ParticlesManager()
export const animalsManager = new AnimalsManager()
export const textManager = new TextManager()

export const socket = new Socket()

export const leaderboard = new Leaderboard()
export const debugPanel = new DebugPanel()
export const profileCard = new ProfileCard()
export const clanMenu = new ClanMenu()
export const storeMenu = new StoreMenu()
export const itemsInfo = new ItemsInfo()
export const minimap = new Minimap()
export const dayNight = new DayNight()
export const notifications = new Notifications()

export const clanMembers = {
    members: []
}

clanMembers.isMemeber = function(id) {
    return this.members.includes(id) || id === playersManager.player.id
}

export const loadedImages = new Map([
    [ "weapons", {} ],
    [ "icons", {} ],
    [ "hats", {} ],
    [ "animals", {} ]
])
export const loadedSprites = new Map()

export const keys = new Map()

export const needsInit = {
    camera,
    background,
    grid,
    particlesManager,
    playersManager,
    animalsManager,
    objectsManager,
    boundings,
    entitiesInfo,
    textManager,
    dayNight,
    minimap,
    notifications
}