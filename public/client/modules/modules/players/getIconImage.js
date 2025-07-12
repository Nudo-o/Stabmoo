import { loadedImages } from "../../constants.js"

function getIconImage(src) {
    const iconImages = loadedImages.get("icons")

    let iconImage = iconImages[src]

    if (!iconImage) {
        iconImages[src] = {}

        iconImage = iconImages[src]

        iconImage.image = new Image()

        iconImage.image.onload = () => {
            iconImage.isLoaded = true
        }

        iconImage.image.src = `./assets/icons/${src}_icon.png`
    }

    return iconImage
}

export default getIconImage