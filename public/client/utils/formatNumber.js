function formatNumber(value, max = 1e3) {
    const design = ["k", "m", "b", "t", "q"]

    if (value === Number.POSITIVE_INFINITY) {
        return "Infinity"
    } else if (value >= 1e18 && max <= 1e18) {
        return value.toExponential(2).replace(/\+/g, "");
    } else if (value >= 1e15 && max <= 1e15) {
        return (value / 1e15).toFixed(1) + design[4]
    } else if (value >= 1e12 && max <= 1e12) {
        return (value / 1e12).toFixed(1) + design[3]
    } else if (value >= 1e9 && max <= 1e9) {
        return (value / 1e9).toFixed(1) + design[2]
    } else if (value >= 1e6 && max <= 1e6) {
        return (value / 1e6).toFixed(1) + design[1]
    } else if (value >= 1e3 && max <= 1e3) {
        return (value / 1e3).toFixed(1) + design[0]
    } else {
        return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
    }
}

export default formatNumber