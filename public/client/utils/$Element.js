class $Element {
    constructor(selector) {
        this.selector = selector

        this.element = document.querySelector(this.selector)
    }

    get text() {
        return this.element.innerText
    }

    set text(value) {
        this.element.innerText = value
    }

    get html() {
        return this.element.innerHTML
    }

    set html(value) {
        this.element.innerHTML = value
    }

    get value() {
        return this.element.value
    }

    set value(value) {
        this.element.value = value
    }

    get src() {
        return this.element.src
    }

    set src(value) {
        this.element.src = value
    }

    get classes() {
        return this.element.classList
    }

    get isHidden() {
        return this.classes.contains("hidden")
    }

    getAll(selector) {
        return [...this.element.querySelectorAll(selector)]
    }

    insert(html, isText = false, position = "beforeend") {
        if (!isText) {
            return this.element.insertAdjacentHTML(position, html)
        }

        this.element.insertAdjacentText(position, html)
    }

    on(event, callback) {
        this.element.addEventListener(event, callback)
    }

    toggle() {
        this[this.isHidden ? "show" : "hide"]()
    }

    show() {
        if (!this.isHidden) return

        this.classes.remove("hidden")
    }

    hide() {
        if (this.isHidden) return

        this.classes.add("hidden")
    }

    setStyles(...props) {
        if (props.length < 2) return

        for (let i = 0; i < props.length; i += 2) {
            this.element.style[props[i]] = props[i + 1]
        }
    }

    focus() {
        this.element.focus()
    }

    append(node) {
        this.element.appendChild(node)
    }

    getAttr(attr) {
        return this.element.getAttribute(attr)
    }

    setAttr(attr, value) {
        this.element.setAttribute(attr, value)
    }

    removeAttr(attr) {
        this.element.removeAttribute(attr)
    }

    query(selector) {
        return new $Element(`${this.selector} > ${selector}`)
    }
}

export default $Element