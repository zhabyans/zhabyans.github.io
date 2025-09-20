import { onMessage } from "./xmppHelper.js";
import { inputTujuan, operatorDisplay, extraButtons } from "./inputHandler.js";
import { showHargaItem } from "./showHargaItem.js";
import { showToast } from "./utils.js";
import { menuPulsa } from "./menuPulsa.js";
import { menuPaketData } from "./menuPaketData.js";
import { menuPaketNelpon } from "./menuPaketNelpon.js";
import { menuTokenListrik } from "./menuTokenListrik.js";
import { menuEwallet } from "./menuEwallet.js";
import { menuGames } from "./menuGames.js";
import { menuPaketTv } from "./menuPaketTv.js";
import { menuBayarListrik } from "./menuBayarListrik.js";
import { menuBayarBpjs } from "./menuBayarBpjs.js";
import { menuBayarIndihome } from "./menuBayarIndihome.js";

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
        { name: "Games", emoji: "🎮" },
        { name: "Paket TV", emoji: "📺" },
        { name: "Bayar Listrik", emoji: "💡" },
        { name: "Bayar BPJS", emoji: "🏥" },
        { name: "Bayar IndiHome", emoji: "📡" }
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
        menuPulsa(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Paket Data") {
        menuPaketData(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Paket Nelpon & SMS") {
        menuPaketNelpon(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Token Listrik") {
        menuTokenListrik(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "E-Wallet") {
        menuEwallet(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Games") {
        menuGames(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Paket TV") {
        menuPaketTv(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Bayar Listrik") {
        menuBayarListrik(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Bayar BPJS") {
        menuBayarBpjs(extraButtons, operatorDisplay, operator);
    } else if (menu.name === "Bayar IndiHome") {
        menuBayarIndihome(extraButtons, operatorDisplay, operator);
    } else {
        showToast("Menu belum siap", "error");
    }

    // ⬇️ Scroll otomatis ke atas homeDisplay
    const homeDisplay = document.getElementById("homeDisplay");
    if (homeDisplay) {
        homeDisplay.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
