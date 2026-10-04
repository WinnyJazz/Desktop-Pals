let player;

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

let currentTrack = 0;

const lofiButtons = document.querySelectorAll(".lofi-button");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const sidebar = document.getElementById("sidebar");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const volumeSlider = document.getElementById("volumeSlider");
const volumeLevel = document.getElementById("volumeLevel");

window.onYouTubeIframeAPIReady = function () {
    console.log("YouTube API berhasil dipanggil");

    player = new YT.Player("youtubePlayer", {
        height: "180",
        width: "320",
        videoId: lofiTracks[0].youtubeId,
        playerVars: {
            playsinline: 1,
            controls: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    console.log("YouTube Player sudah READY");

    event.target.unMute();
    event.target.setVolume(70);

    if (volumeLevel) {
        volumeLevel.style.width = "70%";
    }
}

function onPlayerStateChange(event) {
    console.log("Player state:", event.data);

    if (event.data === YT.PlayerState.PLAYING) {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    } else if (event.data === YT.PlayerState.PAUSED) {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    } else if (event.data === YT.PlayerState.ENDED) {
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
    if (!player) {
        console.log("Player belum siap");
        return;
    }

    const playerState = player.getPlayerState();

    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.unMute();
        player.setVolume(70);
        player.playVideo();
    }
});

function loadTrack(index) {
    if (!player) {
        console.log("Player belum siap");
        return;
    }

    currentTrack = index;

    const track = lofiTracks[currentTrack];

    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    player.loadVideoById(track.youtubeId);
}

lofiButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const index = Number(button.dataset.index);

        loadTrack(index);
    });
});

function nextTrack() {
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
    currentTrack--;

    if (currentTrack < 0) {
        currentTrack = lofiTracks.length - 1;
    }

    loadTrack(currentTrack);
}

previousButton.addEventListener("click", () => {
    previousTrack();
});

volumeSlider.addEventListener("click", (event) => {
    if (!player) {
        return;
    }

    const rect = volumeSlider.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;
    const volume = Math.max(0, Math.min(100, percentage));

    console.log("Volume:", volume);

    player.unMute();
    player.setVolume(volume);

    volumeLevel.style.width = volume + "%";
});