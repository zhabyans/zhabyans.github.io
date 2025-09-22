//file menuPulsa.js
import { kirimPesan } from "./xmppHelper.js";
import { createButton, productCommand, showToast } from "./utils.js"; // jika createButton ingin dipakai bersama

export function menuPulsa(extraButtons, operatorDisplay, operator) {
    if (!operator || operator === "Unknown") {
        showToast("Nomor Tujuan Tidak Dikenali untuk Pulsa");
        return;
    }
    const tipeAkun = localStorage.getItem("tipe_akun");
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    if (operator === "Tsel") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan(productCommand("t")))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan(productCommand("tmat")))
        );
    }
    else if (operator === "Isat") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan(productCommand("i")))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan(productCommand("tmai")))
        );
    }
    else if (operator === "XL") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan(productCommand("x")))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan(productCommand("tmax")))
        );
    }
    else if (operator === "Axis") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan(productCommand("a")))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan(productCommand("tmaa")))
        );
    }
    else if (operator === "Tri") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan(productCommand("tr")))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => kirimPesan(productCommand("tmatri")))
        );
    }
    else if (operator === "Smar") {
        extraButtons.appendChild(
            createButton("Pulsa Reguler", () => kirimPesan(productCommand("s")))
        );
    }

}
