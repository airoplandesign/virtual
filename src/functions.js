export const getElementCoords = (domElement) => {
    return {
        top: domElement.getBoundingClientRect().top + window.pageYOffset,
        bottom: domElement.getBoundingClientRect().bottom + window.pageYOffset,
        left: domElement.getBoundingClientRect().left + window.pageXOffset,
        right: domElement.getBoundingClientRect().right + window.pageXOffset,
        height: domElement.getBoundingClientRect().height,
        width: domElement.getBoundingClientRect().width,
    }
}

export const isElementVisible = (domElement) => {
    const domElementCoords = getElementCoords(domElement)
    return domElementCoords.bottom >= window.pageYOffset && domElementCoords.top <= window.pageYOffset + window.innerHeight
}

export const setMouseParallax = (domElement, mouse, translateCoef = 1) => {
    if (!isElementVisible(domElement)) return
    const EASE_COEF = 0.05
    const translateX = (window.innerWidth / 2 - mouse.x) / 70 * translateCoef 
    const translateY = (window.innerHeight / 2 - mouse.y) / 70 * translateCoef
    let newTranslateX = domElement.style.transform.split(', ')[0]
    let newTranslateY = domElement.style.transform.split(', ')[1]
    newTranslateX = newTranslateX ? parseFloat(newTranslateX.replace('translate(', '').replace('%', '')) : 0 
    newTranslateY = newTranslateY ? parseFloat(newTranslateY.replace('%)', '')) : 0 
    
    newTranslateX += (translateX - newTranslateX) * EASE_COEF
    newTranslateY += (translateY - newTranslateY) * EASE_COEF

    if (Math.abs(translateX - newTranslateX) < EASE_COEF) {
        newTranslateX = translateX
    }
    if (Math.abs(translateY - newTranslateY) < EASE_COEF) {
        newTranslateY = translateY
    }
    domElement.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(1.1)`
}

export const setScrollParallax = (domElement, { scrolling, parallax }, timeline, translateCoef = 0, swipeDuration) => {
    if (!isElementVisible(domElement)) { 
        domElement.classList.remove('visible')   
        return
    }
    if (!scrolling) return
    if (!parallax) return

    if (!domElement.classList.contains('visible')) domElement.classList.add('visible')   
    const maxTranslate = { y: 50 + translateCoef }

    let translateY = domElement.style.transform.split(', ')[1]
    translateY = translateY ? parseFloat(translateY.replace('%)', '')) : 0 
    let translateX = domElement.style.transform.split(', ')[0]
    translateX = translateX ? parseFloat(translateX.replace('translate(', '').replace('%', '')) : 0 

    let newTranslateY = translateY

    timeline.to({y: translateY}, { y: maxTranslate.y,
            onUpdate() {
                newTranslateY = timeline.getChildren()[0].targets()[0].y
                domElement.style.transform = `translate(${translateX}px, ${newTranslateY}px) scale(1.1)`
            },
            ease: "power3.inOut",
            duration: swipeDuration / 1000 / 2
            }, '<')
    timeline.to({y: maxTranslate.y}, { y: translateY,
            onUpdate() {
                newTranslateY = timeline.getChildren()[1].targets()[0].y
                domElement.style.transform = `translate(${translateX}px, ${newTranslateY}px) scale(1.1)`
            },
            onComplete() {
                timeline.clear()
            },
            ease: "power3.inOut",
            duration: swipeDuration / 1000 / 2
        }, '>');
}

// used only 1 time in index.js
export function createScreensHeight() {
    const screen1Container = document.querySelector('#main #mainLetters') 
    const screen2Container = document.querySelector('#main #mainBackground') 
    const elementToWatch = document.querySelector('#mainLetters') // this parameter is used in mainLettrs.js in container height creation
    const screen3Container = document.querySelector('#horizontalFlow') 
    const screen4Container = document.querySelector('#timeLaps') 
    const screen5Container = document.querySelector('#platformMenu') 

    // for long horizontal screen. It took me 3 hours to understand algorithm...
    // [2 -> 3 -> 4]
    const delta = screen3Container.getBoundingClientRect().width / 3 - window.innerWidth
    let step = screen3Container.getBoundingClientRect().width / 3
    if (step < window.innerWidth) step = window.innerWidth
    // 
    // [4 -> 5 -> 6 -> 7] 
    const half = screen4Container.getBoundingClientRect().height / 3 / 2
    const step2 = screen4Container.getBoundingClientRect().height / 3

    return [
        0, //0
        Math.floor(screen1Container.getBoundingClientRect().height), //1 [0 -> 1]
        Math.floor(screen2Container.getBoundingClientRect().height - window.innerHeight), //2  [1 -> 2]
        Math.floor(step + delta / 2), //3 [2 -> 3]
        Math.floor(step + delta / 2), //4 [3 -> 4]
        Math.floor(step2 - half), //5 [4 -> 5]
        Math.floor(step2 + half / 2), //6 [5 -> 6]
        Math.floor(step2 - half / 3), //7 [6 -> 7]
        Math.floor(screen5Container.getBoundingClientRect().height + window.innerHeight) //8 [7 -> 8]
    ]
}