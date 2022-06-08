// Аудиоплеер ===================================================================
let audioplayer = document.getElementById('audioplayer'); // Системный аудиоплеер
let audioplayerBlock = document.querySelector('.audioplayer') // Блок аудиоплеера
let apMusicList = document.querySelector('.audioplayer__musicList'); // Плейлист
let apSongs = document.getElementsByClassName('audioplayer__musicItem'); // Массив блоков с песнями
let apProgressBar = document.querySelector('.audioplayer__audio-track'); // Общий прогрессбар песни
let apCurrentProgress = document.querySelector(".audioplayer__time"); // Полоска текущего прогресса песни
let apProgressTime; // Определяет состояние прогрессбара песни
let apIsChangingTime = false; // Указывает, перематывается ли трек на данный момент
let apPlayButton = document.querySelector('.audioplayer__play'); // Кнопка Play/Pause
let apPrevButton = document.querySelector('.audioplayer__prev'); // Кнопка следующей песни
let apNextButton = document.querySelector('.audioplayer__next'); // Кнопка предыдущей песни
let apImgPlayPause = document.getElementById('play_pause'); // Для управления изображением кнопки Play/Pause
let apIsSongPlaying = false; // Указывает, проигрывается ли в данный момент песня
let apImagePreview = document.getElementById('audioplayer__preview'); // Большое изображение песни в плеере
let apDuration = document.querySelector('.audioplayer__duration');  // Данные о продолжительности песни в плеере
let apCurrentTime = document.querySelector('.audioplayer__currentTime'); // Данные о текущем времени проигрывания песни в плеере
let apName = document.querySelector('.audioplayer__name'); // Данные о названии песни в плеере
let apAuthor = document.querySelector('.audioplayer__author'); // Данные об авторе песни в плеере
let apAlbum = document.querySelector('.audioplayer__album'); // Данные об альбоме песни в плеере
let apRepeatButton = document.querySelector('.audioplayer__repeat'); // Кнопка включения/выключения повтора песни
let apIsRepeat = false; // Определяет, включен ли повтор песни
let apVolumeButton = document.querySelector('.audioplayer__volumeIcon'); // Кнопка выключения/включения звука
let apVolumeBar = document.querySelector('.audioplayer__volumeBar'); // Общий бар громкости
let apCurrentVolume = document.querySelector('.audioplayer__currentVolume'); // Бар текущей громкости
let apCurrentVolumeData = 0.5; // Значение громкости. Нужно чтобы восстановить уровень звука, бывший до его выключения
let apIsMuted = false; // Определяет, выключен ли звук или нет
let apSongShadow = 0; // Замена блока пока он перемещается
let apIsSongMoving = false; // Указывает, перемещается ли песня или нет
let apSongSequence = []; // Для хранения данных о текущей очередности песен
let apSongID = 0; // Номер текущей песни в songsMetaData
let apCurrentSongPos = 0; // Определяет какой по счету трек должен играть
let apWaitMovingEnd = false; // Указывает на то, что какой-либо трек в данный момент перемещается

// Нужно для корректного рассчета позиции всех перемещаемых элементов (блоки песен, полоски времени и звука)
let apPositionMode = 0; 

apPlayButton.addEventListener("click", PlayPauseHandler); // Кнопочка Play/Pause
apPrevButton.addEventListener("click", () => ButtonPrevNextHandler('prev')); // Кнопочка предыдущей песни
apNextButton.addEventListener('click', () => ButtonPrevNextHandler('next')); // Кнопочка следующей песни
apVolumeButton.addEventListener('click', ButtonVolumeClick); // Кнопка включения/выключения звука
apRepeatButton.addEventListener('click', RepeatHandler); // Кнопка повтора песни
audioplayer.addEventListener('timeupdate', UpdateTimeAndBar); // Когда обновляется время плеера
apProgressBar.addEventListener('mousedown', WannaChangeTime); // Клик по прогрессбару песни для перемотки
apVolumeBar.addEventListener('mousedown', WannaChangeVolume); // Когда пользователь кликает по полоске громкости
navigator.mediaSession.setActionHandler('previoustrack', () => ButtonPrevNextHandler('prev')); // Нажатие клавиши предыдущий трек
navigator.mediaSession.setActionHandler('nexttrack', () => ButtonPrevNextHandler('next')); // Нажатие клавиши следующий трек
navigator.mediaSession.setActionHandler('play', PlayPauseHandler); // Нажатие клавиши play
navigator.mediaSession.setActionHandler('pause', PlayPauseHandler); // Нажатие клавиши pause

