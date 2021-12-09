import { setMouseParallax, setScrollParallax, getElementCoords, isElementVisible} from '../../functions'
import gsap from 'gsap'

const timeLapsContainer = document.querySelector('.time-laps')

const zoomedBirdsContainer = document.querySelector('.time-laps #zoomedBirds')
const birdsFromTopContainer = document.querySelector('.time-laps #birdsFromTop')
const platformViewContainer = document.querySelector('.time-laps #platformView')

const zoomedBirdsSkyContainer = document.querySelector('.time-laps #zoomedBirds #sky .img')
const zoomedBirdsBirdsContainer = document.querySelector('.time-laps #zoomedBirds #birds .img')

const birdsFromTopIceContainer = document.querySelector('.time-laps #birdsFromTop #ice .img')
const birdsFromTopBirdsContainer = document.querySelector('.time-laps #birdsFromTop #birdsTop .img')
const birdsFromTopWhaliesContainer = document.querySelector('.time-laps #birdsFromTop #whalies .img')

const platformMenuContainer = document.querySelector('.platform-menu')

const allLayers = [
    Array.from(zoomedBirdsContainer.querySelectorAll('.layer')),
    Array.from(birdsFromTopContainer.querySelectorAll('.layer')),
    Array.from(platformViewContainer.querySelectorAll('.layer'))
]

let timelines = []
allLayers.forEach((layersGroup, idx) => {
    timelines[idx] = []
    layersGroup.forEach(() => {
        timelines[idx].push(gsap.timeline())
    })
})

export function timeLaps(mouse, scroll, swipeDuration) {
    allLayers.forEach((layersGroup, i) => {
        layersGroup.forEach((layer, idx) => {
            if (!scroll.scrolling) setMouseParallax(layer, mouse, (1 + idx))
            setScrollParallax(layer, scroll, timelines[i][idx], idx * 10 + idx * 2, swipeDuration)
        })
    })

    if (!isElementVisible(timeLapsContainer)) return
    const timeLapsContainerCoords = getElementCoords(timeLapsContainer)
    const translate = window.pageYOffset - timeLapsContainerCoords.top
    const translateMax = timeLapsContainerCoords.height 
    
    const bgZoomCoef = 0.75
    birdsFromTopIceContainer.style.transform = `scale(${1 + bgZoomCoef})`
    birdsFromTopIceContainer.style.opacity = ''
    birdsFromTopWhaliesContainer.style.opacity = ''
    birdsFromTopContainer.style.opacity = ''
    zoomedBirdsContainer.style.opacity = ''

    birdsFromTopWhaliesContainer.style.transform = ``

    platformViewContainer.style.transform = `scale(${1 + bgZoomCoef})`
    platformViewContainer.style.opacity = ''

    
    if (translate < 0) return

    const iterationTimelineMax1 = translateMax * 1/3
    const iterationHalf1 = iterationTimelineMax1 / 2

    const iterationTimelineMax2 = translateMax * 2/3
    const iterationTimelineMax3 = translateMax
    
    
    // zoomedBirds animation
    if (translate < iterationTimelineMax1) {
        const scaleTranslate = translate
        const opacityParameter = 1
        const scaleSkyParameter = 3.5
        const scaleBirdsParameter = 1

        const scaleSky = scaleTranslate / iterationTimelineMax1 * scaleSkyParameter
        const scaleBirds = scaleTranslate / iterationTimelineMax1 * scaleBirdsParameter

        zoomedBirdsSkyContainer.style.transform = `scale(${1 + scaleSky})`
        zoomedBirdsBirdsContainer.style.transform = `scale(${.5 + scaleBirds})`

        // appearing canvas
        if (translate < iterationHalf1) {
            const scaleTranslateMax = iterationHalf1 / 3
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            zoomedBirdsContainer.style.opacity = 0 + opacity
            return
        }

        // disappearing canvas
        if (translate < iterationTimelineMax1) {
            const scaleTranslateMax = iterationTimelineMax1
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            zoomedBirdsContainer.style.opacity = 1 - opacity
            return
        }
        return
    }

    // birdsFromTop animation
    if (translate < iterationTimelineMax2) {
        let scaleTranslate = translate - iterationTimelineMax1
        const opacityParameter = 1

        // appearing birds
        if (scaleTranslate < iterationHalf1 / 3) {
            const scaleTranslateMax = iterationHalf1 / 3
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            birdsFromTopContainer.style.opacity = 0 + opacity
            return
        }
        birdsFromTopContainer.style.opacity = 1

        // appearing bg
        scaleTranslate = scaleTranslate - iterationHalf1 / 3
        if (scaleTranslate < iterationHalf1 / 2) {
            const scaleTranslateMax = iterationHalf1 / 2
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            birdsFromTopIceContainer.style.opacity = 0 + opacity
            birdsFromTopWhaliesContainer.style.opacity = 0 + opacity
            return
        }
        birdsFromTopIceContainer.style.opacity = 1
        birdsFromTopWhaliesContainer.style.opacity = 1


        birdsFromTopIceContainer.style.transform = ``
        // birdsFromTopBirdsContainer.style.transform = ``
        // zooming out
        scaleTranslate = scaleTranslate - iterationHalf1 / 2
        if (scaleTranslate < iterationHalf1) {
            const scaleTranslateMax = iterationHalf1
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            const zoomOutBg = scaleTranslate / scaleTranslateMax * bgZoomCoef
            const zoomOut = scaleTranslate / scaleTranslateMax * 0.5

            birdsFromTopContainer.style.opacity = 1 - opacity
            birdsFromTopIceContainer.style.transform = `scale(${1 + bgZoomCoef - zoomOutBg})`
            birdsFromTopWhaliesContainer.style.transform = `scale(${1 - zoomOut})`
            // birdsFromTopBirdsContainer.style.transform = `scale(${1 - zoomOut})`
            return
        }
        birdsFromTopIceContainer.style.transform = `scale(1)`
        birdsFromTopWhaliesContainer.style.transform = `scale(${1 - 0.5})`
        // birdsFromTopBirdsContainer.style.transform = `scale(${1 - 0.5})`
        birdsFromTopContainer.style.opacity = 0
        birdsFromTopIceContainer.style.opacity = 0
        birdsFromTopWhaliesContainer.style.opacity = 0
        return
    }

    // platformView animation
    if (translate < iterationTimelineMax3) {
        let scaleTranslate = translate - iterationTimelineMax2
        const opacityParameter = 1


        if (scaleTranslate < iterationHalf1 / 2) {
            const scaleTranslateMax = iterationHalf1 / 2
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter
            const zoomOutBg = scaleTranslate / scaleTranslateMax * bgZoomCoef

            platformViewContainer.style.transform = `scale(${1 + bgZoomCoef - zoomOutBg})`
            platformViewContainer.style.opacity = 0 + opacity
            return
        }
        platformViewContainer.style.opacity = 1
        platformViewContainer.style.transform = `scale(1)`

        scaleTranslate = scaleTranslate - iterationHalf1 / 2
        if (scaleTranslate < iterationHalf1) {
            const scaleTranslateMax = iterationHalf1
            const opacity = scaleTranslate / scaleTranslateMax * opacityParameter

            platformViewContainer.style.opacity = 1 - opacity
            return
        }
        platformViewContainer.style.opacity = 0
        
        return
    }
}