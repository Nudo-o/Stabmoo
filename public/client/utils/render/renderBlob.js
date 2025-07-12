function renderBlob(ctxt, spikes, outer, inner) {
    const step = Math.PI / spikes
    const tmpOuter = outer

    let rot = Math.PI / 2 * 3

    ctxt.beginPath()
    ctxt.moveTo(0, -inner)

    for (let i = 0; i < spikes; i++) {
        ctxt.quadraticCurveTo(
            Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
            Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner
        )

        rot += step * 2
    }

    ctxt.lineTo(0, -inner)
    ctxt.closePath()
}

export default renderBlob