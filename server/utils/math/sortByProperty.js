function sortByProperty(array, property, decreasing = true) {
    return array.sort((a, b) => (decreasing ? a[property] - b[property] : b[property] - a[property]))
}

export default sortByProperty