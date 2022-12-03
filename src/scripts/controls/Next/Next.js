import nextIcon from './next.svg'

export default class Next {
    
    constructor(buttonNode) {
        this.button = buttonNode
        this.setIcon()
    }

    setIcon() {
        this.icon = this.button.querySelector('img')
        if (!this.icon) throw new Error("Can't find img node for next button icon")
        this.icon.src = nextIcon
    }
}