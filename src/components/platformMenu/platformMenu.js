import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'
import gsap from 'gsap'

const platformMenuContainer = document.querySelector('.platform-menu')
const elementBackroundLayers = document.querySelectorAll('.platform-menu__background .layer')

let timelines = []
Array.from(elementBackroundLayers).forEach(() => {
    timelines.push(gsap.timeline())
})

export function platformMenu(mouse, scroll, swipeDuration) {
    Array.from(elementBackroundLayers).forEach((layer, idx) => {
        if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx))
        setScrollParallax(layer, scroll, timelines[idx], idx * 10 + idx * 2, swipeDuration)
    })

    if (!isElementVisible(platformMenuContainer)) return

    const platformMenuContainerCoords = getElementCoords(platformMenuContainer)
    const translate = window.pageYOffset - platformMenuContainerCoords.top
    const translateMax = platformMenuContainerCoords.height // if u make container bigger u get slower animation


    if (translate < 0) return

    if (translate <= translateMax / 3) {
        platformMenuContainer.style.opacity = 0
        return
    }

    const opacityParameter = 1
    // appear of platform-menu
    if (translate < translateMax / 2) {
        const opacity = translate / (translateMax / 2) * opacityParameter
    
        // console.log(opacity)
        platformMenuContainer.style.opacity = 0 + opacity
        if (platformMenuContainer.classList.contains('visible')) {
            platformMenuContainer.classList.remove('visible')
            document.querySelector('.root').classList.add('sound-off')
        }
        return
    }

    if (!platformMenuContainer.classList.contains('visible')) { 
        document.querySelector('.root').classList.remove('sound-on')
        document.querySelector('.root').classList.remove('sound-off')
        platformMenuContainer.classList.add('visible') 
    }
    platformMenuContainer.style.opacity = 1
    
}