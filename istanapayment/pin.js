//file pin.js
const pinOverlay = document.getElementById("pinOverlay");
const pinMessage = document.getElementById("pinMessage");
const circles = document.querySelectorAll(".pinCircle");
const buttons = document.querySelectorAll(".pinPad button");
const backBtn = document.getElementById("pinBack");

let pinInput = "";
let pinStep = "check"; // "check", "set", "confirm"
let tempPin = "";

// ✅ fungsi untuk ambil PIN terbaru dari localStorage
function getStoredPin() {
    return localStorage.getItem("appPin");
}

// Set pesan awal sesuai kondisi terbaru
if (!getStoredPin()) {
    pinStep = "set";
    pinMessage.textContent = "Buat PIN 6 digit";
} else {
    pinStep = "check";
    pinMessage.textContent = "Masukkan PIN Anda";
}

// update tampilan lingkaran
function updateCircles() {
    circles.forEach((c, i) => {
        c.classList.toggle("filled", i < pinInput.length);
    });
}

// reset input
function resetPinInput() {
    pinInput = "";
    updateCircles();
}

function fadeOutOverlay(callback) {
    pinOverlay.classList.add("fade-out");

    // tunggu animasi selesai sebelum menjalankan callback
    pinOverlay.addEventListener("animationend", () => {
        pinOverlay.style.display = "none"; // sembunyikan overlay
        document.querySelector("main.container").style.display = "block";
        if (callback) callback();
    }, { once: true });
}


// cek PIN
export function checkPin() {
    animateButtons()
    if (pinInput.length !== 6) return; // ❌ jangan cek jika belum 6 digit

    const storedPin = getStoredPin(); // ambil terbaru
    if (!storedPin) return; // aman jika PIN belum ada
    if (btoa(pinInput) === storedPin) {
        fadeOutOverlay(); // <-- panggil animasi fade-out
        // pinOverlay.style.display = "none";
        // document.querySelector("main.container").style.display = "block";
    } else {
        pinMessage.textContent = "PIN salah, coba lagi";
        shakeMessage(); // <-- getar
        resetPinInput();
    }
}

function shakeMessage() {
    pinMessage.classList.remove("shake"); // reset jika sebelumnya sudah ada
    void pinMessage.offsetWidth; // trigger reflow agar animasi bisa diulang
    pinMessage.classList.add("shake");
}

function animateButtons() {
    buttons.forEach((btn, index) => {
        btn.style.animationDelay = `${index * 0.1}s`; // 0.1s per tombol
        btn.classList.remove("animated"); // reset jika sebelumnya
        void btn.offsetWidth; // trigger reflow
        btn.classList.add("animated"); // menambahkan kelas supaya animasi dijalankan
    });
}

// Panggil ini saat overlay PIN ditampilkan



// tombol diklik
buttons.forEach(btn => {
    if (btn.id === "pinBack") return;
    btn.addEventListener("click", () => {
        if (pinInput.length < 6) {
            pinInput += btn.textContent;
            updateCircles();

            if (pinInput.length === 6) {
                setTimeout(() => {
                    if (pinStep === "check") {
                        checkPin();
                    } else if (pinStep === "set") {
                        tempPin = pinInput;
                        pinStep = "confirm";
                        pinMessage.textContent = "Konfirmasi PIN 6 digit";
                        resetPinInput();
                    } else if (pinStep === "confirm") {
                        if (pinInput === tempPin) {
                            localStorage.setItem("appPin", btoa(pinInput));
                            pinMessage.textContent = "PIN berhasil dibuat!";
                            setTimeout(() => {
                                fadeOutOverlay(); // <-- panggil animasi fade-out
                                // pinOverlay.style.display = "none";
                                // document.querySelector("main.container").style.display = "block";
                            }, 2000);
                        } else {
                            pinMessage.textContent = "PIN tidak cocok, coba lagi";
                            pinStep = "set";
                            shakeMessage(); // <-- getar
                            resetPinInput();
                        }
                    }
                }, 200);
            }
        }
    });
});

backBtn.addEventListener("click", () => {
    pinInput = pinInput.slice(0, -1);
    updateCircles();
});
