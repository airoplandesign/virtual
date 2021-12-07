export default class NewScroll {
    DELTA_MIN = 90

    constructor() {
        this.swipe_det = {
            sX: 0,
            sY: 0,
            eX: 0,
            eY: 0
        }
        this.directions = Object.freeze({
            UP: 'up',
            DOWN: 'down',
            RIGHT: 'right',
            LEFT: 'left'
          })
        this.direction = null
    }

    mouseWheel() {
        document.addEventListener('wheel', function(e) {
            if (e.wheelDeltaY === undefined) return
            this.dispatchEvent(new CustomEvent("scroll", {
                bubbles: true, 
                detail: {
                    direction: e.wheelDeltaY / Math.abs(e.wheelDeltaY),
                }
            }))
        })
    }

    touchMove() {
        window.addEventListener('touchstart', function(e) {
            const t = e.touches[0]
            this.swipe_det.sX = t.screenX
            this.swipe_det.sY = t.screenY
            this.swipe_det.eX = this.swipe_det.sX
            this.swipe_det.eY = this.swipe_det.sY
        
        }.bind(this), false)

        window.addEventListener('touchmove', function(e) {
            // Prevent default stop user from scrolling
            // e.preventDefault();
            const t = e.touches[0]
            this.swipe_det.eX = t.screenX
            this.swipe_det.eY = t.screenY
        }.bind(this), false)

        window.addEventListener('touchend', function(e) {
            const deltaX = this.swipe_det.eX - this.swipe_det.sX
            const deltaY = this.swipe_det.eY - this.swipe_det.sY
        
            if (deltaX ** 2 + deltaY ** 2 < this.deltaMin ** 2) return
        
            if (deltaY === 0 || Math.abs(deltaX / deltaY) > 1)
                this.direction = deltaX > 0 ? this.directions.RIGHT : this.directions.LEFT
            else
                this.direction = deltaY > 0 ? this.directions.UP : this.directions.DOWN
        
            if (this.direction) {
                if (this.direction === this.directions.LEFT || this.direction === this.directions.RIGHT) return
                document.dispatchEvent(new CustomEvent("scroll", {
                    bubbles: true, 
                    detail: {
                        direction: this.direction === this.directions.UP ? 1 : -1,
                    }
                }))
            } 
        
            this.direction = null
        }.bind(this), false)
    }
}