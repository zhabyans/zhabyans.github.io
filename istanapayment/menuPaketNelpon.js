import { createButton, showToast } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";

export function menuPaketNelpon(extraButtons, operatorDisplay, operator) {
    if (!operator || operator === "Unknown") {
        showToast("Nomor Tujuan Tidak Dikenali untuk Paket Nelpon");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    if (operator === "Telkomsel") {
        extraButtons.appendChild(
            createButton("Telkomsel Nelpon", () => kirimPesan("harga.tn"))
        );
    }
    else if (operator === "Indosat") {
        extraButtons.appendChild(
            createButton("Indosat Nelpon", () => kirimPesan("harga.in"))
        );
    }
    else if (operator === "XL") {
        extraButtons.appendChild(
            createButton("XL Nelpon", () => kirimPesan("harga.xn"))
        );
    }
    else if (operator === "Axis") {
        extraButtons.appendChild(
            createButton("Axis Nelpon", () => kirimPesan("harga.an"))
        );
    }
    else if (operator === "Tri") {
        extraButtons.appendChild(
            createButton("Tri Nelpon", () => kirimPesan("harga.trn"))
        );
    }
}
