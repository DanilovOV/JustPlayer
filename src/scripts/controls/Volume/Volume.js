import unmutedIcon from './unmuted.svg'
import mutedIcon from './muted.svg'

export default class Volume {
    volumeBeforeMute = 0.5
    _changeMethod = this.change.bind(this)

    constructor(systemPlayer) {
        this.systemPlayer = systemPlayer

        this.createButton()
        this.createIcon()
        this.initBar()
    }

    createButton() {
        this.button = document.querySelector('.js-mute-button')
        if (!this.button) throw new Error("Can't find prev button node")
        this.button.addEventListener('click', () => this.toggleVolume.call(this))
    }

    createIcon() {
        this.icon = this.button.querySelector('img')
        if (!this.icon) throw new Error("Can't find img node for prev button icon")
        this.icon.src = unmutedIcon
    }



    toggleVolume() {
        this.systemPlayer.volume == 0
            ? this.unmute()
            : this.mute()
    }
    
    mute() {
        if (!this.systemPlayer.volume) return
    
        this.systemPlayer.volume = 0
        this.volumeLevelBar.style.width = 0
        this.icon.src = mutedIcon
    }
    
    unmute() {
        if (this.systemPlayer.volume) return
    
        this.systemPlayer.volume = this.volumeBeforeMute = this.volumeBeforeMute || 0.5
        this.volumeLevelBar.style.width = this.systemPlayer.volume * 100 + '%'
        this.icon.src = unmutedIcon
    }



    initBar() {
        this.bar = document.querySelector('.js-volume-bar')
        if (!this.bar) throw new Error('Cant find volume bar')

        this.volumeLevelBar = document.querySelector('.js-volume-level-bar')
        if (!this.volumeLevelBar) throw new Error('Cant find volume level bar')
        
        this.bar.addEventListener('mousedown', this.startChange.bind(this))
    }

    startChange(e) {
        this.change(e)
        document.addEventListener('mousemove', this._changeMethod)
        document.addEventListener('mouseup', this.stopChange.bind(this), {once: true})
    }
    
    change(e) {
        const shiftX = e.clientX - this.bar.getBoundingClientRect().left

        if (shiftX > 0)
            this.setVolume(shiftX)
        else {
            this.volumeBeforeMute = 0
            this.mute()
        }
    }
    
    stopChange() {
        document.removeEventListener('mousemove', this._changeMethod)
    }

    setVolume(mouseShiftX) {
        this.unmute()
    
        this.volumeLevelBar.style.width = mouseShiftX > this.bar.offsetWidth
            ? '100%'
            : mouseShiftX + 'px'
    
        this.systemPlayer.volume = this.volumeLevelBar.offsetWidth / this.bar.offsetWidth
        this.volumeBeforeMute = this.systemPlayer.volume
    }
}