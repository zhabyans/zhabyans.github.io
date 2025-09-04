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

// cek PIN
export function checkPin() {
    if (pinInput.length !== 6) return; // ❌ jangan cek jika belum 6 digit

    const storedPin = getStoredPin(); // ambil terbaru
    if (!storedPin) return; // aman jika PIN belum ada
    if (btoa(pinInput) === storedPin) {
        pinOverlay.style.display = "none";
        document.querySelector("main.container").style.display = "block";
    } else {
        pinMessage.textContent = "PIN salah, coba lagi";
        resetPinInput();
    }
}


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
                                pinOverlay.style.display = "none";
                                document.querySelector("main.container").style.display = "block";
                            }, 2000);
                        } else {
                            pinMessage.textContent = "PIN tidak cocok, coba lagi";
                            pinStep = "set";
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
