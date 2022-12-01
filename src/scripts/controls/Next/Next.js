import nextIcon from './next.svg'

export default class Next {
    
    constructor(systemPlayer) {
        if (!systemPlayer) throw new Error('Constructor require system player HTML elem')
        this.systemPlayer = systemPlayer
        
        this.createButton()
        this.createIcon()
    }

    createButton() {
        this.button = document.querySelector('.js-next-button')
        if (!this.button) throw new Error("Can't find next button node")
    }

    createIcon() {
        this.icon = this.button.querySelector('img')
        if (!this.icon) throw new Error("Can't find img node for next button icon")
        this.icon.src = nextIcon
    }

}