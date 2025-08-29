// file: showHargaItem.js
import { kirimPesan } from "./xmppHelper.js";
import { showToast } from "./utils.js";
import { showModalConfirm } from "./modal.js";  // ✅ ambil dari file baru

const extraButtons = document.getElementById("extraButtons");
const inputTujuan = document.getElementById("inputTujuan");

export function showHargaItem(responseText) {
    extraButtons.innerHTML = "";
    extraButtons.style.display = "block";
    extraButtons.className = "harga-list";

    const lines = responseText.split("\n").map(l => l.trim()).filter(l => l);
    let headerAdded = false; // flag header

    lines.forEach(line => {
        const parts = line.split("=");
        if (parts.length >= 3) {
            const kode = parts[0].trim();
            const deskripsi = parts[1].trim();
            let harga = parts[2].replace(";", "").trim();

            // ➤ Skip jika harga mengandung [K] atau [G]
            if (/\[K\]|\[G\]/.test(harga)) return;

            // ➤ Skip jika harga bukan angka
            if (!/^\d+([.,]\d+)?$/.test(harga)) return;

            // Tambahkan header hanya sekali sebelum item pertama
            if (!headerAdded) {
                const headerDiv = document.createElement("div");
                headerDiv.className = "menu-item harga-item header-item";
                headerDiv.style.display = "flex";
                headerDiv.style.justifyContent = "space-between";
                headerDiv.style.alignItems = "center";
                headerDiv.style.padding = "0.5rem 1rem";
                headerDiv.style.borderBottom = "1px solid #ccc";

                headerDiv.innerHTML = `
                <span style="font-weight:bold; color:var(--pico-primary); min-width:50px;">Kode</span>
                <span style="flex:1; margin-left:1rem; margin-right:1rem; font-weight:bold;">Deskripsi</span>
                <span style="font-weight:bold; color:var(--pico-success); min-width:60px; text-align:right;">Harga</span>
            `;
                extraButtons.appendChild(headerDiv);
                headerAdded = true;
            }

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
                const pesanKonfirmasi = `
                <table class="detail-table-laporan-modal">
                    <tr><td>Kode Produk</td><td>${kode}</td></tr>
                    <tr><td>Deskripsi Produk</td><td>${deskripsi}</td></tr>
                    <tr><td>Harga Modal</td><td>Rp${harga}</td></tr>
                    <tr><td>Nomor Tujuan</td><td>${nomor}</td></tr>
                </table>
                <div style="font-weight:bold; color:red; text-align:center;">
                    Pastikan Saldo Anda Mencukupi!
                </div>`;

                showModalConfirm("KONFIRMASI TRANSAKSI",
                    pesanKonfirmasi, () => {
                        kirimPesan(`${kode}.${nomor}`);
                        kirimPesan("S");
                    }, () => {
                        showToast("Transaksi dibatalkan", "error");
                    });
            });

            extraButtons.appendChild(div);
        }
    });

}