/*  
    Содержит данные о переносимой песне:
    songBlock - переносимая песня
    downX / downY - координаты, на которых был mousedown, 
    shiftX / shiftY - относительный сдвиг курсора от угла блока песни
*/
let movingSongData = {};

/*   
    Содержит данные о каждой песне:
    name - название песни
    author - автор
    url - ссылка на файл с песней
    cover_big - большое изображение для текущей песни
    cover_small - небольшое изображение (обычно 50x50) для отображения в плейлисте в правой части плеера
    duration - продолжительность песни для отображения в плейлисте

    Чтобы добавить песню в плеер, достаточно добавить новый элемент сюда.
    !!!ВАЖНО!!! Добавлять песни можно только в начало массива. Это сделано для сохранения пользовательских настроек очередности песен.
    Если надо добавить песню в не в начало массива, раскомменти функцию BuildNewPlaylist() в функции FirstSongDataInit().
    Заменить песню на другую в том же месте можно. Удалить песню в одном месте и добавить в другом нельзя.
    Если песен оказывается меньше, чем сохранено в localStorage, пользовательские настройки очищаются и плейлист строится по данным этого массива.
*/
let songsMetaData = [
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
        "name": "Scary People",
        "author": "Georgi Kay",
        "album": "Where I Go to Disappear",
        "url": "Songs/Scary People.mp3",
        "cover_big": "Images/Covers/Where_I_Go_To_Disappear.jpg",
        "cover_small": "Images/Covers/Where_I_Go_To_Disappear_small.jpg",
        "duration": "3:06"
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
        "name": "Half Moon",
        "author": "Tinlicker feat Morgan Jones",
        "album": "Remember the Future",
        "url": "Songs/Half Moon.mp3",
        "cover_big": "Images/Covers/Half_Moon.jpg",
        "cover_small": "Images/Covers/Half_Moon_small.jpg",
        "duration": "7:21"
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

// Добавляем плейлист с кастомной очередностью песен в localStorage
function AddPlaylistToStorage() {
    localStorage.removeItem('playlist');
    localStorage.setItem('playlist', apSongSequence);
}

// Берем сохраненный плейлист с очередностью песен, установленной пользователем
function GetPlaylistFromStorage() {
    if (!localStorage.getItem('playlist')) {
        BuildNewPlaylist();
        return;
    }
    apSongSequence = localStorage.getItem('playlist').split(',');
}

// Перезаписываем очередность песен при перемещении какой-либо песни
function PlaylistReplaceSong() {
    let newSongElements = document.getElementsByClassName('audioplayer__musicItem'); 
    for (let i = 0; i < songsMetaData.length; i++) {
        apSongSequence[i] = newSongElements[i].dataset.songIndex;
    }
}

// Строит плейлист по данным из songMetaData
// Обнуляет пользовательские настройки очередности песен
function BuildNewPlaylist() {
    apSongSequence = [];
    for (let i = 0; i < songsMetaData.length; i++) {
        apSongSequence[i] = i;
    }
    AddPlaylistToStorage();
}

// Создает HTML разметку музыки
function MusicCreateHTML() {
    for (let i = 0; i < songsMetaData.length; i++) {
        document.querySelector('.audioplayer__musicList').insertAdjacentHTML('beforeend', 
            `<div class="audioplayer__musicItem" data-song-index="${apSongSequence[i]}"> \
                <div class="audioplayer__playingStatusIcon"> \
                    <img src="Images/Icons/1x1.png" alt="" width="100%"> \
                </div> \
                <div class="audioplayer__itemMetaData"> \
                    <span class="audioplayer__itemSongName">${songsMetaData[apSongSequence[i]].name}</span> \
                    <span class="audioplayer__itemAuthorAlbum">${songsMetaData[apSongSequence[i]].author} - ${songsMetaData[apSongSequence[i]].album}</span> \
                </div> \
                <img src="${songsMetaData[apSongSequence[i]].cover_small}" alt="" class="audioplayer__smallCover"> \
                <div class="audioplayer__itemDuration">${songsMetaData[apSongSequence[i]].duration}</div> \
            </div>`
        )
    }
}

// Если добавляем песню в songsMetaData, плейлист в localStorage перезаписывается
function CheckMetaDataChanging() {

    // Если добавили новую песню в songsMetaData
    // Т.к. песни мы добавляем в начало, новые песни добавятся в начало плейлиста
    // А старые, с установленной пользователем очередностью, добавятся дальше
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

    // Если убрали песню из songsMetaData, строим плейлист заного
    if (apSongSequence.length > songsMetaData.length) BuildNewPlaylist();
}

// При переносе песен узнаем, в какой позиции стоит текущая песня
function GetCurrentSongPosition() {
    for (let i = 0; i < songsMetaData.length; i++) {
        if (apSongSequence[i] == apSongID) apCurrentSongPos = i;
    }
}

// Проверяет, на какую часть блока указывает курсор
function CheckPartOfSongBlock(e) {
    if (e.clientX > 0 && e.clientX < window.screen.availWidth && e.clientY > 0 && e.clientY < window.screen.availHeight) {
        let songMouseIsOver = document.elementFromPoint(e.clientX, e.clientY).closest('.audioplayer__musicItem');
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

// Инициализируем данные о песнях при загрузке страницы
function FirstSongDataInit() {
    // BuildNewPlaylist(); // Выстраивает плейлист напрямую от songsMetaData, обнуляет очередность в localStorage
    SetPositionMode();
    GetPlaylistFromStorage();
    CheckMetaDataChanging();
    MusicCreateHTML();
    AddSongBlockListeners();

    apSongID = apSongSequence[apCurrentSongPos];
    apName.innerHTML = songsMetaData[apSongID].name;
    apAuthor.innerHTML = songsMetaData[apSongID].author;
    apAlbum.innerHTML = songsMetaData[apSongID].album;
    audioplayer.src = songsMetaData[apSongID].url;
    apImagePreview.src = songsMetaData[apSongID].cover_big;
    apDuration.innerHTML = songsMetaData[apSongID].duration;

    apCurrentTime.innerHTML = '0:00';
    audioplayer.volume = apCurrentVolumeData;
    apSongs[apCurrentSongPos].classList.add('audioplayer__activeSong');
    apSongs[apCurrentSongPos].querySelector('img').src = 'Images/Icons/now-playing.png';
}
FirstSongDataInit();

// Навешиваем на блоки с песнями функции
function AddSongBlockListeners() {
    for (var i = 0; i < apSongs.length; i++){
        apSongs[i].addEventListener('mouseover', SongHoverAdd); // Добавить эффект наведения на песню
        apSongs[i].addEventListener('mouseout', SongHoverRemove); // Убрать эффект наведения на песню
        apSongs[i].addEventListener('click', SongBlockClick); // Обработка клика по песне
        apSongs[i].addEventListener('mousedown', SongClickHandler); // Обработка перетаскивания песни 
    }
}

// Добавляет эффект наведения на песню
function SongHoverAdd() {
    this.style.backgroundColor = '#30363e';
    if( !this.classList.contains('audioplayer__activeSong')) this.querySelector('img').src = 'Images/Icons/list-play.png';
}
// Убирает эффект наведения на песню
function SongHoverRemove() {
    this.style.backgroundColor = '#192029';
    if( !this.classList.contains('audioplayer__activeSong')) this.querySelector('img').src = 'Images/Icons/1x1.png';
}

// Обрабатывает клик на песню
function SongBlockClick() {
    // Если кликнутая песня не та, которую мы сейчас слушаем, переключаемся
    if (!this.classList.contains('audioplayer__activeSong')) {
        apSongs[apCurrentSongPos].classList.remove('audioplayer__activeSong');
        apSongs[apCurrentSongPos].querySelector('img').src = 'Images/Icons/1x1.png';
        apSongID = this.dataset.songIndex;
        apImgPlayPause.src = 'Images/Icons/pause.svg';

        GetCurrentSongPosition();
        SwitchSong();
        PlayPauseHandler('play');
    }
    // А если мы уже слушаем эту песню, то клик будет равен клику по Play-Pause кнопке
    else PlayPauseHandler();
}

// Меняет выводимые данные при переключении песен
function SwitchSong() {
    // Обнуляет время прослушивания
    audioplayer.currentTime = 0;
    apCurrentProgress.style.width = 0;

    // Устанавливает номер элемента songsMetaData, откуда будут взяты данные о песне
    apSongID = apSongSequence[apCurrentSongPos];
    // Меняет выводимые данные песни
    audioplayer.src = songsMetaData[apSongID].url;
    apImagePreview.src = songsMetaData[apSongID].cover_big;
    apDuration.innerHTML = songsMetaData[apSongID].duration;
    apName.innerHTML = songsMetaData[apSongID].name;
    apAuthor.innerHTML = songsMetaData[apSongID].author;
    apAlbum.innerHTML = songsMetaData[apSongID].album;

    // Добавляет атрибуты того, что песня активна
    apMusicList.childNodes[apCurrentSongPos].classList.add('audioplayer__activeSong');
    apMusicList.childNodes[apCurrentSongPos].querySelector('img').src = 'Images/Icons/now-playing.png';
}

// Меняет данные прогрессбара песни и текущего времени её прослушивания
function UpdateTimeAndBar() {
    apCurrentTime.innerHTML = ConvertTime(audioplayer.currentTime);

    // Если в это время не перематываем песню
    if (!apIsChangingTime) {
        let audioTime = Math.round(audioplayer.currentTime);
        let audioLength = Math.round(audioplayer.duration);
        apCurrentProgress.style.width = (audioTime * 100) / audioLength + '%';

        // Если время песни закончилось, за ислючением перемотки во время паузы
        if (audioTime == audioLength && apIsSongPlaying) {
            if (!apIsSongMoving) {
                if (!apIsRepeat) {
                    apMusicList.childNodes[apCurrentSongPos].classList.remove('audioplayer__activeSong');
                    apMusicList.childNodes[apCurrentSongPos].querySelector('img').src = 'Images/Icons/1x1.png';
                    
                    if (apCurrentSongPos < songsMetaData.length - 1) apCurrentSongPos++;
                    else apCurrentSongPos = 0;
                    SwitchSong();
                }
                audioplayer.play();
            }
            else apWaitMovingEnd = true;
        }
    }
}

// Переводим время в секундах в формат m:ss
function ConvertTime(playingTime) {
    let mins = Math.floor(playingTime / 60);
    let secs = Math.floor(playingTime) % 60;
    if (secs < 10) secs = '0' + secs;
    return (mins + ':' + secs);
}

// Определяет, ставить ли песню на паузу или наоборот включить
// Вызов с параметром 'play' всегда включает песню
function PlayPauseHandler(playPauseParam) {
    if (!apIsSongPlaying || playPauseParam == 'play') {
        apIsSongPlaying = true;
        apSongs[apCurrentSongPos].classList.add('audioplayer__activeSong');
        apSongs[apCurrentSongPos].querySelector('img').src = 'Images/Icons/now-playing.png';
        apImgPlayPause.src = 'Images/Icons/pause.svg';
        audioplayer.play();
    }
    else {
        apIsSongPlaying = false;
        apImgPlayPause.src = 'Images/Icons/play.svg';
        audioplayer.pause();
    }
}

// Переключает песню на предыдущую
function ButtonPrevNextHandler(prevOrNext) {
    if (!apIsSongMoving) {
        apSongs[apCurrentSongPos].classList.remove('audioplayer__activeSong');
        apSongs[apCurrentSongPos].querySelector('img').src = 'Images/Icons/1x1.png';

        if (prevOrNext == 'prev') {
            if (apCurrentSongPos > 0) apCurrentSongPos--;
            else apCurrentSongPos = songsMetaData.length - 1;
        }
        else if (prevOrNext == 'next') {
            if (apCurrentSongPos < songsMetaData.length - 1) apCurrentSongPos++;
            else apCurrentSongPos = 0;
        }

        RepeatHandler('no');
        SwitchSong();
        if (apIsSongPlaying) audioplayer.play();
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
    if (apPositionMode == 0) mouseX = Math.floor(e.pageX - apProgressBar.offsetLeft);
    else mouseX = Math.floor(e.pageX - apProgressBar.offsetLeft - audioplayerBlock.getBoundingClientRect().left);

    apProgressTime = mouseX / (apProgressBar.offsetWidth / 100);
    if (mouseX < 0) apCurrentProgress.style.width = '0%';
    else if (mouseX > apProgressBar.offsetWidth) apCurrentProgress.style.width = '100%';
    else apCurrentProgress.style.width = mouseX + 'px';
}
function StopChangeTime() {
    document.removeEventListener('mousemove', ChangeTime);
    document.removeEventListener('mouseup', StopChangeTime);
    audioplayer.currentTime = audioplayer.duration * (apProgressTime / 100);
    apIsChangingTime = false;
}

// Ставим/убираем режим повтора для песни
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

// Включаем/выключаем звук
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

// Функции изменения громкости
// Обработка клика по полоске громкости
function WannaChangeVolume(e) {
    ChangeVolume(e);
    document.addEventListener('mousemove', ChangeVolume);
    document.addEventListener('mouseup', StopChangeVolume);
}
// Изменяет громкость и меняет иконку громкости
function ChangeVolume(e) {
    let mouseX;
    if (apPositionMode == 0) mouseX = Math.floor(e.pageX - apVolumeBar.offsetLeft);
    else mouseX = Math.floor(e.pageX - apVolumeBar.offsetLeft - audioplayerBlock.getBoundingClientRect().left);
    
    if (mouseX < 0) { // Если курсор левее полоски громкости - выключаем звук
        apCurrentVolume.style.width = '0%';
        apIsMuted = true;
        apVolumeButton.querySelector('img').src = 'Images/Icons/mute.svg';
    }
    else if (mouseX > apVolumeBar.offsetWidth) { // Если правее - звук на 100%
        apCurrentVolume.style.width = '100%';
        apIsMuted = false;
        apVolumeButton.querySelector('img').src = 'Images/Icons/volume.svg';
    }
    else { // Если в пределах ширины полоски, измеряем нужное значение
        apCurrentVolume.style.width = mouseX + 'px';
        apIsMuted = false;
        apVolumeButton.querySelector('img').src = 'Images/Icons/volume.svg';
    }

    audioplayer.volume = apCurrentVolume.offsetWidth / apVolumeBar.offsetWidth;
}
function StopChangeVolume() {
    document.removeEventListener('mousemove', ChangeVolume);
    document.removeEventListener('mouseup', StopChangeVolume);
    apCurrentVolumeData = audioplayer.volume;
}

// Скрипт перемещения песен по плейлисту
function SongClickHandler(e) {
    if (e.which != 1) return; // Если не ПКМ, то обрабатываем

    // Блок, на который мы нажали
    movingSongData.songBlock = e.target.closest('.audioplayer__musicItem');

    // Координаты, на которых мы нажали на блок pageX/pageY
    // По ним потом будем определять, достаточно ли сдвинули блок для активации перемещения
    movingSongData.downX = e.clientX;
    movingSongData.downY = e.clientY;

    document.addEventListener('mousemove', MoveSong);
    document.addEventListener('mouseup', EndMoveSong);
}

function MoveSong(e) {
    if (!apIsSongMoving) { // Если еще не двигали песню

        // Не передвигаем, если мышь передвинулась в нажатом состоянии недостаточно далеко
        if (Math.abs(e.pageX - movingSongData.downX) < 3 && Math.abs(e.pageY - movingSongData.downY) < 3) return;
        
        // Смещение блока относительно курсора
        let box = movingSongData.songBlock.getBoundingClientRect();

        movingSongData.shiftX = movingSongData.downX - box.left;
        movingSongData.shiftY = movingSongData.downY - box.top;

        // Определяем начальную позицию блока, который будем двигать, чтобы вернуть его на место если блок переместят в запрещенное место
        for (let i = 0; i < apMusicList.childNodes.length; i++) {
            if (movingSongData.songBlock == apMusicList.childNodes[i]) {
                apStartMoveBlockPos = i;
                break;
            }
        }

        // Делаем выбранный трек передвигаемым
        apMusicList.appendChild(movingSongData.songBlock);
        movingSongData.songBlock.classList.add('movable');

        // Создаем клон блока, который показывает, куда будет перемещен блок если отпустить его
        apSongShadow = document.createElement('div');
        apSongShadow.classList.add('songShadow');
        apMusicList.childNodes[apStartMoveBlockPos].before(apSongShadow);

        apIsSongMoving = true;
    }

    // Отобразить перенос объекта при каждом движении мыши
    if (apPositionMode == 0) { // Для position = static
        movingSongData.songBlock.style.left = e.clientX - movingSongData.shiftX + window.scrollX + 'px';
        movingSongData.songBlock.style.top = e.clientY - movingSongData.shiftY + window.scrollY + 'px';
    }
    else { // Для position = relative/absolute/fixed
        movingSongData.songBlock.style.left = e.clientX - movingSongData.shiftX - audioplayerBlock.getBoundingClientRect().left + 'px';
        movingSongData.songBlock.style.top = e.clientY - movingSongData.shiftY - audioplayerBlock.getBoundingClientRect().top + 'px';
    }

    CheckPartOfSongBlock(e);
}

function EndMoveSong(e) {
    document.removeEventListener('mousemove', MoveSong);
    document.removeEventListener('mouseup', EndMoveSong);

    if (apIsSongMoving) {
        apIsSongMoving = false;
        apSongShadow.replaceWith(movingSongData.songBlock);

        PlaylistReplaceSong();
        AddPlaylistToStorage();
        GetCurrentSongPosition();

        // Очищаем данные о перемещенной песне
        movingSongData.songBlock.classList.remove('movable');
        movingSongData.songBlock.style.left = 'auto';
        movingSongData.songBlock.style.top = 'auto';
        movingSongData = {};
    }

    // Если песня закончилась пока мы переносили какую-либо песню
    if (apWaitMovingEnd) {
        apWaitMovingEnd = false;
        UpdateTimeAndBar();
    }
}
// !Аудиоплеер ================================================================