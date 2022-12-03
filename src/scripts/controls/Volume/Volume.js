import unmutedIcon from './unmuted.svg'
import mutedIcon from './muted.svg'

export default class Volume {
    volumeBeforeMute = 0.5
    _changeMethod = this.changeVolume.bind(this)

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

    initBar() {
        this.bar = document.querySelector('.js-volume-bar')
        if (!this.bar) throw new Error('Cant find volume bar')

        this.volumeLevelBar = document.querySelector('.js-volume-level-bar')
        if (!this.volumeLevelBar) throw new Error('Cant find volume level bar')
        
        this.bar.addEventListener('mousedown', this.startChange.bind(this))
    }



    setVolume(volume = 0.5) {
        if (volume < 0) volume = 0
        if (volume > 1) volume = 1
        this.systemPlayer.volume = volume
        volume == 0 ? this.mute('forced') : this.unmute('forced')
    }

    toggleVolume() {
        this.systemPlayer.volume == 0
            ? this.unmute()
            : this.mute()
    }
    
    mute(forced) {
        if (!this.systemPlayer.volume && !forced) return
    
        this.systemPlayer.volume = 0
        this.volumeLevelBar.style.width = 0
        this.icon.src = mutedIcon
    }
    
    unmute(forced) {
        if (this.systemPlayer.volume && !forced) return
        
        this.systemPlayer.volume = forced
            ? this.systemPlayer.volume
            : this.volumeBeforeMute || 0.5
        
        this.volumeLevelBar.style.width = this.systemPlayer.volume * 100 + '%'
        this.icon.src = unmutedIcon
    }



    startChange(e) {
        this.changeVolume(e)
        document.addEventListener('mousemove', this._changeMethod)
        document.addEventListener('mouseup', this.stopChange.bind(this), {once: true})
    }

    changeVolume(e) {
        const shiftX = e.clientX - this.bar.getBoundingClientRect().left
        shiftX < 0 ? this.mute() : this.unmute()

        if (shiftX < 0) 
            this.volumeBeforeMute = 0
        else
            this.volumeLevelBar.style.width = shiftX > this.bar.offsetWidth
                ? '100%'
                : shiftX + 'px'
        
        this.systemPlayer.volume = this.volumeLevelBar.offsetWidth / this.bar.offsetWidth
        this.volumeBeforeMute = this.systemPlayer.volume
    }
    
    stopChange() {
        document.removeEventListener('mousemove', this._changeMethod)
    }
}