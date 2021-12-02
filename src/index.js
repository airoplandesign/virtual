import { mainLetters } from './components/mainLetters/mainLetters'

class Renderer {
    constructor(handler) {
        this.handlers = [ handler ]
    }

    setHandler(handler) {
        this.handlers.push(handler)
    }

    render() {
        requestAnimationFrame(function animate(time) {
            this.handlers.forEach(hd => hd())
            requestAnimationFrame(animate.bind(this))
        }.bind(this))
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const renderer = new Renderer(mainLetters)
    renderer.render()
})