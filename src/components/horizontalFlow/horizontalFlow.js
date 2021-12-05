import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'

const elementBackroundLayers = document.querySelectorAll('.horizontal-flow__layers .layer')

const mainBackgroundContainer = document.querySelector('.main-background__layers .flow-container')
const horizontalBackgroundContainer = document.querySelector('.horizontal-flow__layers .flow-container')
const horizontalFlowContainer = document.querySelector('.horizontal-flow')

const horizontalFlowScreen = document.querySelector('.horizontal-flow__screen')
const horizontalFlowScreenCoords = getElementCoords(horizontalFlowScreen)
let elementBackgroundWidth = 0

export function horizontalflow(mouse, scroll) {
    if (elementBackgroundWidth !== horizontalFlowScreenCoords.width)  {
        elementBackgroundWidth = horizontalFlowScreenCoords.width
        horizontalFlowContainer.style.height = `${elementBackgroundWidth + window.innerWidth * 2}px` // when innerHeight we will start zooming
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

    if (translate < horizontalFlowScreenCoords.width * 1.1 * 2/3) {  //1.1 its a scale parameter
        [mainBackgroundContainer, horizontalBackgroundContainer].forEach(container => {
            container.style.transform = `translateX(${-translate}px)`
        })
        horizontalBackgroundContainer.style.opacity = ''
        return
    }

    // scale to birds
    const scaleParameter = 0.75 // max scale
    const scaleTranslate = translate - horizontalFlowScreenCoords.width * 1.1 * 2/3
    const scaleTranslateMax = (horizontalFlowScreenCoords.width + window.innerWidth) - (horizontalFlowScreenCoords.width * 1.1 * 2/3)
    const scale = scaleTranslate / scaleTranslateMax * scaleParameter

    const opacityParameter = 1
    const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
    if (translate < horizontalFlowScreenCoords.width + window.innerWidth) {
        horizontalBackgroundContainer.style.transform = 
                        `
                            translateX(${-translate}px) 
                            scale(${1 + scale})
                        `
        horizontalBackgroundContainer.style.opacity = 1 - opacity
        return
    }

    // basic if scrolled more
    horizontalBackgroundContainer.style.transform = 
    `
        translateX(${-(horizontalFlowScreenCoords.width + window.innerWidth)}px) 
        scale(${1 + scaleParameter})
    `
    horizontalBackgroundContainer.style.opacity = 0
}