import { setMouseParallax, setScrollParallax } from '../../functions'

const main = document.querySelector('#main')
const elementToWatch = document.querySelector('#mainLetters')
const elementBackgroundWrapper = document.querySelector('#mainBackground')
let elementBackgroundHeight = 0, elementToWatchHeight = 0

const elementBackroundLayers = document.querySelectorAll('.main-background__layers .layer')

const elementToBlur = document.querySelectorAll('.layer img')

export function mainLetters(mouse, scroll) {
    if (elementBackgroundHeight !== elementBackgroundWrapper.getBoundingClientRect().height
        || elementToWatchHeight !== elementToWatch.getBoundingClientRect().height)  {
        elementBackgroundHeight = elementBackgroundWrapper.getBoundingClientRect().height
        elementToWatchHeight = elementToWatch.getBoundingClientRect().height
        main.style.height = `${elementBackgroundHeight + elementToWatchHeight * 1.5}px`
    }

    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx / 4))
        setScrollParallax(layer, scroll, (1 + idx / 5))
    })

    console.log(window.pageYOffset, elementToWatchHeight)
    if (window.pageYOffset >= elementToWatchHeight) {
        elementToBlur[1].classList.remove('hide')
    } else {
        elementToBlur[1].classList.add('hide')
    }
}

