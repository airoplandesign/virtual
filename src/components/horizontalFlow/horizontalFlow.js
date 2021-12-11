import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'
import gsap from 'gsap'

const elementBackroundLayers = document.querySelectorAll('.horizontal-flow__layers .layer')

const mainBackgroundContainer = document.querySelector('.main-background__layers .flow-container')
const horizontalBackgroundContainer = document.querySelector('.horizontal-flow__layers .flow-container')
const horizontalFlowContainer = document.querySelector('.horizontal-flow')

const horizontalFlowScreen = document.querySelector('.horizontal-flow__screen')
const scalabelContainer = document.querySelector('.horizontal-flow__screen .scalabel-container')
let elementBackgroundWidth = 0

let timelines = []
Array.from(elementBackroundLayers).forEach(() => {
    timelines.push(gsap.timeline())
})

export function horizontalflow(mouse, scroll, swipeDuration) {
    if (elementBackgroundWidth !== horizontalFlowScreen.getBoundingClientRect().width)  {
        elementBackgroundWidth = horizontalFlowScreen.getBoundingClientRect().width
        horizontalFlowContainer.style.height = `${elementBackgroundWidth + window.innerWidth}px` // when innerHeight we will start zooming
    }

    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx))
        setScrollParallax(layer, scroll, timelines[idx], idx * 20 + idx * 2, swipeDuration)
    })

    // horizontal scroll
    if (!isElementVisible(horizontalFlowContainer)) return
    const translate = window.pageYOffset - getElementCoords(horizontalFlowContainer).top
    if (translate < 0) {
        [mainBackgroundContainer, horizontalBackgroundContainer].forEach(container => {
            container.style.transform = ``
        })
        return
    }


    const delta = elementBackgroundWidth / 3 - window.innerWidth
    let step = elementBackgroundWidth / 3
    // if (step < window.innerWidth) step = window.innerWidth
    if ((window.innerWidth / window.innerHeight < 16/9) && step < window.innerWidth) step = window.innerWidth

    const specialHorizontalBackgroundWidth = 2 * step + delta

    if (translate < specialHorizontalBackgroundWidth) {
        [mainBackgroundContainer, horizontalBackgroundContainer].forEach(container => {
            container.style.transform = `translateX(${-translate}px)`
        })
        horizontalBackgroundContainer.style.opacity = ''
        scalabelContainer.style.transform = ''
        // scalabelContainer.style.opacity = ''
        return
    }

    // scale to birds
    const scaleParameter = 1.5 // max scale
    let scaleTranslate = translate - specialHorizontalBackgroundWidth
    let scaleTranslateMax = window.innerWidth
    const scale = scaleTranslate / scaleTranslateMax * scaleParameter

    const opacityParameter = 1
    const opacity = scaleTranslate / (scaleTranslateMax * 0.8) * opacityParameter

    if (scale < 0) return
    if (scaleTranslate < scaleTranslateMax) {
        // Array.from(elementBackroundLayers).forEach(layer => layer.style.opacity = 1 - opacity)
        horizontalBackgroundContainer.style.opacity = 1 - opacity
        // if (scaleTranslate - window.innerHeight < 0) scaleTranslate = 1 + window.innerHeight
        scalabelContainer.style.transform = 
                        `
                            translate(${-(scaleTranslate * 1.55)}px, ${(scaleTranslate / 2.5 / (elementBackgroundWidth / window.innerHeight))}px)
                            scale(${1 + scale})
                        `
        horizontalBackgroundContainer.style.transform = 
                        `
                            translateX(${-(specialHorizontalBackgroundWidth)}px) 
                        `
        // scalabelContainer.style.opacity = 1 - opacity
    return
    }
    // scaleTranslate = scaleTranslate - specialHorizontalBackgroundWidth * 0.7
    // scaleTranslateMax = specialHorizontalBackgroundWidth * 0.3
    // opacity = scaleTranslate / scaleTranslateMax * opacityParameter

    // if (scaleTranslate > 0 && scaleTranslate < scaleTranslateMax) {
    //     scalabelContainer.style.opacity = 1 - opacity
    //     return
    // }

    // basic if scrolled more
    horizontalBackgroundContainer.style.transform = 
    `
        translateX(${-(specialHorizontalBackgroundWidth)}px) 
    `
    horizontalBackgroundContainer.style.opacity = 0
    // Array.from(elementBackroundLayers).forEach(layer => layer.style.opacity = 0)
    scalabelContainer.style.transform = 
    `
        translate(${-(scaleTranslateMax * 1.55)}px, ${(scaleTranslateMax / 2.5 / (elementBackgroundWidth / window.innerHeight))}px)
        scale(${2.5})
    `
    // scalabelContainer.style.opacity = 0
}