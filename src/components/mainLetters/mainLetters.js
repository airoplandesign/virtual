const main = document.querySelector('#main')
const elementToWatch_DOM = document.querySelector('#mainLetters')
const elementBackground_DOM = document.querySelector('#mainBackground')
let elementBackgroundHeight = 0, elementToWatchHeight = 0

export function mainLetters() {
    if (elementBackgroundHeight !== elementBackground_DOM.getBoundingClientRect().height
        || elementToWatchHeight !== elementToWatch_DOM.getBoundingClientRect().height)  {
        elementBackgroundHeight = elementBackground_DOM.getBoundingClientRect().height
        elementToWatchHeight = elementToWatch_DOM.getBoundingClientRect().height
        main.style.height = `${elementBackgroundHeight + elementToWatchHeight}px`
    }
}

