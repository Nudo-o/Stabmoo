function renderStar(ctxt, spikes, outer, inner) {
    const step = Math.PI / spikes

    let rot = Math.PI / 2 * 3
    let x = 0
    let y = 0

    ctxt.beginPath()
    ctxt.moveTo(0, -outer)

    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outer
        y = Math.sin(rot) * outer

        ctxt.lineTo(x, y)

        rot += step
        
        x = Math.cos(rot) * inner
        y = Math.sin(rot) * inner

        ctxt.lineTo(x, y)

        rot += step
    }

    ctxt.lineTo(0, -outer)
    ctxt.closePath()
}

export default renderStar