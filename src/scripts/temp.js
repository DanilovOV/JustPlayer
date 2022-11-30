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



// Инициализация плеера

const playerStorage = new PlayerStorage()
songsOrder = playerStorage.order

renderSongs()

systemPlayer.volume = 0.5
const startSong = document.querySelector(`[data-song-id="${songsOrder[0]}"]`)
SongSwitch.switch('this', startSong)

const progressBarWrapper = document.querySelector('.js-progress-bar')
const progressBarProgress = document.querySelector(".js-song-progress")

const progressBar = new ProgressBar(progressBarWrapper, progressBarProgress)







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