let audioplayer = document.querySelector('#audioplayer'); // Системный аудиоплеер
let audioplayerBlock = document.querySelector('.js-audioplayer'); // Блок аудиоплеера
let apSongList = document.querySelector('.js-songs-list'); // Плейлист
let apSongs; // Массив блоков с песнями
let apProgressBarWrapper = document.querySelector('.js-progress-bar-wrapper'); // Общий прогрессбар песни
let apCurrentProgress = document.querySelector(".js-song-progress"); // Полоска текущего прогресса песни
let apPlayButton = document.querySelector('.js-play-pause-button'); // Кнопка Play/Pause
let apPrevButton = document.querySelector('.js-prev-button'); // Кнопка следующей песни
let apNextButton = document.querySelector('.js-next-button'); // Кнопка предыдущей песни
let apImgPlayPause = document.querySelector('.js-play-pause-img') // Для управления изображением кнопки Play/Pause
let apImagePreview = document.querySelector('.js-song-image'); // Большое изображение песни в плеере
let apDuration = document.querySelector('.js-song-duration');  // Данные о продолжительности песни в плеере
let apCurrentTime = document.querySelector('.js-play-time'); // Данные о текущем времени проигрывания песни в плеере
let apName = document.querySelector('.js-song-name'); // Данные о названии песни в плеере
let apAuthor = document.querySelector('.js-song-author'); // Данные об авторе песни в плеере
let apAlbum = document.querySelector('.js-song-album'); // Данные об альбоме песни в плеере
let apRepeatButton = document.querySelector('.js-repeat'); // Кнопка включения/выключения повтора песни
let apVolumeButton = document.querySelector('.js-volume-icon'); // Кнопка выключения/включения звука
let apVolumeBarWrapper = document.querySelector('.js-volume-bar-wrapper'); // Общая полоска громкости
let apCurrentVolume = document.querySelector('.js-current-volume'); // Полоска текущей громкости

let apProgressTime; // Определяет состояние прогрессбара песни
let apIsChangingTime = false; // Указывает, перематывается ли трек на данный момент
let apIsRepeat = false; // Определяет, включен ли повтор песни
let apCurrentVolumeData; // Текущее значение громкости. При выключении звука будет сохранять текущую громкость
let apIsMuted = false; // Определяет, выключен ли звук или нет
let apSongShadow = 0; // Замена блока пока он перемещается
let apIsSongMoving = false; // Указывает, перемещается ли песня или нет
let apSongSequence = []; // Для хранения данных о текущей очередности песен
let apSongID = 0; // Номер текущей песни в songsMetaData
let apCurrentSongPos = 0; // Определяет какой по счету трек должен играть
let apWaitMovingEnd = false; // Указывает на то, что какой-либо трек в данный момент перемещается
let apPositionMode = 0; // Позиционирование плеера. Нужно для корректных рассчетов перемещения элементов

apPlayButton.addEventListener("click", PlayPauseHandler); // Кнопка Play/Pause
apPrevButton.addEventListener("click", () => ButtonPrevNextHandler('prev')); // Кнопка предыдущей песни
apNextButton.addEventListener('click', () => ButtonPrevNextHandler('next')); // Кнопка следующей песни
apVolumeButton.addEventListener('click', ButtonVolumeClick); // Кнопка включения/выключения звука
apRepeatButton.addEventListener('click', RepeatHandler); // Кнопка повтора песни
audioplayer.addEventListener('timeupdate', UpdateTimeAndBar); // Когда обновляется время плеера
apProgressBarWrapper.addEventListener('mousedown', WannaChangeTime); // Клик по прогрессбару песни для перемотки
apVolumeBarWrapper.addEventListener('mousedown', WannaChangeVolume); // Когда пользователь кликает по полоске громкости

audioplayer.addEventListener('play', setPlayState);
audioplayer.addEventListener('pause', setPauseState);
audioplayer.addEventListener('ended', songEndedHandler);

function songEndedHandler() {
    if (!apIsSongMoving) {
        if (!apIsRepeat) {
            apSongList.querySelector('.audioplayer__activeSong img').src = 'Images/Icons/list-play.png';
            apSongList.querySelector('.audioplayer__activeSong').classList.remove('audioplayer__activeSong');
            
            apCurrentSongPos < songsMetaData.length - 1 ? apCurrentSongPos++ : apCurrentSongPos = 0;
            SwitchSong();
        }
        audioplayer.play();
    } else {
        apWaitMovingEnd = true;
    }
}

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



