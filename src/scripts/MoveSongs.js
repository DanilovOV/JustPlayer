import PlayerStorage from "./PlayerStorage"

export default class MoveSong {
    isSongMoved
    songShadow

    _song
    _downX
    _downY
    _moveMethod = this.move.bind(this)

    constructor(songList) {
        this.songList = songList
    }

    start(e) {
        if (e.which != 1) return
        
        this._song = e.currentTarget
        this._downX = e.clientX
        this._downY = e.clientY

        document.addEventListener('mousemove', this._moveMethod)
        document.addEventListener('mouseup', this.end.bind(this), {once: true})
    }

    move(e) {
        if (!this.isSongMoved) {
            if (Math.abs(e.pageX - this._downX) < 3 &&
                Math.abs(e.pageY - this._downY) < 3) return
            
            let songBlockOffset = this._song.getBoundingClientRect()
    
            this.shiftX = this._downX - songBlockOffset.left
            this.shiftY = this._downY - songBlockOffset.top

            const startPosition = PlayerStorage.order.findIndex(
                songId => songId == this._song.dataset.songId)
    
            this._song.classList.add('movable')
            this.songShadow = document.createElement('div')
            this.songShadow.classList.add('songShadow')
            this.songList.childNodes[startPosition].before(this.songShadow)
    
            this.isSongMoved = true
        }
    
        this._song.style.left = e.clientX - this.shiftX + 'px'
        this._song.style.top = e.clientY - this.shiftY + 'px'
    
        this.replaceShadow(e);
    }

    end() {
        document.removeEventListener('mousemove', this._moveMethod)
        if (!this.isSongMoved) return

        this.isSongMoved = false
        this.songShadow.replaceWith(this._song)
        
        const songsList = document.querySelectorAll('.js-song-item')
        PlayerStorage.setAndUploadNewOrder(songsList)

        this._song.classList.remove('movable')
        this._song.removeAttribute('style')
    }

    replaceShadow(e) {
        const target = e.target.closest('.js-song-item')
        if (!target) return;
        
        const shiftY = e.clientY - target.getBoundingClientRect().top
        
        if (shiftY < (target.offsetHeight / 8)) 
            target.after(this.songShadow) 
        else if (shiftY > (target.offsetHeight / 8 * 7))
            target.before(this.songShadow)
        else if (shiftY < (target.offsetHeight / 2))
            target.before(this.songShadow)
        else 
            target.after(this.songShadow)
    }
}