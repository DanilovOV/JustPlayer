let repeatButton = document.querySelector('.js-repeat')
repeatButton.addEventListener('click', () => PlayerRepeat.toggle.bind(PlayerRepeat)())

let isSongRewinds
let isRepeat
let waitEndMove



const progressBarWrapper = document.querySelector('.js-progress-bar')
const progressBarProgress = document.querySelector(".js-song-progress")
const progressBar = new ProgressBar(progressBarWrapper, progressBarProgress)


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