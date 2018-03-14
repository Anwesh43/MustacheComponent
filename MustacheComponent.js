const size = Math.min(window.innerWidth, window.innerHeight)
class MustacheComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#EEEEEE'
        context.fillRect(0, 0, size, size)
        this.img.src = canvas.toDataURL()
    }

}
