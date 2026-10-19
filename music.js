const songs = [
    {
        title: "Song 1",
        artist: "Artist One",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Song 2",
        artist: "Artist Two",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Song 3",
        artist: "Artist Three",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Song 4",
        artist: "Artist Four",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Song 5",
        artist: "Artist Four",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

let currentSongIndex = 0;
const audio = new Audio();

// DOM Elements
const titleEl = document.getElementById('track-title');
const artistEl = document.getElementById('track-artist');
const imageEl = document.getElementById('track-image');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');
const searchInput = document.getElementById('search-input');


// Load initial song
function loadSong(index) {
    const song = songs[index];
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    imageEl.src = song.cover;
    audio.src = song.src;
    highlightActivePlaylist();
}

// Play / Pause Toggle
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        audio.pause();
        playIcon.classList.replace('fa-pause', 'fa-play');
    }
}

// Next Song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playIcon.classList.replace('fa-play', 'fa-pause');
}

// Previous Song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playIcon.classList.replace('fa-play', 'fa-pause');
}

// Format time (seconds -> mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update Progress Bar as song plays
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

// Click on progress bar to forward / rewind song
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Auto play next song when ended
audio.addEventListener('ended', nextSong);

// Render and Filter Playlist
function renderPlaylist(filterText = '') {
    playlistEl.innerHTML = '';
    songs.forEach((song, originalIndex) => {
        if (song.title.toLowerCase().includes(filterText.toLowerCase()) || 
            song.artist.toLowerCase().includes(filterText.toLowerCase())) {
            
            const li = document.createElement('li');
            li.innerHTML = `<span>${song.title} - ${song.artist}</span>`;
            if (originalIndex === currentSongIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                currentSongIndex = originalIndex;
                loadSong(currentSongIndex);
                audio.play();
                playIcon.classList.replace('fa-play', 'fa-pause');
            });
            playlistEl.appendChild(li);
        }
    });
}

function highlightActivePlaylist() {
    renderPlaylist(searchInput ? searchInput.value : '');
}

// Search Filter Event
loadSong(currentSongIndex);
renderPlaylists();