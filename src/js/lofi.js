const menuButton = document.getElementById("menuButton");
const closeButton = document.getElementById("closeButton");
const sidebar = document.getElementById("sidebar");

const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");

menuButton.addEventListener("click", () => {
    sidebar.classList.add("active");
    menuButton.style.display = "none";
});

closeButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
    menuButton.style.display = "block";
});

playButton.addEventListener("click", () => {
    if (playIcon.classList.contains("fa-play")) {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    } else {
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    }
});

