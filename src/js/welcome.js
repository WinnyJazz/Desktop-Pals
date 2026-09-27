// deklarasi variabel/element yang mau dikasih logic
const cat = document.getElementById("miaw");

let isFirstImage = true;

setInterval(function() {

    if (isFirstImage) {
        cat.src = "../Assets/welcomecat2.png";
        cat.classList.add("cat2");
        isFirstImage = false;
        
    } else {
        cat.src = "../Assets/welcomecat.png";
        cat.classList.remove("cat2");
        isFirstImage = true;
    }

}, 800);

const button = document.getElementById("welcome-button");

button.addEventListener("click", () => {
    window.location.href = "pals.html"
})

