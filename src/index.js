const TWEEN = require('@tweenjs/tween.js')
import { mainLetters } from './components/mainLetters/mainLetters'

class Renderer {
    mouse = {
        moving: false,
        x: 0,
        y: 0
    }
    scroll = {
        scrolling: false,
        positions: [],
        times: [],
        velocity: 0,
        velocityMax: 0,
        tween: []
    }
    constructor(handler = []) {
        this.handlers = handler
    }

    setHandler(handler) {
        this.handlers.push(handler)
    }

    setMousePosition(mouse) {
        this.mouse = mouse
    }

    setScrollPosition(scroll) {
        this.scroll.scrolling = scroll.scrolling
        this.mouse.moving = false
    }

    render() {
        requestAnimationFrame(function animate(time) {
            this.calculateScrollVelocity()
            this.handlers.forEach(hd => hd(this.mouse, this.scroll))
            TWEEN.update(time)
            requestAnimationFrame(animate.bind(this))
        }.bind(this))
    }

    calculateScrollVelocity() {
        // if (!this.scroll.scrolling) return
        
        const EASE_COEF = 0.05

        const translateY = window.pageYOffset
        let newTranslateY = (translateY - 0) * EASE_COEF
        let newVelocityMax = 0
    
        const timeNow = performance.now()
        const positionNow = newTranslateY
        if (this.scroll.times.length === 0) {
            this.scroll.times[0] = timeNow
            this.scroll.positions[0] = positionNow
            this.scroll.velocity = 0
            this.scrollnewVelocityMax = 0
            this.scrollvelocityMax = 0
        } else if (this.scroll.times.length == 1) {
            this.scroll.times[1] = timeNow
            this.scroll.positions[1] = positionNow
            newVelocityMax = -((this.scroll.positions[1] - this.scroll.positions[0]) / (this.scroll.times[1] - this.scroll.times[0])) * 500
            if (Math.abs(newVelocityMax) > Math.abs(this.scroll.velocityMax)) { 
                this.scroll.velocityMax = newVelocityMax
                TWEEN.removeAll()
                this.scroll.tween = []
            }
        } else {
            this.scroll.times = [this.scroll.times[1], timeNow]
            this.scroll.positions = [this.scroll.positions[1], positionNow]
            newVelocityMax = -((this.scroll.positions[1] - this.scroll.positions[0]) / (this.scroll.times[1] - this.scroll.times[0])) * 500
            if (Math.abs(newVelocityMax) > Math.abs(this.scroll.velocityMax))  { 
                this.scroll.velocityMax = newVelocityMax 
                TWEEN.removeAll()
                this.scroll.tween = []
            }
        }

        const startObj = {}
        const endObj = {}
        startObj.y = this.scroll.velocity
        endObj.y = this.scroll.velocityMax

        if (this.scroll.tween.length === 0 && Math.abs(this.scroll.velocityMax) > 0) {
            this.scroll.tween[0] = new TWEEN.Tween(startObj) 
            .to(endObj, 300)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.scroll.velocity = startObj.y
            })
            .onComplete(() => {
                // console.log('finish tween 1')
            })
            .start()
            this.scroll.tween[1] = new TWEEN.Tween(startObj) 
            .to({y: 0}, 800)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.scroll.velocity = startObj.y
                console.log(this.scroll.velocity)
            })
            .onComplete(() => {
                // console.log('finish tween 2')
                TWEEN.removeAll()
                this.scroll.tween = []
                this.scroll.velocityMax = 0
            })
            this.scroll.tween[0].chain(this.scroll.tween[1])
        }
        if (this.scroll.velocity === 0) this.scroll.scrolling = false
    }
}

const renderer = new Renderer()
document.addEventListener('DOMContentLoaded', function() {
    renderer.setHandler(mainLetters)
    renderer.render()
})

document.addEventListener('mousemove', function(e) {
    renderer.setMousePosition({
        moving: true,
        x: e.clientX,
        y: e.clientY,
    })
})

document.addEventListener('scroll', function() {
    renderer.setScrollPosition({
        scrolling: true
    })
})