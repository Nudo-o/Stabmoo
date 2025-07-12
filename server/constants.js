import SocketsManager from "./SocketsManager.js"
import AnimalsManager from "./animals/AnimalsManager.js"
import ClansManager from "./client/clans/ClansManager.js"
import ObjectsManager from "./game_objects/ObjectsManager.js"
import generateResources from "./game_objects/generateResources.js"
import GridArray from "./grid/GridArray.js"

export const gridArray = new GridArray()
export const objectsManager = new ObjectsManager()
export const clansManager = new ClansManager()
export const animalsManager = new AnimalsManager()

generateResources()

export const socketsManager = new SocketsManager()