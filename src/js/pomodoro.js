const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const defaultMinutes = 25;

let totalSeconds = defaultMinutes * 60;
let timer = null;
let isRunning = false;

minutesDisplay.addEventListener("click", function () {

    // Tidak bisa edit saat timer berjalan
    if (isRunning) {
        return;
    }

    // Buat input
    const input = document.createElement("input");

    input.type = "number";
    input.min = "1";
    input.value = Math.floor(totalSeconds / 60);

    // Bootstrap styling
    input.className = "form-control text-center mx-auto";

    // Atur ukuran input
    input.style.width = "150px";
    input.style.fontSize = "2.5rem";

    // Ganti h3 dengan input
    minutesDisplay.replaceWith(input);

    // Langsung fokus ke input
    input.focus();

    // Select angka yang ada
    input.select();

    function saveTime() {

        const minutes = parseInt(input.value);

        // Validasi
        if (isNaN(minutes) || minutes < 1) {

            alert("Masukkan angka menit yang valid!");

            input.focus();

            return;
        }

        totalSeconds = minutes * 60;

        // Kembalikan input menjadi h3
        input.replaceWith(minutesDisplay);

        updateDisplay();
    }


    // Enter untuk menyimpan
    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            saveTime();
        }

        // Escape untuk membatalkan
        if (event.key === "Escape") {
            input.replaceWith(minutesDisplay);
            updateDisplay();
        }
    });


    // Klik di luar input untuk menyimpan
    input.addEventListener("blur", function () {

        saveTime();

    });

});

startBtn.addEventListener("click", function () {

    // Jangan start kalau sudah berjalan
    if (isRunning) {
        return;
    }

    // Jangan start kalau timer sudah habis
    if (totalSeconds <= 0) {
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


resetBtn.addEventListener("click", function () {

    // Hentikan timer
    clearInterval(timer);

    // Timer tidak berjalan
    isRunning = false;

    // Kembali ke 25 menit
    totalSeconds = defaultMinutes * 60;

    // Update tampilan
    updateDisplay();

});


function updateDisplay() {

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;


    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    minutesDisplay.textContent =
        String(minutes).padStart(2, "0");

    secondsDisplay.textContent =
        String(seconds).padStart(2, "0");
}


updateDisplay();
