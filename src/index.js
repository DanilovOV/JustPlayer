import songsMetaData from './scripts/metadata'

import './styles/app.scss';
import './assets/icons/list-play.png';
import './assets/icons/now-playing.png';
import './assets/icons/pause.svg';
import './assets/icons/mute.svg';
import './assets/icons/repeat-on.svg';












class SongSwitch {

    static switch (whichSong, songElem) {
        if (MoveSong.isSongMoved) return
        if (songElem && !songElem.dataset.songId)
            throw new Error("Song elem don't have dataset index")

        let desiredSong

        switch (whichSong) {
            case 'this':
                desiredSong = songElem
                break;
    
            case 'prev':
                desiredSong = this.#getAnotherSong(activeSong, 'prev')
                break;
    
            case 'next':
                desiredSong = this.#getAnotherSong(activeSong, 'next')
                break;
    
            default:
                throw new Error("Wrong 'whichSong' param")
        }

        this.#makeSongActive(desiredSong)
    }
    
    static #getAnotherSong(songElem, param) {
        const thisSongIndex = this.#getIndexInOrder(songElem)
        
        let requiredSongIndex

        switch (param) {
            case 'prev':
                requiredSongIndex = thisSongIndex == 0
                    ? songsOrder[songsOrder.length - 1]
                    : songsOrder[thisSongIndex - 1]
                break;
    
            case 'next':
                requiredSongIndex = (songsOrder.length - 1 > thisSongIndex)
                    ? songsOrder[thisSongIndex + 1]
                    : songsOrder[0]
                break;
    
            default:
                throw new Error("Wrong 'get' param")
        }

        const requiredSong = document.querySelector(`[data-song-id="${requiredSongIndex}"]`)
        return requiredSong
    }
    
    static #getIndexInOrder(songElem) {
        const index = songsOrder.findIndex(
            orderSongId => orderSongId == songElem.dataset.songId)

        if (index == -1) throw new Error("Can't find this song in order")
        return index
    }

    static #makeSongActive(songElem) {
        const thisSongData = songsMetaData[songElem.dataset.songId]
    
        systemPlayer.src = thisSongData.path + 'song.mp3'
        songProgress.style.width = 0
        setSongInfo()
        replaceActiveSongStyles()
    
        activeSong && startPlaying()
        activeSong = songElem


        function setSongInfo() {
            bigCover.src = thisSongData.path + 'cover_big.jpg'
            songDuration.innerHTML = thisSongData.duration
            songNameElem.innerHTML = thisSongData.name
            authorElem.innerHTML = thisSongData.author
            albumElem.innerHTML = thisSongData.album
        }
    
        function replaceActiveSongStyles() {
            const activeSong = songList.querySelector('.active-song')
            if (activeSong) {
                songList.querySelector('.active-song img').src = './assets/list-play.png'
                songList.querySelector('.active-song').classList.remove('active-song')
            }
    
            songElem.classList.add('active-song')
            songElem.querySelector('img').src = './assets/now-playing.png'
        }
    }
}



class MoveSong {
    static _song
    static _downX
    static _downY
    static isSongMoved
    static songShadow
    static _moveMethod = this.move.bind(this)

    static start(e) {
        if (e.which != 1) return
        
        this._song = e.currentTarget
        this._downX = e.clientX
        this._downY = e.clientY

        document.addEventListener('mousemove', this._moveMethod)
        document.addEventListener('mouseup', this.end.bind(this), {once: true})
    }

    static move(e) {
        if (!this.isSongMoved) {
            if (Math.abs(e.pageX - this._downX) < 3 &&
                Math.abs(e.pageY - this._downY) < 3) return
            
            let songBlockOffset = this._song.getBoundingClientRect()
    
            this.shiftX = this._downX - songBlockOffset.left
            this.shiftY = this._downY - songBlockOffset.top

            const startPosition = songsOrder.findIndex(
                songId => songId == MoveSong._song.dataset.songId)
    
            this._song.classList.add('movable')
            this.songShadow = document.createElement('div')
            this.songShadow.classList.add('songShadow')
            songList.childNodes[startPosition].before(this.songShadow)
    
            this.isSongMoved = true
        }
    
        this._song.style.left = e.clientX - this.shiftX + 'px'
        this._song.style.top = e.clientY - this.shiftY + 'px'
    
        this.#replaceShadow(e);
    }

