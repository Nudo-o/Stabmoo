function lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount
    amount = amount > 1 ? 1 : amount

    return value1 + (value2 - value1) * amount
}

export default lerp