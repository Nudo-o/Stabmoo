
function isFocusOnInput() {
    const isInput = document.activeElement.tagName === "INPUT"
    const isText = document.activeElement.type === "text"

    return isInput && isText
}

export default isFocusOnInput