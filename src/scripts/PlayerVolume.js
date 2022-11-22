export default class PlayerVolume {
    static volumeBeforeMute = 0.5
    static _changeMethod = this.change.bind(this)

    static startChange(e) {
        this.change(e)
        document.addEventListener('mousemove', this._changeMethod)
        document.addEventListener('mouseup', this.stopChange.bind(this), {once: true})
    }
    
    static change(e) {
        const shiftX = e.clientX - volumeBar.getBoundingClientRect().left
    
        if (shiftX > 0) {
            this.setVolume(shiftX)
        } else {
            this.volumeBeforeMute = 0
            this.mute()
        }
    }
    
    static stopChange() {
        document.removeEventListener('mousemove', this._changeMethod)
    }

    static setVolume(mouseShiftX) {
        this.unmute()
    
        currentVolume.style.width = mouseShiftX > volumeBar.offsetWidth
            ? '100%'
            : mouseShiftX + 'px'
    
        systemPlayer.volume = currentVolume.offsetWidth / volumeBar.offsetWidth
        this.volumeBeforeMute = systemPlayer.volume
    }

    static toggleVolume() {
        (systemPlayer.volume == 0)
            ? this.unmute()
            : this.mute()
    }
    
    static mute() {
        if (!systemPlayer.volume) return
    
        systemPlayer.volume = 0
        currentVolume.style.width = 0
        volumeButton.querySelector('img').src = './assets/mute.svg'
    }
    
    static unmute() {
        if (systemPlayer.volume) return
    
        systemPlayer.volume = this.volumeBeforeMute = this.volumeBeforeMute || 0.5
        currentVolume.style.width = systemPlayer.volume * 100 + '%'
        volumeButton.querySelector('img').src = './assets/volume.svg'
    }
}