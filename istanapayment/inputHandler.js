// file inputHandler.js
const inputTujuan = document.getElementById("inputTujuan");
const operatorDisplay = document.getElementById("operatorDisplay");
const extraButtons = document.getElementById("extraButtons");
const clearInput = document.getElementById("clearInput"); // tambahkan ini

// daftar prefix operator
const operatorPrefix = {
    "Telkomsel": ["0811", "0812", "0813", "0851", "0852", "0853", "0821", "0822", "0823", "0824"],
    "Indosat": ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
    "Axis": ["083", "0859"],
    "By.U": ["085155", "085156", "085157", "085158", "085154", "085159", "08512"],
    "Token Listrik": ["01", "04", "05", "06", "07", "09", "1", "2", "3", "4", "5", "6", "7", "8", "9", "001", "020", "03"],
    "Smartfren": ["088"],
    "Tri": ["089"],
    "XL": ["0817", "0818", "0819", "0859", "0878", "0877"]
};

// ----------------------
// Fungsi deteksi operator
// ----------------------
function detectOperator(number) {
    let foundOperator = "";

    // cek prefix dari yang terpanjang agar lebih spesifik (contoh: 085155 > 0851)
    const sortedOperators = Object.entries(operatorPrefix).sort((a, b) => {
        const maxA = Math.max(...a[1].map(p => p.length));
        const maxB = Math.max(...b[1].map(p => p.length));
        return maxB - maxA;
    });

    for (let [operator, prefixes] of sortedOperators) {
        for (let prefix of prefixes) {
            if (number.startsWith(prefix)) {
                return operator;
            }
        }
    }
    return foundOperator;
}

// ----------------------
// Event handler input
// ----------------------
export function handleInputChange() {
    const nomor = inputTujuan.value.trim();

    if (!nomor) {
        operatorDisplay.textContent = "";
        extraButtons.innerHTML = "";
        return;
    }

    const operator = detectOperator(nomor);

    // kalau operator "Token Listrik", jangan tampilkan
    if (operator === "Token Listrik") {
        operatorDisplay.textContent = "";
    } else {
        operatorDisplay.textContent = operator || "";
    }

    extraButtons.innerHTML = "";
}


// aktifkan event listener
inputTujuan.addEventListener("input", () => {
    handleInputChange();
    toggleClearBtn();
});

function toggleClearBtn() {
    clearInput.style.display = inputTujuan.value ? "block" : "none";
}

clearInput.addEventListener("click", () => {
    inputTujuan.value = "";
    handleInputChange();
    toggleClearBtn();
    inputTujuan.focus(); // balikkan fokus ke input
});

// inisialisasi awal
toggleClearBtn();

// ----------------------
// Ekspor supaya bisa dipakai di file lain
// ----------------------
export { inputTujuan, operatorDisplay, extraButtons, detectOperator };
