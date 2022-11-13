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
        volumeButton.querySelector('img').src = 'Images/Icons/mute.svg'
    }
    
    static unmute() {
        if (systemPlayer.volume) return
    
        systemPlayer.volume = this.volumeBeforeMute = this.volumeBeforeMute || 0.5
        currentVolume.style.width = systemPlayer.volume * 100 + '%'
        volumeButton.querySelector('img').src = 'Images/Icons/volume.svg'
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
prevSongButton.addEventListener("click", () => switchSong('prev'))

let nextSongButton = document.querySelector('.js-next-button')
nextSongButton.addEventListener('click', () => switchSong('next'))

let repeatButton = document.querySelector('.js-repeat')
repeatButton.addEventListener('click', toggleRepeat)

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

navigator.mediaSession.setActionHandler('previoustrack', () => switchSong('prev'));
navigator.mediaSession.setActionHandler('nexttrack', () => switchSong('next'));
navigator.mediaSession.setActionHandler('play', playPauseHandler);
navigator.mediaSession.setActionHandler('pause', playPauseHandler);



let songsMetaData = [
    {
        "name": "Half Moon",
        "author": "Tinlicker feat Morgan Jones",
        "album": "Remember the Future",
        "url": "Songs/Half Moon.mp3",
        "cover_big": "Images/Covers/Half_Moon.jpg",
        "cover_small": "Images/Covers/Half_Moon_small.jpg",
        "duration": "7:21"
    },
    {
        "name": "Scary People",
        "author": "Georgi Kay",
        "album": "Where I Go to Disappear",
        "url": "Songs/Scary People.mp3",
        "cover_big": "Images/Covers/Where_I_Go_To_Disappear.jpg",
        "cover_small": "Images/Covers/Where_I_Go_To_Disappear_small.jpg",
        "duration": "3:06"
    },
    {
        "name": "Battles",
        "author": "Alpine Universe",
        "album": "Single",
        "url": "Songs/Battles.mp3",
        "cover_big": "Images/Covers/Battles.jpg",
        "cover_small": "Images/Covers/Battles_small.jpg",
        "duration": "3:39"
    },
    {
        "name": "The Human Kolossus",
        "author": "Alpine Universe",
        "album": "The Alpine Universe",
        "url": "Songs/The Human Kolossus.mp3",
        "cover_big": "Images/Covers/The_Alpine_Universe.jpg",
        "cover_small": "Images/Covers/The_Alpine_Universe_small.jpg",
        "duration": "4:03"
    },
    {
        "name": "High Elevation",
        "author": "Alpine Universe",
        "album": "Single",
        "url": "Songs/High Elevation.mp3",
        "cover_big": "Images/Covers/High_Elevation.jpg",
        "cover_small": "Images/Covers/High_Elevation_small.jpg",
        "duration": "2:54"
    },
    {
        "name": "Shard",
        "author": "Deep Koliis",
        "album": "Single",
        "url": "Songs/Shard.mp3",
        "cover_big": "Images/Covers/Shard.jpg",
        "cover_small": "Images/Covers/Shard_small.jpg",
        "duration": "4:30"
    },
    {
        "name": "Ski the Andes",
        "author": "Alpine Universe",
        "album": "The Empire of Winds",
        "url": "Songs/Ski the Andes.mp3",
        "cover_big": "Images/Covers/The_Empire_of_Winds.jpg",
        "cover_small": "Images/Covers/The_Empire_of_Winds_small.jpg",
        "duration": "2:54"
    },
    {
        "name": "Organika",
        "author": "Alpine Universe",
        "album": "The Alpine Universe",
        "url": "Songs/Organika.mp3",
        "cover_big": "Images/Covers/The_Alpine_Universe.jpg",
        "cover_small": "Images/Covers/The_Alpine_Universe_small.jpg",
        "duration": "3:03"
    },
    {
        "name": "Throw Me to the Wolves",
        "author": "Future Royalty",
        "album": "Single",
        "url": "Songs/Throw Me to the Wolves.mp3",
        "cover_big": "Images/Covers/Throw_Me_To_The_Wolves.jpg",
        "cover_small": "Images/Covers/Throw_Me_To_The_Wolves_small.jpg",
        "duration": "3:55"
    },
    {
        "name": "Monumental",
        "author": "Aviators",
        "album": "Let There to Be Fire",
        "url": "Songs/Monumental.mp3",
        "cover_big": "Images/Covers/Let_There_To_Be_Fire.jpg",
        "cover_small": "Images/Covers/Let_There_To_Be_Fire_small.jpg",
        "duration": "5:46"
    },
    {
        "name": "Reverse Dance",
        "author": "Andrey Vinogradov",
        "album": "Single",
        "url": "Songs/Reverse Dance.mp3",
        "cover_big": "Images/Covers/Reverse_Dance.jpg",
        "cover_small": "Images/Covers/Reverse_Dance_small.jpg",
        "duration": "3:59"
    },
    {
        "name": "The Last of Her Kind",
        "author": "Peter Gundry",
        "album": "The Elixir of Life",
        "url": "Songs/The Last of Her Kind.mp3",
        "cover_big": "Images/Covers/The_Elixir_Of_Life.jpg",
        "cover_small": "Images/Covers/The_Elixir_Of_Life_small.jpg",
        "duration": "3:53"
    },
    {
        "name": "We're The Devils",
        "author": "Karliene",
        "album": "Single",
        "url": "Songs/We're The Devils.mp3",
        "cover_big": "Images/Covers/We_re_The_Devils.png",
        "cover_small": "Images/Covers/We_re_The_Devils_small.png",
        "duration": "5:12"
    }
];



initAudioplayer()

function initAudioplayer() {
    downloadSongOrder()
    checkDataChange()
    renderSongs()
    addSongsListeners()

    systemPlayer.volume = 0.5
    const startSong = document.querySelector(`[data-song-id="${songsOrder[0]}"]`)
    makeSongActive(startSong)
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
                    <img src="Images/Icons/list-play.png"> \
                </div> \
                <div class="audioplayer__itemMetaData"> \
                    <span class="audioplayer__itemSongName">${songsMetaData[num].name}</span> \
                    <span class="audioplayer__itemAuthorAlbum">${songsMetaData[num].author} - ${songsMetaData[num].album}</span> \
                </div> \
                <img src="${songsMetaData[num].cover_small}" class="audioplayer__smallCover"> \
                <div class="audioplayer__itemDuration">${songsMetaData[num].duration}</div> \
            </div>`
        )
    })
}



function addSongsListeners() {
    document.querySelectorAll('.js-song-item').forEach(song => {
        song.addEventListener('click', songClick)
        song.addEventListener('mousedown', MoveSong.start.bind(MoveSong))
    })
}



function makeSongActive(songElem) {
    if (!songElem) return
    const thisSongData = songsMetaData[songElem.dataset.songId]

    systemPlayer.src = thisSongData.url;
    songProgress.style.width = 0;
    setSongInfo()
    replaceActiveSongStyles()

    function setSongInfo() {
        bigCover.src = thisSongData.cover_big;
        songDuration.innerHTML = thisSongData.duration;
        songNameElem.innerHTML = thisSongData.name;
        authorElem.innerHTML = thisSongData.author;
        albumElem.innerHTML = thisSongData.album;
    }

    function replaceActiveSongStyles() {
        const activeSong = songList.querySelector('.active-song')
        if (activeSong) {
            songList.querySelector('.active-song img').src = 'Images/Icons/list-play.png'
            songList.querySelector('.active-song').classList.remove('active-song')
        }

        songElem.classList.add('active-song')
        songElem.querySelector('img').src = 'Images/Icons/now-playing.png'
    }

    activeSong && startPlaying()
    activeSong = songElem
}

function setNextSongActive(songElem) {
    if (!songElem) return

    const nextSong = document.querySelector(`[data-song-id="${getNextSongId(songElem)}"]`)
    nextSong && makeSongActive(nextSong)
}

function setPrevSongActive(songElem) {
    if (!songElem) return
    const prevSong = document.querySelector(`[data-song-id="${getPrevSongId(songElem)}"]`)
    prevSong && makeSongActive(prevSong)
}

function getIndexInOrder(songElem) {
    if (!songElem) return

    const index = songsOrder.findIndex(orderSongId => orderSongId == songElem.dataset.songId)
    return index == -1
        ? null
        : index
}

function getPrevSongId(songElem) {
    if (!songElem) return
    
    const activeSongIndex = getIndexInOrder(songElem)
    
    if (activeSongIndex && songsOrder.length > activeSongIndex) {
        return activeSongIndex && songsOrder[activeSongIndex - 1]
    } else {
        return songsOrder[songsOrder.length - 1]
    }
}

function getNextSongId(songElem) {
    if (!songElem) return

    const activeSongIndex = getIndexInOrder(songElem)
    if (!activeSongIndex && activeSongIndex != 0) return

    return (songsOrder.length - 1 > activeSongIndex)
        ? songsOrder[activeSongIndex + 1]
        : songsOrder[0]
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
        : makeSongActive(activeSong, 'playSong')
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

    playPauseImg.src = 'Images/Icons/pause.svg'
    systemPlayer.play()
}

function stopPlaying() {
    if (systemPlayer.paused) return

    playPauseImg.src = 'Images/Icons/play.svg'
    systemPlayer.pause()
}



function songEndedHandler() {
    if (!MoveSong.isSongMoved) {
        isRepeat || setNextSongActive(activeSong)
        systemPlayer.play()
    } else {
        waitEndMove = true
    }
}



function switchSong(prevOrNext) {
    if (MoveSong.isSongMoved) return

    disableRepeat();
    (prevOrNext == 'prev')
        ? setPrevSongActive(activeSong)
        : setNextSongActive(activeSong)
}



function enableRepeat() {
    if (isRepeat) return
    repeatButton.querySelector('img').src = 'Images/Icons/repeat-on.svg'
    isRepeat = true
}

function disableRepeat() {
    if (!isRepeat) return
    repeatButton.querySelector('img').src = 'Images/Icons/repeat-off.svg'
    isRepeat = false
}

function toggleRepeat() {
    isRepeat
        ? disableRepeat()
        : enableRepeat()
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
