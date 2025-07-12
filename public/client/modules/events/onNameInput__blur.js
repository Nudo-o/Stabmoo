function onNameInput_blur(event) {
    localStorage.setItem("oldmoo_name", event.target.value)
}

export default onNameInput_blur