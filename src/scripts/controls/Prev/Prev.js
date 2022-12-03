import prevIcon from './prev.svg'

export default class Next {
    
    constructor(buttonNode) {
        this.button = buttonNode
        this.setIcon()
    }

    setIcon() {
        this.icon = this.button.querySelector('img')
        if (!this.icon) throw new Error("Can't find img node for prev button icon")
        this.icon.src = prevIcon
    }
}