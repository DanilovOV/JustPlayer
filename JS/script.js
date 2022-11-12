let systemPlayer = document.querySelector('#audioplayer')
systemPlayer.addEventListener('play', startPlaying)
systemPlayer.addEventListener('pause', stopPlaying)
systemPlayer.addEventListener('ended', songEndedHandler)
systemPlayer.addEventListener('timeupdate', updateSongProgress)

let progressBar = document.querySelector('.js-progress-bar')
progressBar.addEventListener('mousedown', startFastForward)

let playPauseButton = document.querySelector('.js-play-pause-button')
playPauseButton.addEventListener("click", playPauseHandler)

let prevSongButton = document.querySelector('.js-prev-button')
prevSongButton.addEventListener("click", () => switchSong('prev'))

let nextSongButton = document.querySelector('.js-next-button')
nextSongButton.addEventListener('click', () => switchSong('next'))

let repeatButton = document.querySelector('.js-repeat')
repeatButton.addEventListener('click', setRepeat)

let volumeButton = document.querySelector('.js-volume-icon')
volumeButton.addEventListener('click', toggleVolume)

let volumeBar = document.querySelector('.js-volume-bar-wrapper')
volumeBar.addEventListener('mousedown', startChangeVolume)

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
let songShadow

let playerPosition
let activeSong
let songsOrder = []
let currentVolumeData = 0.5
let newCurrentPlaytime
let currentSongNumber = 0

let isSongMove
let isSongRewinds
let isRepeat
let isMuted
let waitEndMove

navigator.mediaSession.setActionHandler('previoustrack', () => switchSong('prev'));
navigator.mediaSession.setActionHandler('nexttrack', () => switchSong('next'));
navigator.mediaSession.setActionHandler('play', playPauseHandler);
navigator.mediaSession.setActionHandler('pause', playPauseHandler);


/*  
    Содержит данные о переносимой песне:
    songBlock - переносимая песня
    downX / downY - координаты, на которых был mousedown, 
    shiftX / shiftY - относительный сдвиг курсора от угла блока песни
*/
let movingSongData = {};

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
    checkPlayerPosition()
    downloadSongOrder()
    checkDataChange()
    renderSongs()
    addSongsListeners()

    const startSong = document.querySelector(`[data-song-id="${songsOrder[0]}"]`)
    makeSongActive(startSong)
}



function checkPlayerPosition() {
    let position;
    position = window.getComputedStyle(audioplayer).position;
    if (position == 'absolute' || position == 'relative' || position == 'fixed') 
        playerPosition = 1;
}



function downloadSongOrder() {
    if (!localStorage.getItem('playlist')) {
        resetSongsOrder();
        return;
    }
    songsOrder = localStorage.getItem('playlist').split(',');
}



