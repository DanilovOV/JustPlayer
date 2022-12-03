export default class ProgressBar {
    _barShiftX = 0
    _rewindMethod = this.rewind.bind(this)
    isSongRewinds = false

    constructor(systemPlayer) {
        this.systemPlayer = systemPlayer

        this.progressBar = document.querySelector('.js-progress-bar')
        this.progress = document.querySelector(".js-progress-bar-progress")

        this.progressBar.addEventListener('mousedown', this.startRewind.bind(this))
    }

    update() {
        if (!this.isSongRewinds)
            this.progress.style.width = this.systemPlayer.currentTime / this.systemPlayer.duration * 100 + '%'
    }

    startRewind(e) {
        this.isSongRewinds = true
        this.rewind(e)
        document.addEventListener('mousemove', this._rewindMethod)
        document.addEventListener('mouseup', this.endRewind.bind(this), {once: true})
    }

    rewind(e) {
        this._barShiftX = e.clientX - this.progressBar.getBoundingClientRect().left
        
        if (this._barShiftX < 0)
            this.progress.style.width = '0%'
        else if (this._barShiftX > this.progressBar.offsetWidth)
            this.progress.style.width = '100%'
        else 
            this.progress.style.width = this._barShiftX + 'px'
    }

    endRewind() {
        document.removeEventListener('mousemove', this._rewindMethod)

        this.systemPlayer.currentTime =
            this.systemPlayer.duration * this._barShiftX / (this.progressBar.offsetWidth / 100) / 100

        this.isSongRewinds = false
    }
}