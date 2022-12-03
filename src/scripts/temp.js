
let isSongRewinds
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