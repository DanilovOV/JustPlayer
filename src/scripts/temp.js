let repeatButton = document.querySelector('.js-repeat')
repeatButton.addEventListener('click', () => PlayerRepeat.toggle.bind(PlayerRepeat)())

let volumeButton = document.querySelector('.js-volume-icon')
volumeButton.addEventListener('click', PlayerVolume.toggleVolume.bind(PlayerVolume))

let volumeBar = document.querySelector('.js-volume-bar-wrapper')
volumeBar.addEventListener('mousedown', PlayerVolume.startChange.bind(PlayerVolume))


let isSongRewinds
let isRepeat
let waitEndMove



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



function songEndedHandler() {
    if (!MoveSong.isSongMoved) {
        isRepeat || SongSwitch.switch('next')
        systemPlayer.play()
    } else {
        waitEndMove = true
    }
}


function updateSongProgress() {
    currentPlayTime.innerHTML = convertTime(systemPlayer.currentTime)
    if (isSongRewinds) return

    songProgress.style.width = systemPlayer.currentTime /
        systemPlayer.duration * 100 + '%'
}