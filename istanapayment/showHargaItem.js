import { kirimPesan } from "./xmppHelper.js";
import { showToast } from "./utils.js";
import { showModalConfirmBuy } from "./modal.js";  // ✅ ambil dari file baru

const extraButtons = document.getElementById("extraButtons");
const inputTujuan = document.getElementById("inputTujuan");

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
                const pesanKonfirmasi = `
                    <table class="detail-table-laporan-modal">
                        <tr><td>Kode Produk</td><td>${kode}</td></tr>
                        <tr><td>Deskripsi Produk</td><td>${deskripsi}</td></tr>
                        <tr><td>Harga</td><td>Rp${harga}</td></tr>
                        <tr><td>Nomor Tujuan</td><td>${nomor}</td></tr>
                    </table>
                    <div style="font-weight:bold; color:red; text-align:center;">
                        Pastikan Saldo Anda Mencukupi!
                    </div>`;

                showModalConfirmBuy(pesanKonfirmasi, () => {
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
