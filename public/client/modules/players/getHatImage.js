import { loadedImages } from "../../constants.js"

function getHatImage(src) {
    const hatImages = loadedImages.get("hats")

    let hatImage = hatImages[src]

    if (!hatImage) {
        hatImages[src] = {}

        hatImage = hatImages[src]

        hatImage.image = new Image()

        hatImage.image.onload = () => {
            hatImage.isLoaded = true
        }

        hatImage.image.src = `./assets/hats/${src}_hat.png`
    }

    return hatImage
}

export default getHatImage