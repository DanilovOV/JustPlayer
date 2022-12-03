import playIcon from './play.svg'
import pauseIcon from './pause.svg'

export default class PlayPause {

    constructor(buttonNode, systemPlayer) {
        this.button = buttonNode
        this.button.addEventListener('click', this.playPauseHandler.bind(this))
        this.systemPlayer = systemPlayer
        
        this.setIcon()
    }

    setIcon() {
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