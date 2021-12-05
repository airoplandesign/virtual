import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'

const timeLapsContainer = document.querySelector('.time-laps')

const zoomedBirdsContainer = document.querySelector('.time-laps #zoomedBirds')
const birdsFromTopContainer = document.querySelector('.time-laps #birdsFromTop')
const platformViewContainer = document.querySelector('.time-laps #platformView')

const zoomedBirdsSkyContainer = document.querySelector('.time-laps #zoomedBirds #sky .img')
const zoomedBirdsBirdsContainer = document.querySelector('.time-laps #zoomedBirds #birds .img')


const allLayers = [
    Array.from(zoomedBirdsContainer.querySelectorAll('.layer')),
    Array.from(birdsFromTopContainer.querySelectorAll('.layer')),
    Array.from(platformViewContainer.querySelectorAll('.layer'))
]

export function timeLaps(mouse, scroll) {
    allLayers.forEach(layersGroup => {
        layersGroup.forEach((layer, idx) => {
            if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx / 4))
            setScrollParallax(layer, scroll, (1 + idx / 5))
        })
    })

    if (!isElementVisible(timeLapsContainer)) return
    const timeLapsContainerCoords = getElementCoords(timeLapsContainer)
    const translate = window.pageYOffset - timeLapsContainerCoords.top
    const translateMax = timeLapsContainerCoords.height
    
    zoomedBirdsContainer.style.opacity = ''
    
    if (translate < 0) return

    const iterationTimelineMax = translateMax * 1/3
    const iterationHalf = iterationTimelineMax / 2

    
    // zoomedBirds animation
    if (translate < iterationTimelineMax) {
        const scaleTranslate = translate
        const opacityParameter = 1
        const scaleSkyParameter = 3.5
        const scaleBirdsParameter = 1

        const scaleSky = scaleTranslate / iterationTimelineMax * scaleSkyParameter
        const scaleBirds = scaleTranslate / iterationTimelineMax * scaleBirdsParameter

        zoomedBirdsSkyContainer.style.transform = `translateX(${-translate}px) scale(${1 + scaleSky})`
        zoomedBirdsBirdsContainer.style.transform = `scale(${.5 + scaleBirds})`

        if (translate < iterationHalf) {
            const scaleTranslateMax = iterationHalf / 3
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            zoomedBirdsContainer.style.opacity = 0 + opacity
        }


        return
    }
    

}