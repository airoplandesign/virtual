import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'

const elementBackroundLayers = document.querySelectorAll('.horizontal-flow__layers .layer')

const mainBackgroundContainer = document.querySelector('.main-background__layers .flow-container')
const horizontalBackgroundContainer = document.querySelector('.horizontal-flow__layers .flow-container')
const horizontalFlowContainer = document.querySelector('.horizontal-flow')

const horizontalFlowScreen = document.querySelector('.horizontal-flow__screen')
const scalabelContainer = document.querySelector('.horizontal-flow__screen .scalabel-container')
let elementBackgroundWidth = 0

export function horizontalflow(mouse, scroll) {
    if (elementBackgroundWidth !== horizontalFlowScreen.getBoundingClientRect().width)  {
        elementBackgroundWidth = horizontalFlowScreen.getBoundingClientRect().width
        horizontalFlowContainer.style.height = `${elementBackgroundWidth + window.innerWidth}px` // when innerHeight we will start zooming
    }

    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx / 4))
        setScrollParallax(layer, scroll, (1 + idx / 5))
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


    if (translate < elementBackgroundWidth) {
        [mainBackgroundContainer, horizontalBackgroundContainer].forEach(container => {
            container.style.transform = `translateX(${-translate}px)`
        })
        horizontalBackgroundContainer.style.opacity = ''
        scalabelContainer.style.transform = ''
        return
    }

    // scale to birds
    const scaleParameter = 1 // max scale
    let scaleTranslate = translate - elementBackgroundWidth
    const scaleTranslateMax = window.innerWidth
    const scale = scaleTranslate / scaleTranslateMax * scaleParameter

    const opacityParameter = 1
    const opacity = scaleTranslate / (scaleTranslateMax / 1.25) * opacityParameter

    if (scale < 0) return
    if (scaleTranslate < elementBackgroundWidth + window.innerWidth) {
        horizontalBackgroundContainer.style.opacity = 1 - opacity
        // if (scaleTranslate - window.innerHeight < 0) scaleTranslate = 1 + window.innerHeight
        scalabelContainer.style.transform = 
                        `
                            translateX(${-(scaleTranslate)}px) 
                            scale(${1 + scale})
                        `
    horizontalBackgroundContainer.style.transform = 
    `
        translateX(${-(elementBackgroundWidth + window.innerWidth)}px) 
    `
    return
    }

    // basic if scrolled more
    horizontalBackgroundContainer.style.transform = 
    `
        translateX(${-(elementBackgroundWidth - window.innerWidth)}px) 
    `
    horizontalBackgroundContainer.style.opacity = 0
}