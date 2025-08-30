import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";
const inputTujuan = document.getElementById("inputTujuan");

export function menuBayarIndihome(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Cek Tagihan Indihome", () => kirimPesan("cindihome." + inputTujuan.value))
    );
}
