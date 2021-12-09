import { setMouseParallax, setScrollParallax } from '../../functions'
import gsap from 'gsap'

const main = document.querySelector('#main')
const elementToWatch = document.querySelector('#mainLetters')
const elementBackgroundWrapper = document.querySelector('#mainBackground')
let elementBackgroundHeight = 0, elementToWatchHeight = 0

const elementBackroundLayers = document.querySelectorAll('.main-background__layers .layer')

const elementToBlurMorz = document.querySelectorAll('.layer.morz .img')
const elementToBlurBear = document.querySelectorAll('.layer.bear .img')

let timelines = []
Array.from(elementBackroundLayers).forEach(() => {
    timelines.push(gsap.timeline())
})

export function mainLetters(mouse, scroll, swipeDuration) {
    if (elementBackgroundHeight !== elementBackgroundWrapper.getBoundingClientRect().height
        || elementToWatchHeight !== elementToWatch.getBoundingClientRect().height)  {
        elementBackgroundHeight = elementBackgroundWrapper.getBoundingClientRect().height
        elementToWatchHeight = elementToWatch.getBoundingClientRect().height
        main.style.height = `${elementBackgroundHeight + elementToWatchHeight}px`
    }

    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx))
        setScrollParallax(layer, scroll, timelines[idx], idx * 10 + idx * 2, swipeDuration)
    })

    // morz blur
    // if (window.pageYOffset >= elementToWatchHeight) {
    //     elementToBlurMorz[1].classList.remove('hide')
    //     elementToBlurMorz[0].classList.add('hide')
    // } else {
    //     elementToBlurMorz[1].classList.add('hide')
    //     elementToBlurMorz[0].classList.remove('hide')
    // }
}

