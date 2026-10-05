let player;
let playerReady = false;
let currentTrack = 0;

// Volume disimpan sendiri, jangan bergantung ke player.getVolume()
let currentVolume = 70;
let isMutedByUser = false;
let errorCount = 0;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Bisa paste link YouTube utuh atau ID 11 karakter, otomatis dibersihkan
function extractVideoId(input) {
    const value = String(input).trim();

    if (/^[\w-]{11}$/.test(value)) {
        return value;
    }

    try {
        const url = new URL(value);

        if (url.hostname.includes("youtu.be")) {
            return url.pathname.slice(1, 12);
        }

        if (url.searchParams.get("v")) {
            return url.searchParams.get("v").slice(0, 11);
        }

        const match = url.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/);
        if (match) {
            return match[2];
        }
    } catch (error) {
        // bukan URL, lanjut ke fallback
    }

    return value.slice(0, 11);
}

const lofiTracks = [
    {
        title: "Pokemon Lofi",
        artist: "Pokemon Lofi",
        youtubeId: "6CjpgFOOtuI"
    },
    {
        title: "Persona Lofi",
        artist: "Persona Lofi",
        youtubeId: "aM9dxd2nRwE"
    },
    {
        title: "Hillsong Lofi",
        artist: "Hillsong Lofi",
        youtubeId: "5BYgBh5ejK4"
    },
    {
        title: "Zelda Lofi",
        artist: "Zelda Lofi",
        youtubeId: "Z3GA0GQCE2M"
    },
    {
        title: "LOCK IN PRO MAX",
        artist: "LOCK IN PRO MAX",
        youtubeId: "Q4z5Wonfou8"
    }
].map((track) => ({
    ...track,
    youtubeId: extractVideoId(track.youtubeId)
}));

const lofiButtons = document.querySelectorAll(".lofi-button");
const trackTitle = document.getElementById("trackTitle");

const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const sidebar = document.getElementById("sidebar");

const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");

const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

const volumeSlider = document.getElementById("volumeSlider");
const volumeLevel = document.getElementById("volumeLevel");

const progressBar = document.getElementById("progressBar");
const progress = document.getElementById("progress");
const progressHandle = document.getElementById("progressHandle");

const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("duration");

window.onYouTubeIframeAPIReady = function () {
    console.log("YouTube API berhasil dipanggil");

    const playerVars = {
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0
    };

    if (window.location.protocol.startsWith("http")) {
        playerVars.origin = window.location.origin;
    }

    player = new YT.Player("youtubePlayer", {
        height: "180",
        width: "320",
        videoId: lofiTracks[currentTrack].youtubeId,
        playerVars: playerVars,

        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError
        }
    });
};

function onPlayerError(event) {
    console.log("YOUTUBE ERROR CODE:", event.data, "| track:", lofiTracks[currentTrack].title);

    errorCount++;

    // Skip ke lagu berikutnya, tapi stop kalau semua lagu error (biar ga loop terus)
    if (errorCount < lofiTracks.length) {
        setTimeout(nextTrack, 500);
    } else {
        console.log("Semua track error, cek ID video-nya");
    }
}

function onPlayerReady(event) {
    console.log("YouTube Player sudah READY");

    playerReady = true;

    event.target.setVolume(currentVolume);

    updateTrackInfo();
    updateVolumeUI(currentVolume);
    updateTime();
}

function applyVolume() {
    if (!playerReady || !player) {
        return;
    }

    if (isMutedByUser || currentVolume === 0) {
        player.mute();
    } else {
        player.unMute();
        player.setVolume(currentVolume);
    }
}

function onPlayerStateChange(event) {
    console.log("Player state:", event.data);

    if (event.data === YT.PlayerState.PLAYING) {
        console.log("VIDEO PLAYING");

        errorCount = 0;
        applyVolume();

        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    }

    if (event.data === YT.PlayerState.PAUSED) {
        console.log("VIDEO PAUSED");

        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    }

    if (event.data === YT.PlayerState.ENDED) {
        console.log("VIDEO ENDED");
        nextTrack();
    }
}

menuButton.addEventListener("click", () => {
    sidebar.classList.add("active");
    document.body.classList.add("sidebar-open");
    menuButton.style.display = "none";
});

closeButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
    document.body.classList.remove("sidebar-open");
    menuButton.style.display = "block";
});

playButton.addEventListener("click", () => {
    if (!playerReady || !player) {
        console.log("Player belum siap");
        return;
    }

    const playerState = player.getPlayerState();

    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        applyVolume();
        player.playVideo();
    }
});

function loadTrack(index) {
    if (!playerReady || !player) {
        console.log("Player belum siap");
        return;
    }

    currentTrack = index;

    const track = lofiTracks[currentTrack];

    player.loadVideoById({
        videoId: track.youtubeId,
        startSeconds: 0
    });

    applyVolume();

    updateTrackInfo();
    resetProgress();
}

function updateTrackInfo() {
    const track = lofiTracks[currentTrack];

    trackTitle.textContent = track.title;
}

lofiButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const index = Number(button.dataset.index);

        loadTrack(index);

        sidebar.classList.remove("active");
        menuButton.style.display = "block";
    });
});

function nextTrack() {
    if (!playerReady) {
        return;
    }

    currentTrack++;

    if (currentTrack >= lofiTracks.length) {
        currentTrack = 0;
    }

    loadTrack(currentTrack);
}

nextButton.addEventListener("click", () => {
    nextTrack();
});

function previousTrack() {
    if (!playerReady) {
        return;
    }

    currentTrack--;

    if (currentTrack < 0) {
        currentTrack = lofiTracks.length - 1;
    }

    loadTrack(currentTrack);
}

previousButton.addEventListener("click", () => {
    previousTrack();
});

function updateVolumeUI(volume) {
    if (!volumeLevel) {
        return;
    }

    volumeLevel.style.width = volume + "%";
}

volumeSlider.addEventListener("click", (event) => {
    if (!playerReady || !player) {
        return;
    }

    const rect = volumeSlider.getBoundingClientRect();

    const clickPosition = event.clientX - rect.left;

    let percentage = (clickPosition / rect.width) * 100;

    percentage = Math.max(0, Math.min(100, percentage));

    currentVolume = percentage;
    isMutedByUser = percentage === 0;

    applyVolume();
    updateVolumeUI(percentage);
});

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

function updateTime() {
    if (!playerReady || !player) {
        return;
    }

    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();

    if (duration > 0) {
        const percentage = (currentTime / duration) * 100;

        progress.style.width = percentage + "%";
        progressHandle.style.left = percentage + "%";

        currentTimeElement.textContent = formatTime(currentTime);
        durationElement.textContent = formatTime(duration);
    }

    requestAnimationFrame(updateTime);
}

function resetProgress() {
    progress.style.width = "0%";
    progressHandle.style.left = "0%";

    currentTimeElement.textContent = "0:00";
    durationElement.textContent = "0:00";
}

progressBar.addEventListener("click", (event) => {
    if (!playerReady || !player) {
        return;
    }

    const duration = player.getDuration();

    if (!duration) {
        return;
    }

    const rect = progressBar.getBoundingClientRect();

    const clickPosition = event.clientX - rect.left;

    let percentage = clickPosition / rect.width;

    percentage = Math.max(0, Math.min(1, percentage));

    const newTime = duration * percentage;

    player.seekTo(newTime, true);
});