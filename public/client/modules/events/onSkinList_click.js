import { $skinList } from "../constants.js"

function onSkinList_click(event) {
    const classList = event.target.classList

    if (classList.contains("active-skin") || !classList.contains("skin-item")) return

    const skinItems = $skinList.getAll(".skin-item")

    for (let i = 0; i < skinItems.length; i++) {
        skinItems[i].classList.remove("active-skin")
    }

    classList.add("active-skin")
}

export default onSkinList_click
