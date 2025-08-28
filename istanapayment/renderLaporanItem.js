import { klikDetailLaporan } from "./klikDetailLaporan.js";

export function renderLaporanItem(parsed, list, tanggal) {
    if (!parsed || !list) return;

    const div = document.createElement("div");
    div.className = "laporan-item";
    div.style.display = "grid";
    div.style.gridTemplateColumns = "1fr auto";
    div.style.alignItems = "flex-start";
    div.style.padding = "0.25rem 0.5rem";
    div.style.borderBottom = "1px solid #ddd";
    div.style.gap = "0.5rem";
    div.style.fontSize = "0.85rem";

    // kiri
    const left = document.createElement("div");
    left.innerHTML = `
        <div><b>${parsed.kode}</b> → ${parsed.tujuan} → Rp.${parsed.harga}</div>
        <div>SN: ${parsed.sn}</div>
    `;

    // kanan
    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.flexDirection = "column";
    right.style.alignItems = "flex-end";
    right.style.whiteSpace = "nowrap";
    right.innerHTML = `
        <div style="font-weight:bold">${parsed.waktu}</div>
        <div>${parsed.status}</div>
    `;

    // warna status
    const statusText = parsed.status.toLowerCase();
    if (statusText.includes("sukses")) {
        div.classList.add("success");
    } else if (statusText.includes("gagal") || statusText.includes("timeout")) {
        div.classList.add("failed");
    } else {
        div.classList.add("proses");
    }


    div.appendChild(left);
    div.appendChild(right);
    list.appendChild(div);

    // === event klik untuk tampilkan modal detail ===
    div.addEventListener("click", () => klikDetailLaporan(parsed, tanggal));

}
