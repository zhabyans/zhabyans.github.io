import { kirimPesan } from "./xmppHelper.js";
import { createButton } from "./utils.js"; // jika createButton ingin dipakai bersama

export function showPulsaOptions(extraButtons, operatorDisplay, operator) {
    if (!operator || operator === "Unknown") {
        alert("Operator tidak dikenali untuk Pulsa");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    // contoh: Telkomsel ada 2 tombol khusus
    if (operator === "Telkomsel") {
        extraButtons.appendChild(
            createButton("Reguler", () => kirimPesan("harga.t"))
        );
        extraButtons.appendChild(
            createButton("Tambah Masa Aktif", () => alert("Tambah Masa Aktif Telkomsel"))
        );
    } else {
        // default untuk operator lain
        extraButtons.appendChild(
            createButton("Reguler", () => alert("Pulsa Reguler " + operator))
        );
    }
}
