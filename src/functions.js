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
    const translateX = (window.innerWidth / 2 - mouse.x) * 100 / window.innerWidth / 20 * translateCoef 
    const translateY = (window.innerHeight / 2 - mouse.y) * 100 / window.innerHeight / 20 * translateCoef
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

    domElement.style.transform = `translate(${newTranslateX}%, ${newTranslateY}%) scale(1.1)`
}

export const setScrollParallax = (domElement, { velocity, scrolling }, translateCoef = 1) => {
    if (!scrolling) return
    if (!isElementVisible(domElement)) return
    let newTranslateX = domElement.style.transform.split(', ')[0]
    newTranslateX = newTranslateX ? parseFloat(newTranslateX.replace('translate(', '').replace('%', '')) : 0 
    const translateVelocity = velocity * translateCoef
    domElement.style.transform = `translate(${newTranslateX}%, ${translateVelocity}px) scale(1.1)`
}