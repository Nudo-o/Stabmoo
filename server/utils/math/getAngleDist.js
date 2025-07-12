function getAngleDist(a, b) {
    const p = Math.abs(b - a) % (Math.PI * 2)

    return (p > Math.PI ? (Math.PI * 2) - p : p)
}

export default getAngleDist