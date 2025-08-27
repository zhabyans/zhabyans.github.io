import { getLaporanTransaksi } from "./showLaporanTransaksi.js";

export function renderLaporanHeader(line, header, list) {
    // tandai laporan terbuka
    window.laporanTerbuka = true;

    if (header.hasChildNodes()) return; // sudah ada header → jangan render lagi

    // wrapper utama header
    const headerWrapper = document.createElement("div");
    headerWrapper.style.display = "flex";
    headerWrapper.style.flexDirection = "column";
    headerWrapper.style.alignItems = "center";
    headerWrapper.style.marginBottom = "0.5rem";

    // judul besar di atas
    const title = document.createElement("div");
    title.textContent = "Laporan Transaksi Hari Ini";
    title.style.fontWeight = "bold";
    title.style.fontSize = "1.1rem";
    title.style.marginBottom = "0.3rem";
    headerWrapper.appendChild(title);

    // baris tanggal + tombol kanan
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.width = "100%";

    const headerText = document.createElement("div");
    headerText.style.fontWeight = "bold";
    headerText.textContent = line;

    const btnGroup = document.createElement("div");
    btnGroup.style.display = "flex";
    btnGroup.style.gap = "0.3rem";

    const refreshBtn = document.createElement("button");
    refreshBtn.innerHTML = "🔄";
    refreshBtn.className = "outline";
    refreshBtn.style.fontSize = "1.6rem";  // ikon besar
    refreshBtn.style.padding = "0rem 0rem"; // tombol kecil
    refreshBtn.style.cursor = "pointer";
    refreshBtn.addEventListener("click", () => {
        refreshBtn.disabled = true;
        getLaporanTransaksi();
        setTimeout(() => {
            refreshBtn.disabled = false;
        }, 3000);
    });

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "❌";
    closeBtn.className = "outline";
    closeBtn.style.fontSize = "1.6rem"; // ikon besar
    closeBtn.style.padding = "0rem 0rem"; // tombol kecil
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => {
        header.innerHTML = "";
        list.innerHTML = "";
        laporanTransaksiDisplay.style.display = "none";
        window.laporanTerbuka = false; // tutup laporan
    });

    btnGroup.appendChild(refreshBtn);
    btnGroup.appendChild(closeBtn);

    row.appendChild(headerText);
    row.appendChild(btnGroup);

    headerWrapper.appendChild(row);
    header.appendChild(headerWrapper);
}
