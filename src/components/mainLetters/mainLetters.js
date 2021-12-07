import { setMouseParallax, setScrollParallax } from '../../functions'

const main = document.querySelector('#main')
const elementToWatch = document.querySelector('#mainLetters')
const elementBackgroundWrapper = document.querySelector('#mainBackground')
let elementBackgroundHeight = 0, elementToWatchHeight = 0

const elementBackroundLayers = document.querySelectorAll('.main-background__layers .layer')

const elementToBlurMorz = document.querySelectorAll('.layer.morz .img')
const elementToBlurBear = document.querySelectorAll('.layer.bear .img')

export function mainLetters(mouse, scroll) {
    if (elementBackgroundHeight !== elementBackgroundWrapper.getBoundingClientRect().height
        || elementToWatchHeight !== elementToWatch.getBoundingClientRect().height)  {
        elementBackgroundHeight = elementBackgroundWrapper.getBoundingClientRect().height
        elementToWatchHeight = elementToWatch.getBoundingClientRect().height
        main.style.height = `${elementBackgroundHeight + elementToWatchHeight}px`
    }

    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx / 4))
        setScrollParallax(layer, scroll, (1 + idx / 5))
    })

    // morz blur
    if (window.pageYOffset >= elementToWatchHeight) {
        elementToBlurMorz[1].classList.remove('hide')
    } else {
        elementToBlurMorz[1].classList.add('hide')
    }
}