FirstSongDataInit();

// Инициализируем данные о песнях при загрузке страницы
function FirstSongDataInit() {
    SetPositionMode();
    GetPlaylistFromStorage();
    CheckMetaDataChanging();
    MusicCreateHTML();
    AddSongBlockListeners();

    
    apCurrentVolumeData = 0.5;
    apCurrentTime.innerHTML = '0:00';
    apSongID = apSongSequence[apCurrentSongPos];
    
    audioplayer.src = songsMetaData[apSongID].url;
    audioplayer.volume = apCurrentVolumeData;

    apName.innerHTML = songsMetaData[apSongID].name;
    apAuthor.innerHTML = songsMetaData[apSongID].author;
    apAlbum.innerHTML = songsMetaData[apSongID].album;
    apImagePreview.src = songsMetaData[apSongID].cover_big;
    apDuration.innerHTML = songsMetaData[apSongID].duration;

    apSongs[apCurrentSongPos].classList.add('audioplayer__activeSong');
    apSongs[apCurrentSongPos].querySelector('img').src = 'Images/Icons/now-playing.png';
};



// Получает пользовательскую очередность песен из LocalStorage
function GetPlaylistFromStorage() {
    if (!localStorage.getItem('playlist')) {
        BuildNewPlaylist();
        return;
    }
    apSongSequence = localStorage.getItem('playlist').split(',');
}

// Перезаписывает очередность песен
function PlaylistReplaceSong() {
    let newSongElements = document.getElementsByClassName('js-song-item'); 
    for (let i = 0; i < songsMetaData.length; i++) {
        apSongSequence[i] = newSongElements[i].dataset.songIndex;
    }
}



// Создает HTML разметку музыки
function MusicCreateHTML() {
    for (let i = 0; i < songsMetaData.length; i++) {
        document.querySelector('.js-songs-list').insertAdjacentHTML('beforeend', 
            `<div class="audioplayer__songItem js-song-item" data-song-index="${apSongSequence[i]}"> \
                <div class="audioplayer__playingStatusIcon"> \
                    <img src="Images/Icons/list-play.png"> \
                </div> \
                <div class="audioplayer__itemMetaData"> \
                    <span class="audioplayer__itemSongName">${songsMetaData[apSongSequence[i]].name}</span> \
                    <span class="audioplayer__itemAuthorAlbum">${songsMetaData[apSongSequence[i]].author} - ${songsMetaData[apSongSequence[i]].album}</span> \
                </div> \
                <img src="${songsMetaData[apSongSequence[i]].cover_small}" class="audioplayer__smallCover"> \
                <div class="audioplayer__itemDuration">${songsMetaData[apSongSequence[i]].duration}</div> \
            </div>`
        )
    }

    apSongs = document.querySelectorAll('.js-song-item');
}



// Проверяет количество песен в массиве метаданных
function CheckMetaDataChanging() {
    // если песен стало меньше, обнуляем плейлист
    if (apSongSequence.length > songsMetaData.length) {
        BuildNewPlaylist();
        return;
    }

    // если песен стало больше, добавляем новые в начало плейлиста
    if (apSongSequence.length < songsMetaData.length) {
        let difference = songsMetaData.length - apSongSequence.length;
        
        for (let i = 0; i < difference; i++) {
            apSongSequence[i] = i;
        }

        let oldPlaylist = localStorage.getItem('playlist').split(',');

        for (let i = 0; i < oldPlaylist.length; i++) {
            apSongSequence[i + difference] = parseInt(oldPlaylist[i]) + difference;
        }
    }
}



// Определяет позицию песни в плейлисте
function GetCurrentSongPosition() {
    for (let i = 0; i < songsMetaData.length; i++) {
        if (apSongSequence[i] == apSongID) apCurrentSongPos = i;
    }
}



