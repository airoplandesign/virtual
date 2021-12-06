const TWEEN = require('@tweenjs/tween.js')
import gsap from 'gsap'
import { horizontalflow } from './components/horizontalFlow/horizontalFlow'
import { mainLetters } from './components/mainLetters/mainLetters'
import { platformMenu } from './components/platformMenu/platformMenu'
import { timeLaps } from './components/timeLaps/timeLaps'

import { createScreensHeight } from './functions'

class Renderer {
    swipeDuration = 1500
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
        tween: [],
    }
    screenScrollProps = {
        isActive: false,
        screensHeight: [],
        activeScreen: 0,
        direction: null,
        swiping: false,
        pageY: null,
        newPageY: null,
        prevWheeling: false,
        wheeling: false,
        wheelingTimeout: null
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
        this.screenScrollProps.wheeling = true

        clearTimeout(this.screenScrollProps.wheelingTimeout);
        this.screenScrollProps.wheelingTimeout = setTimeout(function($this) {
            $this.screenScrollProps.wheeling = false;
        }, 10, this);

        this.scroll.scrolling = scroll.scrolling
        this.screenScrollProps.direction = scroll.direction || null
        this.screenScrollProps.newPageY = scroll.pageY
        this.mouse.moving = false
    }

    setScreens() {
        this.screenScrollProps.isActive = true
    }

    render() {
        if (this.screenScrollProps.isActive) {
            [document.querySelector('body')].forEach(dom => {
                dom.style.cssText = 'position: relative; overflow: hidden; max-height: 100vh;'
            })
        }
        requestAnimationFrame(function animate(time) {
            this.#calculateScrollVelocity()
            this.handlers.forEach(hd => hd(this.mouse, this.scroll))
            TWEEN.update(time)
            requestAnimationFrame(animate.bind(this))
            this.#scrollScreen()
        }.bind(this))
    }

    #calculateScrollVelocity() {
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
            newVelocityMax = -((this.scroll.positions[1] - this.scroll.positions[0]) / (this.scroll.times[1] - this.scroll.times[0])) * 100
            if (Math.abs(newVelocityMax) > Math.abs(this.scroll.velocityMax)) { 
                this.scroll.velocityMax = newVelocityMax
                TWEEN.removeAll()
                this.scroll.tween = []
            }
        } else {
            this.scroll.times = [this.scroll.times[1], timeNow]
            this.scroll.positions = [this.scroll.positions[1], positionNow]
            newVelocityMax = -((this.scroll.positions[1] - this.scroll.positions[0]) / (this.scroll.times[1] - this.scroll.times[0])) * 100
            if (Math.abs(newVelocityMax) > Math.abs(this.scroll.velocityMax)) { 
                this.scroll.velocityMax = newVelocityMax 
                TWEEN.removeAll()
                this.scroll.tween = []
            }
        }

        const startObj = {}
        const endObj = {}
        startObj.y = this.scroll.velocity
        endObj.y = Math.abs(this.scroll.velocityMax) > 100 ? this.scroll.velocityMax / Math.abs(this.scroll.velocityMax) * 100 : this.scroll.velocityMax

        if (this.scroll.tween.length === 0 && Math.abs(this.scroll.velocityMax) > 0) {
            this.scroll.tween[0] = new TWEEN.Tween(startObj) 
            .to(endObj, 300)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.scroll.velocity = startObj.y
            })
            .start()
            this.scroll.tween[1] = new TWEEN.Tween(startObj) 
            .to({y: 0}, 800)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.scroll.velocity = startObj.y
            })
            .onComplete(() => {
                TWEEN.removeAll()
                this.scroll.tween = []
                this.scroll.velocityMax = 0
            })
            this.scroll.tween[0].chain(this.scroll.tween[1])
        }
        if (this.scroll.velocity === 0) this.scroll.scrolling = false
    }
    #scrollScreen() {
        if (!this.screenScrollProps.wheeling) this.screenScrollProps.prevWheeling = false
        console.log(this.screenScrollProps.prevWheeling)

        if (!this.screenScrollProps.isActive) return
        if (this.screenScrollProps.swiping) return
        if (!this.screenScrollProps.wheeling) return
        if (this.screenScrollProps.prevWheeling) return
        this.screenScrollProps.prevWheeling = true
        this.screenScrollProps.swiping = true
        console.log("SWIPE!!!")

        
        this.screenScrollProps.screensHeight = createScreensHeight()
        this.screenScrollProps.activeScreen += (this.screenScrollProps.direction * -1)
        // console.log(this.screenScrollProps.activeScreen)
        
        if (this.screenScrollProps.activeScreen >= this.screenScrollProps.screensHeight.length) --this.screenScrollProps.activeScreen
        if (this.screenScrollProps.activeScreen < 0) ++this.screenScrollProps.activeScreen
        
        let scrollPosition = 0
        for (let i = 0; i <= this.screenScrollProps.activeScreen; i++) {
            console.log(this.screenScrollProps.screensHeight[i])
            scrollPosition += this.screenScrollProps.screensHeight[i]
        }

        // window.scrollTo({
        //     top: scrollPosition,
        // })
        gsap.to({y: window.pageYOffset}, { y: scrollPosition, 
            onUpdate() {
                const tween = this
                window.scrollTo({
                    top: tween.targets()[0].y,
                })
            },
            ease: 'expo.inOut',
            duration: this.swipeDuration / 1000
        });

        // const startPosition = { y: window.pageYOffset }
        // const endPosition = { y: scrollPosition }
        // new TWEEN.Tween(startPosition) 
        //     .to(endPosition, this.swipeDuration)
        //     .easing(TWEEN.Easing.Quadratic.InOut)
        //     .onUpdate(() => {
        //         window.scrollTo({
        //             top: startPosition.y,
        //         })
        //         console.log(startPosition.y)
        //     })
        //     .start()
        
        setTimeout(function($this) {
            $this.screenScrollProps.swiping = false
        }, this.swipeDuration, this)
    }
}


const renderer = new Renderer()
window.addEventListener('load', function() {
    renderer.setHandler(mainLetters)
    renderer.setHandler(horizontalflow)
    renderer.setHandler(timeLaps)
    renderer.setHandler(platformMenu)
    renderer.setScreens() // if u remove this line, ull get standart scroll
    renderer.render()
})

document.addEventListener('mousemove', function(e) {
    renderer.setMousePosition({
        moving: true,
        x: e.clientX,
        y: e.clientY,
    })
})

document.addEventListener('scroll', function(e) {
    if (e.detail === undefined) return
    renderer.setScrollPosition({
        scrolling: true,
        direction: e.detail.direction,
        pageY: e.detail.pageY,
    })
})

document.addEventListener('wheel', function(e) {
    this.dispatchEvent(new CustomEvent("scroll", {
        bubbles: true, 
        detail: {
            direction: e.wheelDeltaY / Math.abs(e.wheelDeltaY),
            pageY: e.pageY,
        }
    }))
})