function checkDataChange() {
    // если песен стало меньше, обнуляем плейлист
    if (songsOrder.length > songsMetaData.length) {
        resetSongsOrder();
        return;
    }

    // если песен стало больше, добавляем новые в начало плейлиста
    if (songsOrder.length < songsMetaData.length) {
        let difference = songsMetaData.length - songsOrder.length;
        
        for (let i = 0; i < difference; i++) {
            songsOrder[i] = i;
        }

        let oldPlaylist = localStorage.getItem('playlist').split(',');

        for (let i = 0; i < oldPlaylist.length; i++) {
            songsOrder[i + difference] = parseInt(oldPlaylist[i]) + difference;
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
        song.addEventListener('click', SongBlockClick)
        song.addEventListener('mousedown', startMoveSong)
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



function CheckPartOfSongBlock(e) {
    if (e.clientX > 0 && e.clientX < window.screen.availWidth && e.clientY > 0 && e.clientY < window.screen.availHeight) {
        let songMouseIsOver = document.elementFromPoint(e.clientX, e.clientY).closest('.js-song-item');
        if (!songMouseIsOver) return;
        
        if (e.clientY - songMouseIsOver.getBoundingClientRect().top < (songMouseIsOver.offsetHeight / 8)) songMouseIsOver.after(songShadow);
        else if (e.clientY - songMouseIsOver.getBoundingClientRect().top > (songMouseIsOver.offsetHeight / 8 * 7)) songMouseIsOver.before(songShadow);
        else if (e.clientY - songMouseIsOver.getBoundingClientRect().top < (songMouseIsOver.offsetHeight / 2)) songMouseIsOver.before(songShadow);
        else songMouseIsOver.after(songShadow);
    }
}





// Обрабатывает клик на песню
function SongBlockClick() {
    activeSong = this;

    this.classList.contains('active-song')
        ? playPauseHandler()
        : makeSongActive(activeSong, 'playSong')
}


function updateSongProgress() {
    currentPlayTime.innerHTML = convertTime(systemPlayer.currentTime);

    if (isSongRewinds) return;

    let audioTime = Math.round(systemPlayer.currentTime);
    let audioLength = Math.round(systemPlayer.duration);
    songProgress.style.width = (audioTime * 100) / audioLength + '%';
}



function playPauseHandler() {
    systemPlayer.paused
        ? startPlaying()
        : stopPlaying()
}

function startPlaying() {
    if (!systemPlayer.paused) return

    playPauseImg.src = 'Images/Icons/pause.svg';
    systemPlayer.play();
}

function stopPlaying() {
    if (systemPlayer.paused) return

    playPauseImg.src = 'Images/Icons/play.svg';
    systemPlayer.pause();
}



function songEndedHandler() {
    if (!isSongMove) {
        if (!isRepeat) setNextSongActive(activeSong)
        systemPlayer.play();
    } else {
        waitEndMove = true;
    }
}



function switchSong(prevOrNext) {
    if (isSongMove) return

    setRepeat('no');
    (prevOrNext == 'prev')
        ? setPrevSongActive(activeSong)
        : setNextSongActive(activeSong)
}


function setRepeat(param) {
    if (isRepeat || param == 'no') {
        repeatButton.querySelector('img').src = 'Images/Icons/repeat-off.svg';
        isRepeat = false;
    }
    else {
        repeatButton.querySelector('img').src = 'Images/Icons/repeat-on.svg';
        isRepeat = true;
    }
}



function toggleVolume() {
    if (!isMuted) {
        systemPlayer.volume = 0;
        currentVolume.style.width = 0;
        this.querySelector('img').src = 'Images/Icons/mute.svg';
        isMuted = true;
    }
    else {
        if (currentVolumeData == 0) currentVolumeData = 0.5;
        systemPlayer.volume = currentVolumeData;
        currentVolume.style.width = currentVolumeData * 100 + '%';
        this.querySelector('img').src = 'Images/Icons/volume.svg';
        isMuted = false;
    }
}



function startMoveSong(e) {
    if (e.which != 1) return; // ничего не делаем, если ПКМ

    movingSongData.songBlock = this;

    // координаты, на которых мы нажали на блок pageX/pageY
    // по ним потом будем определять, достаточно ли сдвинули блок для активации перемещения
    movingSongData.downX = e.clientX;
    movingSongData.downY = e.clientY;

    document.addEventListener('mousemove', moveSong);
    document.addEventListener('mouseup', endMoveSong);
}

function moveSong(e) {
    if (!isSongMove) { // если еще не двигали песню

        // не передвигаем, если мышь передвинулась в нажатом состоянии недостаточно далеко
        if (Math.abs(e.pageX - movingSongData.downX) < 3 && Math.abs(e.pageY - movingSongData.downY) < 3) return;
        
        // смещение блока относительно курсора
        let box = movingSongData.songBlock.getBoundingClientRect();

        movingSongData.shiftX = movingSongData.downX - box.left;
        movingSongData.shiftY = movingSongData.downY - box.top;

        // определяем начальную позицию блока, который будем двигать, чтобы вернуть его на место если блок переместят в запрещенное место
        for (let i = 0; i < songList.childNodes.length; i++) {
            if (movingSongData.songBlock == songList.childNodes[i]) {
                apStartMoveBlockPos = i;
                break;
            }
        }

        // делаем выбранный трек передвигаемым
        songList.appendChild(movingSongData.songBlock);
        movingSongData.songBlock.classList.add('movable');

        // создаем клон блока, который показывает, куда будет перемещен блок если отпустить его
        songShadow = document.createElement('div');
        songShadow.classList.add('songShadow');
        songList.childNodes[apStartMoveBlockPos].before(songShadow);

        isSongMove = true;
    }

    // меняем координаты перемещаемой песни при каждом движении мыши
    if (!playerPosition) { // для position = static
        movingSongData.songBlock.style.left = e.clientX - movingSongData.shiftX + window.scrollX + 'px';
        movingSongData.songBlock.style.top = e.clientY - movingSongData.shiftY + window.scrollY + 'px';
    } else { // для position = relative/absolute/fixed
        movingSongData.songBlock.style.left = e.clientX - movingSongData.shiftX - audioplayer.getBoundingClientRect().left + 'px';
        movingSongData.songBlock.style.top = e.clientY - movingSongData.shiftY - audioplayer.getBoundingClientRect().top + 'px';
    }

    CheckPartOfSongBlock(e);
}

function endMoveSong() {
    document.removeEventListener('mousemove', moveSong);
    document.removeEventListener('mouseup', endMoveSong);

    if (isSongMove) {
        isSongMove = false;
        songShadow.replaceWith(movingSongData.songBlock);

        overwriteSongsOrder()

        movingSongData.songBlock.classList.remove('movable');
        movingSongData.songBlock.style.left = 'auto';
        movingSongData.songBlock.style.top = 'auto';
        movingSongData = {};
    }

    if (waitEndMove) {
        waitEndMove = false;
        songEndedHandler();
    }
}

function overwriteSongsOrder() {
    let newSongElements = document.getElementsByClassName('js-song-item'); 
    for (let i = 0; i < songsMetaData.length; i++) {
        songsOrder[i] = newSongElements[i].dataset.songId;
    }
    uploadSongOrder()
}



function startFastForward(e) {
    isSongRewinds = true;
    fastForward(e);
    document.addEventListener('mousemove', fastForward);
    document.addEventListener('mouseup', stopFastForward);
}

function fastForward(e) {
    let mouseX;
    if (!playerPosition) mouseX = Math.floor(e.pageX - progressBar.offsetLeft);
    else mouseX = Math.floor(e.pageX - progressBar.offsetLeft - audioplayer.getBoundingClientRect().left);

    newCurrentPlaytime = mouseX / (progressBar.offsetWidth / 100);
    if (mouseX < 0) songProgress.style.width = '0%';
    else if (mouseX > progressBar.offsetWidth) songProgress.style.width = '100%';
    else songProgress.style.width = mouseX + 'px';
}

function stopFastForward() {
    document.removeEventListener('mousemove', fastForward);
    document.removeEventListener('mouseup', stopFastForward);
    systemPlayer.currentTime = systemPlayer.duration * (newCurrentPlaytime / 100);
    isSongRewinds = false;
}



function startChangeVolume(e) {
    changeVolume(e);
    document.addEventListener('mousemove', changeVolume);
    document.addEventListener('mouseup', stopChangeVolume);
}

function changeVolume(e) {
    let mouseX;
    if (!playerPosition) mouseX = Math.floor(e.pageX - volumeBar.offsetLeft);
    else mouseX = Math.floor(e.pageX - volumeBar.offsetLeft - audioplayer.getBoundingClientRect().left);
    
    if (mouseX < 0) { // если курсор левее полоски громкости - выключаем звук
        currentVolume.style.width = '0%';
        isMuted = true;
        volumeButton.querySelector('img').src = 'Images/Icons/mute.svg';
    }
    else if (mouseX > volumeBar.offsetWidth) { // если правее - звук на 100%
        currentVolume.style.width = '100%';
        isMuted = false;
        volumeButton.querySelector('img').src = 'Images/Icons/volume.svg';
    }
    else { // если в пределах ширины полоски, измеряем нужное значение
        currentVolume.style.width = mouseX + 'px';
        isMuted = false;
        volumeButton.querySelector('img').src = 'Images/Icons/volume.svg';
    }

    systemPlayer.volume = currentVolume.offsetWidth / volumeBar.offsetWidth;
}

function stopChangeVolume() {
    document.removeEventListener('mousemove', changeVolume);
    document.removeEventListener('mouseup', stopChangeVolume);
    currentVolumeData = systemPlayer.volume;
}



function resetSongsOrder() {
    songsOrder = [];
    for (let i = 0; i < songsMetaData.length; i++) songsOrder[i] = i;
    uploadSongOrder();
}



function uploadSongOrder() {
    localStorage.removeItem('playlist');
    localStorage.setItem('playlist', songsOrder);
}