// Проверяет, на какую часть блока песни указывает курсор
function CheckPartOfSongBlock(e) {
    if (e.clientX > 0 && e.clientX < window.screen.availWidth && e.clientY > 0 && e.clientY < window.screen.availHeight) {
        let songMouseIsOver = document.elementFromPoint(e.clientX, e.clientY).closest('.js-song-item');
        if (!songMouseIsOver) return;
        
        if (e.clientY - songMouseIsOver.getBoundingClientRect().top < (songMouseIsOver.offsetHeight / 8)) songMouseIsOver.after(apSongShadow);
        else if (e.clientY - songMouseIsOver.getBoundingClientRect().top > (songMouseIsOver.offsetHeight / 8 * 7)) songMouseIsOver.before(apSongShadow);
        else if (e.clientY - songMouseIsOver.getBoundingClientRect().top < (songMouseIsOver.offsetHeight / 2)) songMouseIsOver.before(apSongShadow);
        else songMouseIsOver.after(apSongShadow);
    }
}



// Определяет позиционирование аудиоплеера
function SetPositionMode() {
    let position;
    position = window.getComputedStyle(audioplayerBlock).position;
    if (position == 'absolute' || position == 'relative' || position == 'fixed') apPositionMode = 1;
}



function AddSongBlockListeners() {
    apSongs.forEach(song => {
        // обработка клика по песне
        song.addEventListener('click', SongBlockClick);

        // обработка перетаскивания песни 
        song.addEventListener('mousedown', SongClickHandler); 
    })
}



// Обрабатывает клик на песню
function SongBlockClick() {
    // если кликнутая песня не та, которую мы сейчас слушаем - переключаем песню
    if (!this.classList.contains('audioplayer__activeSong')) {
        apSongList.querySelector('.audioplayer__activeSong img').src = 'Images/Icons/list-play.png';
        apSongList.querySelector('.audioplayer__activeSong').classList.remove('audioplayer__activeSong');
        apSongID = this.dataset.songIndex;
        apImgPlayPause.src = 'Images/Icons/pause.svg';

        GetCurrentSongPosition();
        SwitchSong();
        PlayPauseHandler('play');
    }
    else PlayPauseHandler();
}



// Меняет выводимые данные при переключении песен
function SwitchSong() {
    audioplayer.currentTime = 0;
    apCurrentProgress.style.width = 0;

    apSongID = apSongSequence[apCurrentSongPos];

    audioplayer.src = songsMetaData[apSongID].url;
    apImagePreview.src = songsMetaData[apSongID].cover_big;
    apDuration.innerHTML = songsMetaData[apSongID].duration;
    apName.innerHTML = songsMetaData[apSongID].name;
    apAuthor.innerHTML = songsMetaData[apSongID].author;
    apAlbum.innerHTML = songsMetaData[apSongID].album;

    apSongList.childNodes[apCurrentSongPos].classList.add('audioplayer__activeSong');
    apSongList.childNodes[apCurrentSongPos].querySelector('img').src = 'Images/Icons/now-playing.png';
}



// Меняет данные прогрессбара песни и текущего времени её прослушивания
function UpdateTimeAndBar() {
    apCurrentTime.innerHTML = ConvertTime(audioplayer.currentTime);

    if (apIsChangingTime) return;

    let audioTime = Math.round(audioplayer.currentTime);
    let audioLength = Math.round(audioplayer.duration);
    apCurrentProgress.style.width = (audioTime * 100) / audioLength + '%';
}



// Переводит время в секундах в формат m:ss
function ConvertTime(playingTime) {
    let mins = Math.floor(playingTime / 60);
    let secs = Math.floor(playingTime) % 60;
    if (secs < 10) secs = '0' + secs;
    return (mins + ':' + secs);
}



// Определяет, ставить ли песню на паузу или наоборот включить
// Вызов с параметром 'play' всегда включает песню
function PlayPauseHandler(playPauseParam) {
    if (audioplayer.paused || playPauseParam == 'play') {
        audioplayer.play();
    }
    else {
        audioplayer.pause();
    }
}

function setPlayState() {
    apImgPlayPause.src = 'Images/Icons/pause.svg';
}

function setPauseState() {
    apImgPlayPause.src = 'Images/Icons/play.svg';
}



