// file: shareStruk.js
import { showToast } from "./utils.js";

export async function shareStruk(parsed, tanggal, hargaJual) {
    try {
        let jenisProduk = "PRODUK DIGITAL";

        if (/^pln/i.test(parsed.kode)) {
            jenisProduk = "TAGIHAN LISTRIK PASCABAYAR";
        } else if (/^p/i.test(parsed.kode)) {
            jenisProduk = "TOKEN LISTRIK";
        } else if (/^td/i.test(parsed.kode)) {
            jenisProduk = "PAKET DATA";
        } else if (/^tr/i.test(parsed.kode)) {
            jenisProduk = "PULSA TRI";
        } else if (/^i/i.test(parsed.kode)) {
            jenisProduk = "PULSA INDOSAT";
        } else if (/^s/i.test(parsed.kode)) {
            jenisProduk = "PULSA SMARTFREN";
        } else if (/^x/i.test(parsed.kode)) {
            jenisProduk = "PULSA XL";
        } else if (/^a/i.test(parsed.kode)) {
            jenisProduk = "PULSA AXIS";
        } else if (/^t(?!d)/i.test(parsed.kode)) {
            jenisProduk = "PULSA TELKOMSEL";
        }

        // harga jual dari mapping, fallback ke harga modal
        const harga = hargaJual;

        // Admin hanya untuk PLN Pascabayar
        const admin = /^pln/i.test(parsed.kode) ? 3000 : 0;
        const total = hargaJual + admin;

        const namaAgen = localStorage.getItem("nama_agen") || "";

        const fontSize = 20;
        const textWidth = namaAgen.length * (fontSize * 0.6);

        // hitung diagonal tapi kurangi buffer agar tile lebih rapat
        const diagonal = Math.sqrt(textWidth ** 2 + (fontSize * 2) ** 2);
        const tileSize = Math.ceil(diagonal) - 0; // 🔹 buffer kecil saja

        const cx = tileSize / 2;
        const cy = tileSize / 2;

        const watermarkSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}">
  <g transform="rotate(-45, ${cx}, ${cy})">
    <!-- teks watermark -->
    <text x="10" y="${cy}" font-size="${fontSize}" font-family="monospace"
          fill="black" fill-opacity="0.2">
      ${namaAgen}
    </text>
  </g>
</svg>`;

        const encoded = encodeURIComponent(watermarkSVG);

        // Container temp
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = `
          <div class="struk" style="
                font-family: monospace;
                font-weight: bold;
                font-size: 18px;
                width: 450px;
                color: #000;
                background: #fff url('data:image/svg+xml,${encoded}') repeat;
                background-size: ${tileSize * 0.6}px ${tileSize * 0.6}px; /* 🔹 scale down 80% */
          ">
              <div style="text-align:center; font-size: 26px">${namaAgen}</div>
              <div>${tanggal} ${parsed.waktu}</div>
              <div style="text-align:center; font-size: 22px">-- STRUK BUKTI PEMBELIAN --</div>
              <div style="text-align:center; font-size: 22px">${jenisProduk}</div>
              <hr style="border:2px dashed black; margin:5px 0;">
              <div>NOMOR : ${parsed.tujuan}</div>
              <div>KODE : ${parsed.kode}</div>
              <div>SN : ${parsed.sn}</div>
              <div style="text-align:center; margin-top:5px; margin-bottom:5px;">
                ------- RINCIAN PEMBAYARAN -------
              </div>
              <div>HARGA : Rp${harga.toLocaleString("id-ID")}</div>
              <div>ADMIN : Rp${admin.toLocaleString("id-ID")}</div>
              <div style="font-size: 18px">TOTAL HARGA : Rp${total.toLocaleString("id-ID")}</div>
              <hr style="border:2px dashed black; margin:5px 0;">
              <div style="text-align:center; font-size: 22px">SIMPANLAH STRUK INI</div>
              <div style="text-align:center; font-size: 22px">SEBAGAI BUKTI PEMBELIAN ANDA</div>
              <div style="text-align:center; font-size: 22px;">TERIMA KASIH</div>
          </div>
        `;
        document.body.appendChild(tempDiv);

        // 🔹 Generate gambar struk
        const canvas = await html2canvas(tempDiv.querySelector(".struk"), { scale: 2, backgroundColor: "#ffffff" });
        document.body.removeChild(tempDiv);

        const dataUrl = canvas.toDataURL("image/jpeg");
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "struk-transaksi.jpeg", { type: "image/jpeg" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: "Struk Transaksi",
                text: "Berikut struk transaksi Anda",
                files: [file],
            });
        } else if (navigator.share) {
            await navigator.share({
                title: "Struk Transaksi",
                text: `STRUK BUKTI PEMBELIAN
Jenis Produk : ${jenisProduk}
TGL: ${tanggal} ${parsed.waktu}
NOMOR : ${parsed.tujuan}
SERIAL NUMBER : ${parsed.sn}
HARGA : Rp${harga.toLocaleString("id-ID")}
ADMIN : Rp${admin.toLocaleString("id-ID")}
TOTAL : Rp${total.toLocaleString("id-ID")}
SIMPANLAH STRUK INI SEBAGAI BUKTI PEMBELIAN ANDA
TERIMA KASIH`,
            });
        } else {
            showToast("❌ Web Share API tidak didukung di browser ini.", "error");
        }
    } catch (err) {
        showToast("Gagal membagikan struk.", "error");
    }
}
