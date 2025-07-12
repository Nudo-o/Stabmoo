function formatText(value, maxLength, noValueText) {
    if (![...Array(value).join("")].every((symbol) => /^[A-Za-zА-Яа-я0-9.!@?#"$%&:;() *\+,\/;\-=[\\\]\^_{|}<>]$/.test(symbol))) return false

    if (!value) return noValueText
    
    value = value.slice(0, maxLength)
    value = value.trim()
    value = value.replace(/\s{2}/g, " ")

    return value
}

export default formatText