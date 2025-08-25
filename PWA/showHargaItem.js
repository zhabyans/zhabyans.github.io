import { kirimPesan } from "./xmppHelper.js";
import { showToast } from "./utils.js"; // bisa gabungkan toast di utils.js

const extraButtons = document.getElementById("extraButtons");
const inputTujuan = document.getElementById("inputTujuan");

/**
 * Tampilkan daftar harga dari response server
 * @param {string} responseText - teks dari server, format: kode=deskripsi=harga
 */
export function showHargaItem(responseText) {
    extraButtons.innerHTML = "";
    extraButtons.style.display = "block";
    extraButtons.className = "harga-list";

    const lines = responseText.split("\n").map(l => l.trim()).filter(l => l);

    lines.forEach(line => {
        const parts = line.split("=");
        if (parts.length >= 3) {
            const kode = parts[0].trim();
            const deskripsi = parts[1].trim();
            const harga = parts[2].replace(";", "").trim();

            const div = document.createElement("div");
            div.className = "menu-item harga-item";
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.padding = "0.5rem 1rem";

            div.innerHTML = `
                <span style="font-weight:bold; color:var(--pico-primary); min-width:50px;">${kode}</span>
                <span style="flex:1; margin-left:1rem; margin-right:1rem;">${deskripsi}</span>
                <span style="font-weight:bold; color:var(--pico-success); min-width:60px; text-align:right;">Rp${harga}</span>
            `;

            div.addEventListener("click", () => {
                const nomor = inputTujuan.value;
                const pesanKonfirmasi = `Apakah Anda Yakin Membeli ${deskripsi} seharga Rp${harga} ke nomor ${nomor}?\n\nPastikan saldo mencukupi!`;
                document.getElementById("modalMessage").textContent = pesanKonfirmasi;

                showModal(pesanKonfirmasi, () => {
                    kirimPesan(`${kode}.${nomor}`);
                    kirimPesan("S");
                    showToast("Pembelian sedang diproses, Silakan klik Cek Transaksi", "success");
                }, () => {
                    showToast("Pembelian dibatalkan", "error");
                });
            });


            extraButtons.appendChild(div);
        }
    });
}

function showModal(message, onConfirm, onCancel) {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalMessage = document.getElementById("modalMessage");
    const modalOk = document.getElementById("modalOk");
    const modalCancel = document.getElementById("modalCancel");

    modalMessage.textContent = message;
    modalOverlay.style.display = "flex";

    // bersihkan listener lama
    modalOk.onclick = null;
    modalCancel.onclick = null;

    modalOk.onclick = () => {
        modalOverlay.style.display = "none";
        if (onConfirm) onConfirm();
    };

    modalCancel.onclick = () => {
        modalOverlay.style.display = "none";
        if (onCancel) onCancel();
    };
}
