export default class ProgressBar {
    _barShiftX = 0
    _rewindMethod = this.rewind.bind(this)
    isSongRewinds = false

    constructor(wrapper, progress) {
        this.wrapper = wrapper
        this.progress = progress

        this.addListeners()
    }

    addListeners() {
        this.wrapper.addEventListener('mousedown', this.startRewind.bind(this))
    }

    startRewind(e) {
        this.isSongRewinds = true
        this.rewind(e)
        document.addEventListener('mousemove', this._rewindMethod)
        document.addEventListener('mouseup', this.end.bind(this), {once: true})
    }

    rewind(e) {
        this._barShiftX = e.clientX - this.wrapper.getBoundingClientRect().left
        
        if (this._barShiftX < 0) this.progress.style.width = '0%'
        else if (this._barShiftX > this.bar.offsetWidth) this.progress.style.width = '100%'
        else this.progress.style.width = this._barShiftX + 'px'
    }

    endRewind() {
        document.removeEventListener('mousemove', this._rewindMethod)
            
        systemPlayer.currentTime = systemPlayer.duration 
            * ((this._barShiftX / (progressBar.offsetWidth / 100)) / 100)

        isSongRewinds = false
    }
}

