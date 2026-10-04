let player;
let playerReady = false;
let currentTrack = 0;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
        youtubeId: "0UN_HbOTTcI"
    }
];

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

    player = new YT.Player("youtubePlayer", {
        height: "180",
        width: "320",
        videoId: lofiTracks[currentTrack].youtubeId,

        playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
        },

        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log("YouTube Player sudah READY");

    playerReady = true;

    event.target.unMute();
    event.target.setVolume(70);

    updateTrackInfo();
    updateVolumeUI(70);
    updateTime();
}

function onPlayerStateChange(event) {
    console.log("Player state:", event.data);

    if (event.data === YT.PlayerState.PLAYING) {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    }

    else if (event.data === YT.PlayerState.PAUSED) {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    }

    else if (event.data === YT.PlayerState.ENDED) {
        nextTrack();
    }
}

menuButton.addEventListener("click", () => {
    sidebar.classList.add("active");
    menuButton.style.display = "none";
});

closeButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
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
        player.unMute();
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

    trackTitle.textContent = track.title;

    player.loadVideoById({
        videoId: track.youtubeId,
        startSeconds: 0
    });

    player.unMute();
    player.setVolume(getCurrentVolume());

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

function getCurrentVolume() {
    if (!playerReady || !player) {
        return 70;
    }

    return player.isMuted() ? 0 : player.getVolume();
}

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

    if (percentage === 0) {
        player.mute();
    } else {
        player.unMute();
        player.setVolume(percentage);
    }

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