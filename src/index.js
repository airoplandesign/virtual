import gsap from 'gsap'
import NewScroll from './scroll'
import { horizontalflow } from './components/horizontalFlow/horizontalFlow'
import { mainLetters } from './components/mainLetters/mainLetters'
import { platformMenu } from './components/platformMenu/platformMenu'
import { timeLaps } from './components/timeLaps/timeLaps'

import { createScreensHeight } from './functions'
import { preloader } from './components/preloader/preloader'

class Renderer {
    swipeDuration = 4000
    timeline = gsap.timeline()
    mouse = {
        moving: false,
        x: 0,
        y: 0
    }
    scroll = {
        scrolling: false,
        parallax: false
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

        this.screenScrollProps.direction = scroll.direction || null
        this.mouse.moving = false
    }

    setScreens() {
        this.screenScrollProps.isActive = true
    }

    render() {
        // if (this.screenScrollProps.isActive) {
        //     [document.querySelector('body')].forEach(dom => {
        //         dom.style.cssText = 'position: relative; overflow: hidden; max-height: 100vh;'
        //     })
        // }
        requestAnimationFrame(function animate(time) {
            this.handlers.forEach(hd => hd(this.mouse, this.scroll, this.swipeDuration))
            requestAnimationFrame(animate.bind(this))
            this.scroll.parallax = false    

            this.#scrollScreen()
        }.bind(this))
    }

    #scrollScreen() {
        if (!this.screenScrollProps.isActive) return
        if (this.screenScrollProps.swiping) return
        if (!this.screenScrollProps.wheeling) this.screenScrollProps.prevWheeling = false
        if (!this.screenScrollProps.wheeling) return
        if (this.screenScrollProps.prevWheeling) return
        if (this.screenScrollProps.direction === null) return
        
        this.screenScrollProps.screensHeight = createScreensHeight()
        this.screenScrollProps.activeScreen += (this.screenScrollProps.direction * -1)

        if (this.screenScrollProps.activeScreen >= this.screenScrollProps.screensHeight.length) {
            --this.screenScrollProps.activeScreen
            return
        }
        if (this.screenScrollProps.activeScreen < 0) {
            ++this.screenScrollProps.activeScreen
            return
        }

        this.scroll.scrolling = true
        this.screenScrollProps.prevWheeling = true
        this.screenScrollProps.swiping = true
        this.scroll.parallax = true
        console.log("SWIPE!!!")

        let scrollPosition = 0
        for (let i = 0; i <= this.screenScrollProps.activeScreen; i++) {
            scrollPosition += this.screenScrollProps.screensHeight[i]
        }

        gsap.to({y: window.pageYOffset}, { y: scrollPosition, 
            onUpdate() {
                window.scrollTo({
                    top: this.targets()[0].y,
                })
            },
            ease: 'sin.inOut',
            duration: this.swipeDuration / 1000
        });

        setTimeout(function($this) {
            $this.screenScrollProps.swiping = false
            $this.scroll.scrolling = false
            console.log('---> Ready to swipe!')
        }, this.swipeDuration, this)
    }
}

preloader()

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
        // scrolling: true,
        direction: e.detail.direction,
    })
})

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
