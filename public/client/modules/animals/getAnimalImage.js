import { loadedImages } from "../../constants.js"

function getAnimalImage(src) {
    const animalImages = loadedImages.get("animals")

    let animalImage = animalImages[src]

    if (!animalImage) {
        animalImages[src] = {}

        animalImage = animalImages[src]

        animalImage.image = new Image()

        animalImage.image.onload = () => {
            animalImage.isLoaded = true
        }

        animalImage.image.src = `./assets/animals/${src}.png`
    }

    return animalImage
}

export default getAnimalImage