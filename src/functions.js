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