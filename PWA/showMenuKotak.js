import { onMessage } from "./xmppHelper.js";
import { showPulsaOptions } from "./pulsa.js";
import { showPaketDataOptions } from "./paketData.js";
import { showPaketNelponOptions } from "./paketNelpon.js";
import { showTokenOptions } from "./tokenListrik.js";
import { showHargaItem } from "./showHargaItem.js";
import { showToast } from "./utils.js";
import { inputTujuan, operatorDisplay, extraButtons } from "./inputHandler.js";

const menuGrid = document.getElementById("menuGrid");

export const menuHandler = onMessage((responseText) => {
    showHargaItem(responseText);
});

export function showMenuKotak() {
    const menus = [
        { name: "Pulsa", emoji: "📱" },
        { name: "Paket Data", emoji: "🌐" },
        { name: "Paket Nelpon & SMS", emoji: "📞" },
        { name: "Token Listrik", emoji: "⚡" },
        { name: "E-Wallet", emoji: "💳" },
        { name: "Bayar Listrik", emoji: "💡" },
        { name: "Bayar BPJS", emoji: "🏥" },
        { name: "Bayar IndiHome", emoji: "📺" },
        { name: "Voucher TV", emoji: "🎟️" }
    ];

    if (menuGrid) {
        menuGrid.innerHTML = "";

        menus.forEach(menu => {
            const div = document.createElement("div");
            div.className = "menu-item";
            div.style.display = "flex";
            div.style.flexDirection = "column";
            div.style.alignItems = "center";
            div.style.cursor = "pointer";

            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = menu.emoji;
            emojiSpan.style.fontSize = "2rem";
            emojiSpan.style.marginBottom = "0.5rem";

            const p = document.createElement("p");
            p.textContent = menu.name;
            p.style.margin = "0";

            div.appendChild(emojiSpan);
            div.appendChild(p);
            menuGrid.appendChild(div);

            div.addEventListener("click", () => handleMenuClick(menu));
        });
    }
}

// ----------------------
// Event handler: Menu
// ----------------------
export function handleMenuClick(menu) {
    if (!inputTujuan.value.trim()) {
        showToast("Masukkan nomor tujuan terlebih dahulu", "error");
        inputTujuan.focus();
        return;
    }

    extraButtons.innerHTML = "";
    const operator = operatorDisplay.textContent;

    if (menu.name === "Pulsa") {
        showPulsaOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Paket Data") {
        showPaketDataOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Paket Nelpon & SMS") {
        showPaketNelponOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Token Listrik") {
        showTokenOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "E-Wallet") {
        showWalletOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Bayar Listrik") {
        showBayarListrikOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Bayar BPJS") {
        showBayarBPJSOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Bayar IndiHome") {
        showBayarIndiHomeOptions(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Voucher TV") {
        showVoucherTV(extraButtons, operatorDisplay, operator);
    } else {
        showToast("Menu belum siap", "error");
    }
}
