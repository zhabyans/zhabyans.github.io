import { onMessage } from "./xmppHelper.js";
import { showPulsaOptions } from "./pulsa.js";
import { showPaketDataOptions } from "./paketData.js";
import { showHargaItem } from "./showHargaItem.js";
import { showToast } from "./utils.js";

export const menuHandler = onMessage((responseText) => {
    showHargaItem(responseText);
});

export function showMenuKotak() {
    const menus = [
        { name: "Pulsa", emoji: "📱" },
        { name: "Paket Data", emoji: "🌐" },
        { name: "Paket Nelpon", emoji: "📞" },
        { name: "Token Listrik", emoji: "⚡" },
        { name: "E-Wallet", emoji: "💳" },
        { name: "Listrik Pascabayar", emoji: "💡" },
        { name: "Bayar BPJS", emoji: "🏥" },
        { name: "Bayar IndiHome", emoji: "📺" },
        { name: "Voucher TV", emoji: "🎟️" }
    ];

    if (menuGrid) {
        menuGrid.innerHTML = ""; // kosongkan dulu

        menus.forEach(menu => {
            const div = document.createElement("div");
            div.className = "menu-item";
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.style.alignItems = "center";
            div.style.cursor = "pointer";

            // emoji
            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = menu.emoji;
            emojiSpan.style.fontSize = "2rem";
            emojiSpan.style.marginBottom = "0.5rem";

            // label
            const p = document.createElement("p");
            p.textContent = menu.name;
            p.style.margin = "0";

            div.appendChild(emojiSpan);
            div.appendChild(p);
            menuGrid.appendChild(div);

            // attach handler
            div.addEventListener("click", () => handleMenuClick(menu, inputTujuan, extraButtons, operatorDisplay));
        });
    }
}



//tampilan nama operator
const inputTujuan = document.getElementById("inputTujuan");
const operatorDisplay = document.getElementById("operatorDisplay");
const extraButtons = document.getElementById("extraButtons");
const menuGrid = document.getElementById("menuGrid");

// daftar prefix
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

// fungsi deteksi operator
function detectOperator(number) {
    let foundOperator = "";

    // urutkan prefix berdasarkan panjang (biar yang lebih spesifik dicek dulu, misalnya 085155 > 0851)
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
// LISTENER INPUT
// ----------------------
inputTujuan.addEventListener("input", handleInputChange);

// ----------------------
// EVENT HANDLER: INPUT
// ----------------------
function handleInputChange() {
    const nomor = inputTujuan.value.trim();

    if (!nomor) {
        operatorDisplay.textContent = "";
        extraButtons.innerHTML = "";
        return;
    }

    // gunakan fungsi detectOperator
    const operator = detectOperator(nomor) || "Unknown";

    operatorDisplay.textContent = operator;
    extraButtons.innerHTML = "";
}


// ----------------------
// EVENT HANDLER: MENU
// ----------------------
export function handleMenuClick(menu, inputTujuan, extraButtons, operatorDisplay) {
    if (!inputTujuan.value.trim()) {
        showToast("Masukkan nomor tujuan terlebih dahulu", "error");
        inputTujuan.focus();
        return;
    }

    // clear tombol sebelumnya
    extraButtons.innerHTML = "";

    const operator = operatorDisplay.textContent;

    if (menu.name === "Pulsa") {
        showPulsaOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Paket Data") {
        showPaketDataOptions(extraButtons, operatorDisplay, operator);
    } else {
        alert("Klik menu: " + menu.name);
    }
}