// Переключает песню на предыдущую
function ButtonPrevNextHandler(prevOrNext) {
    if (!apIsSongMoving) {
        apSongList.querySelector('.audioplayer__activeSong img').src = 'Images/Icons/list-play.png';
        apSongList.querySelector('.audioplayer__activeSong').classList.remove('audioplayer__activeSong');

        if (prevOrNext == 'prev') {
            apCurrentSongPos > 0 ? apCurrentSongPos-- : apCurrentSongPos = songsMetaData.length - 1;
        }
        else if (prevOrNext == 'next') {
            apCurrentSongPos < songsMetaData.length - 1 ? apCurrentSongPos++ : apCurrentSongPos = 0;
        }

        RepeatHandler('no');
        SwitchSong();
        if (!audioplayer.paused) audioplayer.play();
    }
}



// Перематывает песню
function WannaChangeTime(e) {
    apIsChangingTime = true;
    ChangeTime(e);
    document.addEventListener('mousemove', ChangeTime);
    document.addEventListener('mouseup', StopChangeTime);
}

function ChangeTime(e) {
    let mouseX;
    if (apPositionMode == 0) mouseX = Math.floor(e.pageX - apProgressBarWrapper.offsetLeft);
    else mouseX = Math.floor(e.pageX - apProgressBarWrapper.offsetLeft - audioplayerBlock.getBoundingClientRect().left);

    apProgressTime = mouseX / (apProgressBarWrapper.offsetWidth / 100);
    if (mouseX < 0) apCurrentProgress.style.width = '0%';
    else if (mouseX > apProgressBarWrapper.offsetWidth) apCurrentProgress.style.width = '100%';
    else apCurrentProgress.style.width = mouseX + 'px';
}

function StopChangeTime() {
    document.removeEventListener('mousemove', ChangeTime);
    document.removeEventListener('mouseup', StopChangeTime);
    audioplayer.currentTime = audioplayer.duration * (apProgressTime / 100);
    apIsChangingTime = false;
}



// Устанавливает режим повтора песни
function RepeatHandler(isRepeat) {
    if (apIsRepeat || isRepeat == 'no') {
        apRepeatButton.querySelector('img').src = 'Images/Icons/repeat-off.svg';
        apIsRepeat = false;
    }
    else {
        apRepeatButton.querySelector('img').src = 'Images/Icons/repeat-on.svg';
        apIsRepeat = true;
    }
}



// Функции изменения громкости

// Включает/выключает звук
function ButtonVolumeClick() {
    if (!apIsMuted) {
        audioplayer.volume = 0;
        apCurrentVolume.style.width = 0;
        this.querySelector('img').src = 'Images/Icons/mute.svg';
        apIsMuted = true;
    }
    else {
        if (apCurrentVolumeData == 0) apCurrentVolumeData = 0.5;
        audioplayer.volume = apCurrentVolumeData;
        apCurrentVolume.style.width = apCurrentVolumeData * 100 + '%';
        this.querySelector('img').src = 'Images/Icons/volume.svg';
        apIsMuted = false;
    }
}

// Обрабатывает клик по полоске громоксти
function WannaChangeVolume(e) {
    ChangeVolume(e);
    document.addEventListener('mousemove', ChangeVolume);
    document.addEventListener('mouseup', StopChangeVolume);
}

// Изменяет громкость и меняет иконку громкости
function ChangeVolume(e) {
    let mouseX;
    if (apPositionMode == 0) mouseX = Math.floor(e.pageX - apVolumeBarWrapper.offsetLeft);
    else mouseX = Math.floor(e.pageX - apVolumeBarWrapper.offsetLeft - audioplayerBlock.getBoundingClientRect().left);
    
    if (mouseX < 0) { // если курсор левее полоски громкости - выключаем звук
        apCurrentVolume.style.width = '0%';
        apIsMuted = true;
        apVolumeButton.querySelector('img').src = 'Images/Icons/mute.svg';
    }
    else if (mouseX > apVolumeBarWrapper.offsetWidth) { // если правее - звук на 100%
        apCurrentVolume.style.width = '100%';
        apIsMuted = false;
        apVolumeButton.querySelector('img').src = 'Images/Icons/volume.svg';
    }
    else { // если в пределах ширины полоски, измеряем нужное значение
        apCurrentVolume.style.width = mouseX + 'px';
        apIsMuted = false;
        apVolumeButton.querySelector('img').src = 'Images/Icons/volume.svg';
    }

    audioplayer.volume = apCurrentVolume.offsetWidth / apVolumeBarWrapper.offsetWidth;
}

