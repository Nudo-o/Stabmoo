import randInt from "../../../../server/utils/math/randInt.js"
import { loadedSprites } from "../../constants.js"
import renderBlob from "../../utils/render/renderBlob.js"
import renderCircle from "../../utils/render/renderCircle.js"
import renderStar from "../../utils/render/renderStar.js"

function getResourceSprite(object) {
    const biomeID = 0
    const spriteIndex = `${object.type}_${object.scale}_${biomeID}`

    if (!loadedSprites.has(spriteIndex)) {
        object = JSON.parse(JSON.stringify(object))

        const spriteCanvas = document.createElement("canvas")

        spriteCanvas.width = spriteCanvas.height = (object.scale * 2.1) + object.data.outlineWidth

        const spriteContext = spriteCanvas.getContext("2d")
        const colors = object.data.colors[biomeID]

        spriteContext.translate(spriteCanvas.width / 2, spriteCanvas.height / 2)
        spriteContext.strokeStyle = object.data.outlineColor
        spriteContext.lineWidth = object.data.outlineWidth

        if (object.type === 0) {
            for (let i = 0; i < object.data.layers; ++i) {
                const scale = object.scale * object.data.divScales[i]

                renderBlob(spriteContext, object.data.spikes - i, scale, scale * .7)

                spriteContext.fillStyle = colors[i]

                spriteContext.fill()

                !i && spriteContext.stroke()
            }
        } else if (object.type === 1 || object.type === 2) {
            for (let i = 0; i < object.data.layers; i++) {
                const scale = object.scale * 1.25 * object.data.divScales[i]

                spriteContext.fillStyle = colors[i]

                renderBlob(spriteContext, object.data.spikes, scale, scale * .7)

                spriteContext.fill()
               
                !i && spriteContext.stroke()
            }
        } else if (object.type === 3 || object.type === 4) {
            spriteContext.fillStyle = colors[0]

            renderBlob(spriteContext, object.data.spikes, object.scale * 1.1, object.scale * .75)
            spriteContext.fill()
            spriteContext.stroke()
        }

        /*var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = spriteCanvas.toDataURL()
        link.click();*/

        loadedSprites.set(spriteIndex, spriteCanvas)
    }

    return loadedSprites.get(spriteIndex)
}

export default getResourceSprite