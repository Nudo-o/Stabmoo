function lerpAngle(value1, value2, amount) {
    const lerpX = (1 - amount) * Math.cos(value1) + amount * Math.cos(value2)
    const lerpY = (1 - amount) * Math.sin(value1) + amount * Math.sin(value2)

    return Math.atan2(lerpY, lerpX)
}

export default lerpAngle