    static end() {
        document.removeEventListener('mousemove', this._moveMethod)
        if (!this.isSongMoved) return

        this.isSongMoved = false
        this.songShadow.replaceWith(this._song)
        
        songsOrder = getNewSongsOrder()
        uploadSongsOrder(songsOrder)

        this._song.classList.remove('movable')
        this._song.removeAttribute('style')
    
        if (waitEndMove) {
            waitEndMove = false
            songEndedHandler()
        }
    }

    static #replaceShadow(e) {
        const target = e.target.closest('.js-song-item')
        if (!target) return;
        
        const shiftY = e.clientY - target.getBoundingClientRect().top
    
        if (shiftY < (target.offsetHeight / 8)) target.after(this.songShadow) 
        else if (shiftY > (target.offsetHeight / 8 * 7)) target.before(this.songShadow)
        else if (shiftY < (target.offsetHeight / 2)) target.before(this.songShadow)
        else target.after(this.songShadow)
    }
}



class RewindSong {
    static _barShiftX
    static _rewindMethod = this.rewind.bind(this)

    static start(e) {
        isSongRewinds = true
        this.rewind(e)
        document.addEventListener('mousemove', this._rewindMethod)
        document.addEventListener('mouseup', this.end.bind(this), {once: true})
    }
    
    static rewind(e) {
        this._barShiftX = e.clientX - progressBar.getBoundingClientRect().left
    
        if (this._barShiftX < 0) songProgress.style.width = '0%'
        else if (this._barShiftX > progressBar.offsetWidth) songProgress.style.width = '100%'
        else songProgress.style.width = this._barShiftX + 'px'
    }
    
    static end() {
        document.removeEventListener('mousemove', this._rewindMethod)
        
        systemPlayer.currentTime = systemPlayer.duration 
            * ((this._barShiftX / (progressBar.offsetWidth / 100)) / 100)
    
        isSongRewinds = false
    }
}



