import playIcon from './play.svg'
import pauseIcon from './pause.svg'

export default class PlayPause {

    constructor(systemPlayer) {
        if (!systemPlayer) throw new Error('No system player arg for PlayPause elem')
        this.systemPlayer = systemPlayer
        
        this.createButton()
        this.createIcon()
    }

    createButton() {
        this.button = document.querySelector('.js-play-pause-button')
        if (!this.button) throw new Error('No play/pause HTML elem')
        this.button.addEventListener('click', () => this.playPauseHandler())
    }

    createIcon() {
        this.icon = document.querySelector('.js-play-pause-icon')
        if (!this.icon) throw new Error('No play/pause icon HTML elem')
        this.icon.src = playIcon
    }

    playPauseHandler() {
        this.systemPlayer.paused
            ? this.startPlaying()
            : this.stopPlaying()
    }
    
    startPlaying() {
        if (!this.systemPlayer.paused) return
    
        this.icon.src = pauseIcon
        this.systemPlayer.play()
    }
    
    stopPlaying() {
        if (this.systemPlayer.paused) return
    
        this.icon.src = playIcon
        this.systemPlayer.pause()
    }
}