// ── Playlist ──
// Each song has a title, artist, cover image URL, and audio src.
// We use free placeholder covers from picsum.photos.
// You can swap in real .mp3 URLs for the src field.
const songs = [
  {
    title: "Midnight Drive",
    artist: "Neon Pulse",
    cover: "https://picsum.photos/seed/song1/400/400",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Golden Hour",
    artist: "Soleil Wave",
    cover: "https://picsum.photos/seed/song2/400/400",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "City Lights",
    artist: "Echo Lane",
    cover: "https://picsum.photos/seed/song3/400/400",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Lost in Space",
    artist: "Orbit FM",
    cover: "https://picsum.photos/seed/song4/400/400",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Rainy Season",
    artist: "Lo-Fi Drift",
    cover: "https://picsum.photos/seed/song5/400/400",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];

// ── State ──
let currentIndex = 0;
let isPlaying = false;

// Audio object — one instance, we just change its src
const audio = new Audio();

// ── DOM References ──
const albumArt    = document.getElementById("albumArt");
const songTitle   = document.getElementById("songTitle");
const songArtist  = document.getElementById("songArtist");
const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const totalTime   = document.getElementById("totalTime");
const playBtn     = document.getElementById("playBtn");
const prevBtn     = document.getElementById("prevBtn");
const nextBtn     = document.getElementById("nextBtn");
const volumeBar   = document.getElementById("volumeBar");
const bgGlow      = document.getElementById("bgGlow");
const iconPlay    = playBtn.querySelector(".icon-play");
const iconPause   = playBtn.querySelector(".icon-pause");

// ── Helper: format seconds to m:ss ──
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  if (s < 10) s = "0" + s;
  return m + ":" + s;
}

// ── Load a song by index ──
function loadSong(index) {
  var song = songs[index];

  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  albumArt.src           = song.cover;
  audio.src              = song.src;

  // Reset progress
  progressBar.value    = 0;
  currentTime.textContent = "0:00";
  totalTime.textContent   = "0:00";

  // Update background glow color based on song index (simple color cycling)
  var colors = [
    "rgba(167, 139, 250, 0.2)",   // purple
    "rgba(251, 191, 36, 0.18)",   // gold
    "rgba(52, 211, 153, 0.18)",   // green
    "rgba(96, 165, 250, 0.18)",   // blue
    "rgba(251, 113, 133, 0.18)"   // pink
  ];
  bgGlow.style.background =
    "radial-gradient(ellipse 60% 50% at 50% 40%, " + colors[index] + " 0%, transparent 70%)";
}

// ── Toggle play / pause ──
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    iconPlay.style.display  = "";
    iconPause.style.display = "none";
  } else {
    audio.play();
    isPlaying = true;
    iconPlay.style.display  = "none";
    iconPause.style.display = "";
  }
}

// ── Go to previous song ──
function prevSong() {
  currentIndex = currentIndex - 1;
  if (currentIndex < 0) {
    currentIndex = songs.length - 1;
  }
  loadSong(currentIndex);
  if (isPlaying) audio.play();
}

// ── Go to next song ──
function nextSong() {
  currentIndex = currentIndex + 1;
  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }
  loadSong(currentIndex);
  if (isPlaying) audio.play();
}

// ── Update progress bar as audio plays ──
function updateProgress() {
  if (audio.duration) {
    var percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
    currentTime.textContent = formatTime(audio.currentTime);
    totalTime.textContent   = formatTime(audio.duration);
  }
}

// ── Seek when user drags the progress bar ──
function seekSong() {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
}

// ── Change volume ──
function changeVolume() {
  audio.volume = volumeBar.value / 100;
}

// ── Auto-advance when song ends ──
function onSongEnd() {
  nextSong();
}

// ── Event Listeners ──
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
progressBar.addEventListener("input", seekSong);
volumeBar.addEventListener("input", changeVolume);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", onSongEnd);

// ── Init ──
audio.volume = volumeBar.value / 100;
loadSong(currentIndex);
