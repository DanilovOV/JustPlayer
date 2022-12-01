import prevIcon from './prev.svg'

export default class Next {
    
    constructor(systemPlayer) {
        if (!systemPlayer) throw new Error('Constructor require system player HTML elem')
        this.systemPlayer = systemPlayer
        
        this.createButton()
        this.createIcon()
    }

    createButton() {
        this.button = document.querySelector('.js-prev-button')
        if (!this.button) throw new Error("Can't find prev button node")
    }

    createIcon() {
        this.icon = this.button.querySelector('img')
        if (!this.icon) throw new Error("Can't find img node for prev button icon")
        this.icon.src = prevIcon
    }
}