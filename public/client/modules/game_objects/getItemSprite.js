import { loadedSprites } from "../../constants.js"
import renderBlob from "../../utils/render/renderBlob.js"
import renderCircle from "../../utils/render/renderCircle.js"
import renderLeaf from "../../utils/render/renderLeaf.js"
import renderStar from "../../utils/render/renderStar.js"
import renderTriangle from "../../utils/render/renderTriangle.js"

function getItemSprite(item, asIcon, forceLineWidth) {
    const spriteIndex = `${item.name}${asIcon ? "_icon" : ""}`

    if (!loadedSprites.has(spriteIndex) || asIcon) {
        const spriteCanvas = document.createElement("canvas")
        const spriteScale = (item.scale * (item.spriteScaleMult || 2.5))

        spriteCanvas.width = spriteCanvas.height = spriteScale + item.outlineWidth + (item.spritePadding || 0)

        const spriteContext = spriteCanvas.getContext("2d")

        spriteContext.translate(spriteCanvas.width / 2, spriteCanvas.height / 2)
        spriteContext.rotate(Math.PI / 2)
        spriteContext.strokeStyle = item.outlineColor
        spriteContext.lineWidth = forceLineWidth || item.outlineWidth

        if (/(berry|blueberry)/.test(item.name)) {
            spriteContext.fillStyle = item.colors[0]

            renderCircle(0, 0, item.scale, spriteContext)
            spriteContext.fill()
            spriteContext.stroke()

            /*spriteContext.fillStyle = item.colors[1]

            const leafDir = -(Math.PI / 2)

            renderLeaf(
                item.scale * Math.cos(leafDir), 
                item.scale * Math.sin(leafDir),
                25, leafDir + Math.PI / 2, 
                spriteContext
            )*/
        } else if (/wall/.test(item.name)) {
            spriteContext.fillStyle = item.colors[0]

            renderBlob(spriteContext, item.sides, item.scale, item.scale * .7)
            spriteContext.fill()
            spriteContext.stroke()
            
            spriteContext.fillStyle = item.colors[1]

            renderBlob(spriteContext, item.sides, item.scale / 2, (item.scale / 2) * .7)
            spriteContext.fill()
        } else if (/spike/.test(item.name)) {
            const tmpScale = item.scale * .89

            spriteContext.lineCap = "round"
            spriteContext.lineJoin = "round"
            spriteContext.fillStyle = item.colors[0]

            renderStar(spriteContext, item.spikes, tmpScale * 1.2, tmpScale * 0.6)
            spriteContext.fill()
            spriteContext.stroke()

            spriteContext.fillStyle = item.colors[1]

            renderBlob(spriteContext, item.sides, tmpScale, tmpScale * .7)
            spriteContext.fill()
            spriteContext.stroke()
            
            spriteContext.fillStyle = item.colors[2]

            renderBlob(spriteContext, item.sides, tmpScale / 2, (tmpScale / 2) * .7)
            spriteContext.fill()
        } else if (/windmill/.test(item.name)) {
            spriteContext.fillStyle = item.colors[0]

            renderBlob(spriteContext, item.sides, item.scale * 1.1, item.scale * .8)
            spriteContext.fill()
            spriteContext.stroke()
            
            spriteContext.fillStyle = item.colors[1]

            renderBlob(spriteContext, item.sides, (item.scale / 1.55) * 1.1, (item.scale / 1.55) * .8)
            spriteContext.fill()

            if (asIcon) {
                for (let i = 0; i < item.blades; i++) {
                    const width = item.scale * 1.5
                    const height = item.scale / 2.25

                    spriteContext.fillStyle = item.colors[3]

                    spriteContext.rotate((Math.PI / 2) * i)
                    spriteContext.roundRect(-width, -height / 2, width * 2, height, 8)
                    spriteContext.fill()
                    spriteContext.stroke()
                }

                spriteContext.fillStyle = item.colors[2]

                renderBlob(spriteContext, item.sides - 1, (item.scale / 2) * 1.1, (item.scale / 2) * .8)
                spriteContext.fill()
                spriteContext.stroke()
            }
        } else if (/trap/.test(item.name)) {
            spriteContext.globalAlpha = item.alpha
            
            spriteContext.fillStyle = item.colors[0]

            renderBlob(spriteContext, item.sides, item.scale, item.scale * .75)
            spriteContext.fill()
            spriteContext.stroke()
            
            spriteContext.fillStyle = item.colors[1]

            renderBlob(spriteContext, item.sides, item.scale / 1.55, (item.scale / 1.55) * .75)
            spriteContext.fill()
        } else if (/boost/.test(item.name)) {
            const scale = item.scale * 1.6

            spriteContext.fillStyle = item.colors[0]
            spriteContext.lineCap = "round"
            spriteContext.lineJoin = "round"

            spriteContext.roundRect(-scale / 2, -scale / 2, scale, scale, item.radius)
            spriteContext.fill()
            spriteContext.stroke()

            spriteContext.fillStyle = item.colors[1]

            renderTriangle(item.scale, spriteContext)
            spriteContext.fill()
        }

        loadedSprites.set(spriteIndex, spriteCanvas)
    }

    return loadedSprites.get(spriteIndex)
}

export default getItemSprite