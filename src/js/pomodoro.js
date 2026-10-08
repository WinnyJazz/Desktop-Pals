const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

let totalSeconds = 25 * 60;
let timer = null;
let isRunning = false;


minutesDisplay.addEventListener("click", function () {

    // Jangan ubah waktu ketika timer sedang berjalan
    if (isRunning) {
        return;
    }

    const currentMinutes = Math.floor(totalSeconds / 60);

    const newMinutes = prompt(
        "Mau berapa menit?",
        currentMinutes
    );

    // Kalau user menekan Cancel
    if (newMinutes === null) {
        return;
    }

    const minutes = parseInt(newMinutes);

    // Cek apakah input valid
    if (isNaN(minutes) || minutes < 1) {
        alert("Masukkan angka menit yang valid!");
        return;
    }

    totalSeconds = minutes * 60;

    updateDisplay();
});

startBtn.addEventListener("click", function () {

    // Jangan membuat timer baru kalau sudah berjalan
    if (isRunning) {
        return;
    }

    isRunning = true;

    timer = setInterval(function () {

        if (totalSeconds <= 0) {

            clearInterval(timer);
            isRunning = false;

            alert("Time's up!");

            return;
        }

        totalSeconds--;

        updateDisplay();

    }, 1000);
});


pauseBtn.addEventListener("click", function () {

    if (!isRunning) {
        return;
    }

    clearInterval(timer);

    isRunning = false;
});


function updateDisplay() {

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
}
