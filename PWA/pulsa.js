import { kirimPesan } from "./xmppHelper.js";
import { createButton, showToast } from "./utils.js"; // jika createButton ingin dipakai bersama

export function showPulsaOptions(extraButtons, operatorDisplay, operator) {
    if (!operator || operator === "Unknown") {
        showToast("Nomor Tujuan Tidak Dikenali untuk Pulsa");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    // contoh: Telkomsel ada 2 tombol khusus
    if (operator === "Telkomsel") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan("harga.t"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan("harga.tmat"))
        );
    } 
    else if (operator === "Indosat") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan("harga.i"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan("harga.tmai"))
        );
    } 
    else if (operator === "XL") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan("harga.x"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan("harga.tmax"))
        );
    } 
    else if (operator === "Axis") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan("harga.a"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan("harga.tmaa"))
        );
    } 
    else if (operator === "Tri") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan("harga.tr"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan("harga.tmatri"))
        );
    } 
    else if (operator === "Smartfren") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan("harga.s"))
        );
    } 
}
