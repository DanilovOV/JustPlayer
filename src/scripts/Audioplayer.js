import PlayPause from "./controls/PlayPause/PlayPause"
import Next from "./controls/Next/Next"
import Prev from "./controls/Prev/Prev"
import songsMetaData from "./metadata"
import PlayerStorage from "./PlayerStorage"

export default class Audioplayer {

    constructor(systemPlayer) {
        if (!systemPlayer) throw new Error('Constructor require system player HTML elem')
        this.systemPlayer = systemPlayer
        
        this.findElements()
        this.createElements()
        this.renderSongs()
        this.addListeners()

        this.systemPlayer.src = songsMetaData[0].path + 'song.mp3'
    }
    
    findElements() {
        this.activeSong = document.querySelector('.js-song-item')
        this.songList = document.querySelector('.js-songs-list')
        
        this.bigCover = document.querySelector('.js-big-cover')
        this.songDuration = document.querySelector('.js-song-duration')
        this.currentPlayTime = document.querySelector('.js-play-time')
        this.currentVolume = document.querySelector('.js-current-volume')
        this.songNameElem = document.querySelector('.js-song-name')
        this.authorElem = document.querySelector('.js-song-author')
        this.albumElem = document.querySelector('.js-song-album')
    }

    createElements() {
        this.songList = document.querySelector('.js-songs-list')
        if (!this.songList) throw new Error('No song list')

        this.playPause = new PlayPause(this.systemPlayer)
        
        this.nextButton = new Next(this.systemPlayer)
        this.nextButton.button.addEventListener('click', () => this.switch.call(this, 'next', this.activeSong))
        
        this.prevButton = new Prev(this.systemPlayer)
        this.prevButton.button.addEventListener('click', () => this.switch.call(this, 'prev', this.activeSong))
    }

    renderSongs() {

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
    }

    addListeners() {
        this.systemPlayer.addEventListener('play', () => this.playPause.startPlaying())
        this.systemPlayer.addEventListener('pause', () => this.playPause.stopPlaying())
        this.systemPlayer.addEventListener('ended', this.temp)
        this.systemPlayer.addEventListener('timeupdate', this.temp)
    }

    temp() {
        return false
    }



    switch(whichSong, songElem) {
        // if (MoveSong.isSongMoved) return
        
        this.order = PlayerStorage.order

        if (songElem && !songElem.dataset.songId)
            throw new Error("Song elem don't have data-id attr")

        let desiredSong

        switch (whichSong) {
            case 'this':
                desiredSong = songElem
                break
    
            case 'prev':
                desiredSong = this.#getAnotherSong(songElem, 'prev')
                break
    
            case 'next':
                desiredSong = this.#getAnotherSong(songElem, 'next')
                break
    
            default:
                throw new Error("Wrong 'whichSong' param")
        }

        this.#makeSongActive(desiredSong)
    }
    
    #getAnotherSong(songElem, whichSong) {
        const thisSongIndex = this.#getIndexInOrder(songElem)
        
        let requiredSongIndex

        switch (whichSong) {
            case 'prev':
                requiredSongIndex = thisSongIndex == 0
                    ? this.order[this.order.length - 1]
                    : this.order[thisSongIndex - 1]
                break
    
            case 'next':
                requiredSongIndex = (this.order.length - 1 > thisSongIndex)
                    ? this.order[thisSongIndex + 1]
                    : this.order[0]
                break
    
            default:
                throw new Error("Wrong 'whichSong' param")
        }

        const requiredSong = document.querySelector(`[data-song-id="${requiredSongIndex}"]`)
        return requiredSong
    }
    
    #getIndexInOrder(songElem) {
        console.log(songElem)
        const index = this.order.findIndex(
            orderSongId => orderSongId == songElem.dataset.songId)

        if (index == -1) throw new Error("Can't find this song in order")
        return index
    }

    #makeSongActive(songElem) {
        const thisSongData = songsMetaData[songElem.dataset.songId]
        
        this.systemPlayer.src = thisSongData.path + 'song.mp3'
        // songProgress.style.width = 0
        setSongInfo()
        replaceActiveSongStyles()
    
        this.activeSong && this.playPause.startPlaying()
        this.activeSong = songElem


        function setSongInfo() {
            this.bigCover.src = thisSongData.path + 'cover_big.jpg'
            this.songDuration.innerHTML = thisSongData.duration
            this.songNameElem.innerHTML = thisSongData.name
            this.authorElem.innerHTML = thisSongData.author
            this.albumElem.innerHTML = thisSongData.album
        }
    
        function replaceActiveSongStyles() {
            const activeSong = this.songList.querySelector('.active-song')
            if (activeSong) {
                this.songList.querySelector('.active-song img').src = './assets/list-play.png'
                this.songList.querySelector('.active-song').classList.remove('active-song')
            }
    
            songElem.classList.add('active-song')
            songElem.querySelector('img').src = './assets/now-playing.png'
        }
    }
}