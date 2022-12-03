import repeatOff from './repeat-off.svg'
import repeatOn from './repeat-on.svg'

export default class Repeat {
    isRepeat = false

    constructor(repeatButton) {
        this.button = repeatButton
        this.button.addEventListener('click', this.toggle.bind(this))

        this.icon = this.button.querySelector('img')
        if (!this.icon) throw new Error("Can't find repeat icon elem")
        this.icon.src = repeatOff
    }
    
    toggle() {
        this.isRepeat
            ? this.repeatOff()
            : this.repeatOn()
    }
    
    repeatOn() {
        if (this.isRepeat) return
        this.icon.src = repeatOn
        this.isRepeat = true
    }
    
    repeatOff() {
        if (!this.isRepeat) return
        this.icon.src = repeatOff
        this.isRepeat = false
    }
}