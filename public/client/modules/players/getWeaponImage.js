import { loadedImages } from "../../constants.js"

function getWeaponImage(weapon) {
    const weaponsImages = loadedImages.get("weapons")

    let weaponImage = weaponsImages[weapon.src]

    if (!weaponImage) {
        weaponsImages[weapon.src] = {}

        weaponImage = weaponsImages[weapon.src]

        weaponImage.image = new Image()

        weaponImage.image.onload = () => {
            weaponImage.isLoaded = true
        }

        weaponImage.image.src = `./assets/weapons/${weapon.src}.png`
    }

    return weaponImage
}

export default getWeaponImage