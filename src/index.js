const TWEEN = require('@tweenjs/tween.js')
import gsap from 'gsap'
import NewScroll from './scroll'
import { horizontalflow } from './components/horizontalFlow/horizontalFlow'
import { mainLetters } from './components/mainLetters/mainLetters'
import { platformMenu } from './components/platformMenu/platformMenu'
import { timeLaps } from './components/timeLaps/timeLaps'

import { createScreensHeight } from './functions'

class Renderer {
    swipeDuration = 4000
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
        prevWheeling: false,
        wheeling: false,
        wheelingTimeout: null
    }
    constructor() {
        this.handlers = []
        this.screenScrollProps.pageY = null
        window.scrollTo({top: 0})
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

        let timeline = gsap.timeline() 

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
                // TWEEN.removeAll()
                // this.scroll.tween = []
                // timeline.kill()
            }
        } else {
            this.scroll.times = [this.scroll.times[1], timeNow]
            this.scroll.positions = [this.scroll.positions[1], positionNow]
            newVelocityMax = -((this.scroll.positions[1] - this.scroll.positions[0]) / (this.scroll.times[1] - this.scroll.times[0])) * 100
            if (Math.abs(newVelocityMax) > Math.abs(this.scroll.velocityMax)) { 
                this.scroll.velocityMax = newVelocityMax 
                // TWEEN.removeAll()
                // this.scroll.tween = []
                // timeline.kill()
            }
        }

        const startObj = {}
        const endObj = {}
        startObj.y = this.scroll.velocity
        endObj.y = Math.abs(this.scroll.velocityMax) > 100 ? this.scroll.velocityMax / Math.abs(this.scroll.velocityMax) * 100 : this.scroll.velocityMax

        if (Math.abs(this.scroll.velocityMax) > 0) {
            let scrollVelocity = 0
            timeline.to(startObj, { y: endObj.y, callbackScope: this,
                onUpdate() {
                    this.scroll.velocity = timeline.getChildren()[0].targets()[0].y
                    scrollVelocity = timeline.getChildren()[0].targets()[0].y
                },
                ease: 'sine.inOut',
                duration: 0.5
            }).to({y: scrollVelocity}, { y: 0, callbackScope: this,
                onUpdate() {
                    this.scroll.velocity = timeline.getChildren()[0].targets()[0].y
                },
                onComplete() {
                    this.scroll.velocityMax = 0
                },
                ease: 'sine.inOut',
                duration: 0.5
            });
        }
        if (this.scroll.velocity === 0) this.scroll.scrolling = false
    }
    #scrollScreen() {
        if (!this.screenScrollProps.wheeling) this.screenScrollProps.prevWheeling = false

        if (!this.screenScrollProps.isActive) return
        if (this.screenScrollProps.swiping) return
        if (!this.screenScrollProps.wheeling) return
        if (this.screenScrollProps.prevWheeling) return
        if (this.screenScrollProps.direction === null) return
        this.screenScrollProps.prevWheeling = true
        this.screenScrollProps.swiping = true
        console.log("SWIPE!!!")

        
        this.screenScrollProps.screensHeight = createScreensHeight()
        this.screenScrollProps.activeScreen += (this.screenScrollProps.direction * -1)
        
        if (this.screenScrollProps.activeScreen >= this.screenScrollProps.screensHeight.length) --this.screenScrollProps.activeScreen
        if (this.screenScrollProps.activeScreen < 0) ++this.screenScrollProps.activeScreen
        
        let scrollPosition = 0
        for (let i = 0; i <= this.screenScrollProps.activeScreen; i++) {
            scrollPosition += this.screenScrollProps.screensHeight[i]
        }

        gsap.to({y: window.pageYOffset}, { y: scrollPosition, 
            onUpdate() {
                const tween = this
                window.scrollTo({
                    top: tween.targets()[0].y,
                })
            },
            ease: 'power2.inOut',
            duration: this.swipeDuration / 1000
        });

        
        setTimeout(function($this) {
            $this.screenScrollProps.swiping = false
            $this.scroll.scrolling = false
        }, this.swipeDuration, this)
    }
}

const newScroll = new NewScroll()
newScroll.mouseWheel()
newScroll.touchMove()

const renderer = new Renderer()
window.addEventListener('load', function() {
    renderer.setHandler(mainLetters)
    renderer.setHandler(horizontalflow)
    renderer.setHandler(timeLaps)
    renderer.setHandler(platformMenu)
    renderer.setScreens()
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
    })
})

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
