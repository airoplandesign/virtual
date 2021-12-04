import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'

const elementBackroundLayers = document.querySelectorAll('.horizontal-flow__layers .layer')

const mainBackgroundContainer = document.querySelector('.main-background__layers .flow-container')
const horizontalBackgroundContainer = document.querySelector('.horizontal-flow__layers .flow-container')
const horizontalFlowContainer = document.querySelector('.horizontal-flow')

const horizontalFlowScreen = document.querySelector('.horizontal-flow__screen')
let elementBackgroundWidth = 0

export function horizontalflow(mouse, scroll) {
    if (elementBackgroundWidth !== horizontalFlowScreen.getBoundingClientRect().width)  {
        elementBackgroundWidth = horizontalFlowScreen.getBoundingClientRect().width
        horizontalFlowContainer.style.height = `${elementBackgroundWidth}px`
    }

    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx / 4))
        setScrollParallax(layer, scroll, (1 + idx / 5))
    })

    // horizontal scroll
    if (!isElementVisible(horizontalFlowContainer)) return
    const translate = window.pageYOffset - getElementCoords(horizontalFlowContainer).top
    console.log(translate)
    if (translate < 0) {
        [mainBackgroundContainer, horizontalBackgroundContainer].forEach(container => {
            container.style.transform = ``
        })
        return
    }
    [mainBackgroundContainer, horizontalBackgroundContainer].forEach(container => {
        container.style.transform = `translateX(${-translate}px)`
    })
}