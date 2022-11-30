export default class PlayerRepeat {
    static toggle() {
        isRepeat
            ? this.disable()
            : this.enable()
    }

    static enable() {
        if (isRepeat) return
        repeatButton.querySelector('img').src = './assets/repeat-on.svg'
        isRepeat = true
    }
    
    static disable() {
        if (!isRepeat) return
        repeatButton.querySelector('img').src = './assets/repeat-off.svg'
        isRepeat = false
    }
}