function StopChangeVolume() {
    document.removeEventListener('mousemove', ChangeVolume);
    document.removeEventListener('mouseup', StopChangeVolume);
    apCurrentVolumeData = audioplayer.volume;
}



// Логика захвата и перемещения песни

function SongClickHandler(e) {
    if (e.which != 1) return; // ничего не делаем, если ПКМ

    // блок, на который мы нажали
    movingSongData.songBlock = e.target.closest('.js-song-item');

    // координаты, на которых мы нажали на блок pageX/pageY
    // по ним потом будем определять, достаточно ли сдвинули блок для активации перемещения
    movingSongData.downX = e.clientX;
    movingSongData.downY = e.clientY;

    document.addEventListener('mousemove', MoveSong);
    document.addEventListener('mouseup', EndMoveSong);
}

function MoveSong(e) {
    if (!apIsSongMoving) { // если еще не двигали песню

        // не передвигаем, если мышь передвинулась в нажатом состоянии недостаточно далеко
        if (Math.abs(e.pageX - movingSongData.downX) < 3 && Math.abs(e.pageY - movingSongData.downY) < 3) return;
        
        // смещение блока относительно курсора
        let box = movingSongData.songBlock.getBoundingClientRect();

        movingSongData.shiftX = movingSongData.downX - box.left;
        movingSongData.shiftY = movingSongData.downY - box.top;

        // определяем начальную позицию блока, который будем двигать, чтобы вернуть его на место если блок переместят в запрещенное место
        for (let i = 0; i < apSongList.childNodes.length; i++) {
            if (movingSongData.songBlock == apSongList.childNodes[i]) {
                apStartMoveBlockPos = i;
                break;
            }
        }

        // делаем выбранный трек передвигаемым
        apSongList.appendChild(movingSongData.songBlock);
        movingSongData.songBlock.classList.add('movable');

        // создаем клон блока, который показывает, куда будет перемещен блок если отпустить его
        apSongShadow = document.createElement('div');
        apSongShadow.classList.add('songShadow');
        apSongList.childNodes[apStartMoveBlockPos].before(apSongShadow);

        apIsSongMoving = true;
    }

    // меняем координаты перемещаемой песни при каждом движении мыши
    if (apPositionMode == 0) { // для position = static
        movingSongData.songBlock.style.left = e.clientX - movingSongData.shiftX + window.scrollX + 'px';
        movingSongData.songBlock.style.top = e.clientY - movingSongData.shiftY + window.scrollY + 'px';
    } else { // для position = relative/absolute/fixed
        movingSongData.songBlock.style.left = e.clientX - movingSongData.shiftX - audioplayerBlock.getBoundingClientRect().left + 'px';
        movingSongData.songBlock.style.top = e.clientY - movingSongData.shiftY - audioplayerBlock.getBoundingClientRect().top + 'px';
    }

    CheckPartOfSongBlock(e);
}

function EndMoveSong() {
    document.removeEventListener('mousemove', MoveSong);
    document.removeEventListener('mouseup', EndMoveSong);

    if (apIsSongMoving) {
        apIsSongMoving = false;
        apSongShadow.replaceWith(movingSongData.songBlock);

        PlaylistReplaceSong();
        AddPlaylistToStorage();
        GetCurrentSongPosition();

        // очищаем данные о перемещенной песне
        movingSongData.songBlock.classList.remove('movable');
        movingSongData.songBlock.style.left = 'auto';
        movingSongData.songBlock.style.top = 'auto';
        movingSongData = {};
    }

    if (apWaitMovingEnd) {
        apWaitMovingEnd = false;
        songEndedHandler();
    }
}



// Обнуляет пользовательскую очередность песен
function BuildNewPlaylist() {
    apSongSequence = [];
    for (let i = 0; i < songsMetaData.length; i++) {
        apSongSequence[i] = i;
    }
    AddPlaylistToStorage();
}



// Сохраняет пользовательскую очередность песен в LocalStorage
function AddPlaylistToStorage() {
    localStorage.removeItem('playlist');
    localStorage.setItem('playlist', apSongSequence);
}