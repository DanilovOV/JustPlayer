export default class SongSwitch {

    static switch (whichSong, songElem) {
        if (MoveSong.isSongMoved) return
        if (songElem && !songElem.dataset.songId)
            throw new Error("Song elem don't have dataset index")

        let desiredSong

        switch (whichSong) {
            case 'this':
                desiredSong = songElem
                break
    
            case 'prev':
                desiredSong = this.#getAnotherSong(activeSong, 'prev')
                break
    
            case 'next':
                desiredSong = this.#getAnotherSong(activeSong, 'next')
                break
    
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
                break
    
            case 'next':
                requiredSongIndex = (songsOrder.length - 1 > thisSongIndex)
                    ? songsOrder[thisSongIndex + 1]
                    : songsOrder[0]
                break
    
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