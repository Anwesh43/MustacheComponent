const size = Math.min(window.innerWidth, window.innerHeight)
class MustacheComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.mustache = new Mustache()
        this.animator = new Animator()
    }
    connectedCallback() {
        this.render()
        console.log(this.mustache)
        this.img.onmousedown = () => {
            this.mustache.startUpdating(() =>  {
                this.animator.start(() => {
                    this.render()
                    this.mustache.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#EEEEEE'
        context.fillRect(0, 0, size, size)
        this.mustache.draw(context)
        this.img.src = canvas.toDataURL()
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.deg = 0
    }
    update(stopcb) {
        this.deg += this.dir * Math.PI/20
        this.scale = Math.sin(this.deg)
        if(this.deg > Math.PI) {
            this.deg = 0
            this.dir = 0
            this.scale = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class Mustache {
    constructor() {
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(size/2, size/2)
        for(var j = 0; j< 2; j++) {
            context.save()
            context.rotate(( Math.PI / 12) * this.state.scale * (1 - 2 * j))
            context.scale(1 - 2 * j, 1)
            context.fillStyle = '#212121'
            context.beginPath()
            context.arc(-size/25, 0, size/25, 0, 2 * Math.PI)
            context.fill()
            context.beginPath()
            context.moveTo(-size/3, -size/10)
            for(var i = 180; i>=60; i--) {
                const x = -size/10 + (size/6) * Math.cos(i * Math.PI/180), y = -(size/20) + (size/10) * Math.sin(i * Math.PI/180)
                context.lineTo(x, y)
            }
            for(var i = 10; i<=180;i++) {
                const x = -size/6 + (size/6 + size/10 - size/6) * Math.cos(i * Math.PI/180), y = -(size/20) + (size/25) * Math.sin(i * Math.PI/180)
                context.lineTo(x, y)
            }
            context.fill()
            context.restore()
        }

        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
customElements.define('mustache-comp', MustacheComponent)
