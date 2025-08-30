import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";
const inputTujuan = document.getElementById("inputTujuan");

export function menuPaketTv(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Nex Parabola", () => kirimPesan("harga.nex"))
    );
    extraButtons.appendChild(
        createButton("K-Vision", () => kirimPesan("harga.kv"))
    );
    extraButtons.appendChild(
        createButton("Jawara Vision", () => kirimPesan("harga.mnc"))
    );
}