class PlayerVolume {
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



class PlayerRepeat {
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



let systemPlayer = document.querySelector('#audioplayer')
systemPlayer.addEventListener('play', startPlaying)
systemPlayer.addEventListener('pause', stopPlaying)
systemPlayer.addEventListener('ended', songEndedHandler)
systemPlayer.addEventListener('timeupdate', updateSongProgress)

let progressBar = document.querySelector('.js-progress-bar')
progressBar.addEventListener('mousedown', RewindSong.start.bind(RewindSong))

let playPauseButton = document.querySelector('.js-play-pause-button')
playPauseButton.addEventListener("click", playPauseHandler)

let prevSongButton = document.querySelector('.js-prev-button')
prevSongButton.addEventListener("click", () => SongSwitch.switch.bind(SongSwitch, 'prev')() )

let nextSongButton = document.querySelector('.js-next-button')
nextSongButton.addEventListener('click', () => SongSwitch.switch.bind(SongSwitch, 'next')() )

let repeatButton = document.querySelector('.js-repeat')
repeatButton.addEventListener('click', () => PlayerRepeat.toggle.bind(PlayerRepeat)())

let volumeButton = document.querySelector('.js-volume-icon')
volumeButton.addEventListener('click', PlayerVolume.toggleVolume.bind(PlayerVolume))

let volumeBar = document.querySelector('.js-volume-bar-wrapper')
volumeBar.addEventListener('mousedown', PlayerVolume.startChange.bind(PlayerVolume))

let audioplayer = document.querySelector('.js-audioplayer')
let songList = document.querySelector('.js-songs-list')
let songProgress = document.querySelector(".js-song-progress")
let playPauseImg = document.querySelector('.js-play-pause-img')
let bigCover = document.querySelector('.js-big-cover')
let songDuration = document.querySelector('.js-song-duration')
let currentPlayTime = document.querySelector('.js-play-time')
let currentVolume = document.querySelector('.js-current-volume')
let songNameElem = document.querySelector('.js-song-name')
let authorElem = document.querySelector('.js-song-author')
let albumElem = document.querySelector('.js-song-album')

let activeSong
let songsOrder = []
let isSongRewinds
let isRepeat
let waitEndMove

navigator.mediaSession.setActionHandler('previoustrack', () => SongSwitch.switch.bind(SongSwitch, 'prev'))
navigator.mediaSession.setActionHandler('nexttrack', () => SongSwitch.switch.bind(SongSwitch, 'next'))
navigator.mediaSession.setActionHandler('play', playPauseHandler);
navigator.mediaSession.setActionHandler('pause', playPauseHandler);


initAudioplayer()

function initAudioplayer() {
    downloadSongOrder()
    checkDataChange()
    renderSongs()

    systemPlayer.volume = 0.5
    const startSong = document.querySelector(`[data-song-id="${songsOrder[0]}"]`)
    SongSwitch.switch('this', startSong)
}



function downloadSongOrder() {
    const storageOrderData = localStorage.getItem('playlist')

    songsOrder = storageOrderData
        ? storageOrderData.split(',')
        : getResetOrder()
}



function checkDataChange() {
    if (songsOrder.length > songsMetaData.length) {
        songsOrder = getResetOrder()
        uploadSongsOrder(songsOrder)
    }

    else if (songsOrder.length < songsMetaData.length) {
        let lengthDiff = songsMetaData.length - songsOrder.length
        
        for (let i = 0; i < lengthDiff; i++) {
            songsOrder[i] = i
        }

        let oldPlaylist = localStorage.getItem('playlist').split(',')

        for (let i = 0; i < oldPlaylist.length; i++) {
            songsOrder[i + lengthDiff] = parseInt(oldPlaylist[i]) + lengthDiff
        }
    }
}





function renderSongs() {
    const songList = document.querySelector('.js-songs-list')

    songsOrder.forEach(num => {
        songList.insertAdjacentHTML('beforeend', 
            `<div class="audioplayer__songItem js-song-item" data-song-id="${num}"> \
                <div class="audioplayer__playingStatusIcon"> \
                    <img src="./assets/list-play.png"> \
                </div> \
                <div class="audioplayer__itemMetaData"> \
                    <span class="audioplayer__itemSongName">${songsMetaData[num].name}</span> \
                    <span class="audioplayer__itemAuthorAlbum">${songsMetaData[num].author} - ${songsMetaData[num].album}</span> \
                </div> \
                <img src="${songsMetaData[num].path}cover_small.jpg" class="audioplayer__smallCover"> \
                <div class="audioplayer__itemDuration">${songsMetaData[num].duration}</div> \
            </div>`
        )
    })

    document.querySelectorAll('.js-song-item').forEach(song => {
        song.addEventListener('click', songClick)
        song.addEventListener('mousedown', MoveSong.start.bind(MoveSong))
    })
}


function convertTime(playingTime) {
    let mins = Math.floor(playingTime / 60);
    let secs = Math.floor(playingTime) % 60;
    if (secs < 10) secs = '0' + secs;
    return (mins + ':' + secs);
}



function songClick() {
    activeSong = this

    this.classList.contains('active-song')
        ? playPauseHandler()
        : SongSwitch.switch('this', activeSong)
}



function updateSongProgress() {
    currentPlayTime.innerHTML = convertTime(systemPlayer.currentTime)
    if (isSongRewinds) return

    songProgress.style.width = systemPlayer.currentTime /
        systemPlayer.duration * 100 + '%'
}



function playPauseHandler() {
    systemPlayer.paused
        ? startPlaying()
        : stopPlaying()
}

function startPlaying() {
    if (!systemPlayer.paused) return

    playPauseImg.src = './assets/pause.svg'
    systemPlayer.play()
}

function stopPlaying() {
    if (systemPlayer.paused) return

    playPauseImg.src = './assets/play.svg'
    systemPlayer.pause()
}



function songEndedHandler() {
    if (!MoveSong.isSongMoved) {
        isRepeat || SongSwitch.switch('next')
        systemPlayer.play()
    } else {
        waitEndMove = true
    }
}



function getNewSongsOrder() {
    const songsList = document.querySelectorAll('.js-song-item')
    let newOrder = []
    songsList.forEach((song, index) => newOrder[index] = song.dataset.songId)

    return newOrder
}

function getResetOrder() {
    let resetOrder = []
    for (let i = 0; i < songsMetaData.length; i++) resetOrder[i] = i

    return resetOrder
}

function uploadSongsOrder(order) {
    localStorage.removeItem('playlist')
    localStorage.setItem('playlist', order)
}
