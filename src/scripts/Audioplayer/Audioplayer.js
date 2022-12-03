import songsMetaData from "../metadata"
import PlayerStorage from "../PlayerStorage"

import convertTime from "../convertTime"
import PlayPause from "../controls/PlayPause/PlayPause"
import Next from "../controls/Next/Next"
import Prev from "../controls/Prev/Prev"
import Volume from "../controls/Volume/Volume"
import Repeat from "../controls/Repeat/Repeat"
import ProgressBar from "../controls/ProgressBar/ProgressBar"

import startPlaySongIcon from "./list-play.png"
import activeSongIcon from "./now-playing.png"



export default class Audioplayer {

    constructor(systemPlayer) {
        if (!systemPlayer) throw new Error('Constructor require system player HTML elem')
        this.systemPlayer = systemPlayer
        
        this.findElements()
        this.createControls()
        this.initSongs()
        this.addPlayerListeners()
        
        this.currentPlayTime.innerText = '0:00'
    }
    
    findElements() {
        this.songList = document.querySelector('.js-songs-list')
        this.bigCover = document.querySelector('.js-big-cover')
        this.songDuration = document.querySelector('.js-song-duration')
        this.currentPlayTime = document.querySelector('.js-play-time')
        this.currentVolume = document.querySelector('.js-current-volume')
        this.songNameElem = document.querySelector('.js-song-name')
        this.authorElem = document.querySelector('.js-song-author')
        this.albumElem = document.querySelector('.js-song-album')
    }

    createControls() {
        this.progressBar = new ProgressBar(this.systemPlayer)
        this.playPause = new PlayPause(this.systemPlayer)

        this.nextButton = new Next(this.systemPlayer)
        this.nextButton.button.addEventListener('click', () => this.switch.call(this, 'next', this.activeSong))
        
        this.prevButton = new Prev(this.systemPlayer)
        this.prevButton.button.addEventListener('click', () => this.switch.call(this, 'prev', this.activeSong))

        this.volume = new Volume(this.systemPlayer)
        this.repeat = new Repeat(document.querySelector('.js-repeat-button'))
    }

    initSongs() {
        PlayerStorage.order.forEach(num => {
            this.songList.insertAdjacentHTML('beforeend', 
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
        
        this.songList.querySelectorAll('.js-song-item').forEach(item =>
            item.addEventListener('click', () => this.songClick.call(this, item)))

        this.makeSongActive(document.querySelector('.js-song-item'))
    }

    addPlayerListeners() {
        this.systemPlayer.addEventListener('play', () => this.playPause.startPlaying())
        this.systemPlayer.addEventListener('pause', () => this.playPause.stopPlaying())
        this.systemPlayer.addEventListener('ended', () => this.songEndedHandler.call(this))
        this.systemPlayer.addEventListener('timeupdate', () => this.updateSongProgress.call(this))
        
        navigator.mediaSession.setActionHandler('previoustrack', () => this.switch.call(this, 'prev', this.activeSong))
        navigator.mediaSession.setActionHandler('nexttrack', () => this.switch.call(this, 'next', this.activeSong))
        navigator.mediaSession.setActionHandler('play', () => this.playPause.startPlaying());
        navigator.mediaSession.setActionHandler('pause', () => this.playPause.stopPlaying());
    }



    switch(whichSong, songElem) {
        // if (MoveSong.isSongMoved) return
        
        this.order = PlayerStorage.order
        if (songElem && !songElem.dataset.songId)
            throw new Error("Song elem don't have data-id attr")

        const songId = this.getOrderIndex(songElem)

        if (whichSong == 'this') 
            this.startNewSong( songElem )
        if (whichSong == 'prev') 
            this.startNewSong( document.querySelector(`[data-song-id="${this.getPrevOrderIndex(songId)}"]`) )
        if (whichSong == 'next') 
            this.startNewSong( document.querySelector(`[data-song-id="${this.getNextOrderIndex(songId)}"]`) )
    }

    getOrderIndex(songElem) {
        const index = this.order.findIndex(
            orderSongId => orderSongId == songElem.dataset.songId)

        if (index == -1) throw new Error("Can't find this song in order")
        return index
    }

    getPrevOrderIndex(songElemIndex) {
        return songElemIndex == 0
            ? this.order[this.order.length - 1]
            : this.order[songElemIndex - 1]
    }

    getNextOrderIndex(songElemIndex) {
        return this.order.length - 1 > songElemIndex
            ? this.order[songElemIndex + 1]
            : this.order[0]
    }



    startNewSong(songElem) {
        this.makeSongActive(songElem)
        this.playPause.startPlaying()
    }

    makeSongActive(songElem) {
        this.activeSong = songElem
        this.progressBar.progress.style.width = 0

        this.changeActiveSongData(songElem)
        this.replaceActiveSongStyles(songElem)
    }

    changeActiveSongData(songElem) {
        const data = songsMetaData[songElem.dataset.songId]

        this.systemPlayer.src = data.path + 'song.mp3'
        this.bigCover.src = data.path + 'cover_big.jpg'
        this.songDuration.innerText = data.duration
        this.songNameElem.innerText = data.name
        this.authorElem.innerText = data.author
        this.albumElem.innerText = data.album
    }

    replaceActiveSongStyles(songElem) {
        const oldActiveSong = this.songList.querySelector('.active-song')

        if (oldActiveSong) {
            oldActiveSong.querySelector('img').src = startPlaySongIcon
            oldActiveSong.classList.remove('active-song')
        }

        songElem.classList.add('active-song')
        songElem.querySelector('img').src = activeSongIcon
    }


    songClick(song) {
        song.classList.contains('active-song')
            ? this.playPause.playPauseHandler()
            : this.switch('this', song)
    }

    songEndedHandler() {
        this.repeat.isRepeat || this.switch('next', this.activeSong)
        this.systemPlayer.play()
    }

    updateSongProgress() {
        this.currentPlayTime.innerText = convertTime(this.systemPlayer.currentTime)
        this.progressBar.update()
    }
}
