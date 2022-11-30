import PlayPause from "./controls/PlayPause/PlayPause"
import songsMetaData from "./metadata"
import PlayerStorage from "./PlayerStorage"

export default class Audioplayer {

    constructor(systemPlayer) {
        if (!systemPlayer) throw new Error('Constructor require system player HTML elem')
        this.systemPlayer = systemPlayer
        
        this.createElements()
        this.renderSongs()
        this.addListeners()

        this.systemPlayer.src = songsMetaData[0].path + 'song.mp3'
    }

    createElements() {
        this.songList = document.querySelector('.js-songs-list')
        if (!this.songList) throw new Error('No song list')

        this.songsOrder = PlayerStorage.order
        this.playPause = new PlayPause(this.systemPlayer)
    }

    renderSongs() {

        this.songsOrder.forEach(num => {
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
}