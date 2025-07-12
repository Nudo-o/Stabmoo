import getAnimalImage from "./getAnimalImage.js"

class SpriteAnimation {
    constructor(sprites, reverseSpriteAnim, spriteFrameSpeed, manualSprites) {
        this.sprites = sprites
        this.reverseSpriteAnim = reverseSpriteAnim
        this.spriteFrameSpeed = spriteFrameSpeed
        this.manualSprites = manualSprites

        this.currentImage = null
        this.spriteIndex = 0
        this.aspriteReverse = false
        this.spriteTime = null
    }

    setSprite(index) {
        this.spriteIndex = index
    }

    update() {
        if (this.manualSprites) {
            this.currentImage = getAnimalImage(this.sprites[this.spriteIndex])

            return
        }

        let imageSrc = null

        if (this.reverseSpriteAnim) {
            if (this.spriteIndex >= this.sprites.length - 1) {
                this.spriteReverse = true
            } else if (this.spriteIndex < 1) {
                this.spriteReverse = false
            }
        } else {
            this.spriteReverse = false

            if (this.spriteIndex >= this.sprites.length) {
                this.spriteIndex = 0
            }
        }
        
        imageSrc = this.sprites[this.spriteIndex]

        if (!this.spriteTime || Date.now() - this.spriteTime >= this.spriteFrameSpeed) {
            this.spriteIndex += this.spriteReverse ? -1 : 1

            this.spriteTime = Date.now()
        }

        this.currentImage = getAnimalImage(imageSrc)
    }
}

export default SpriteAnimation