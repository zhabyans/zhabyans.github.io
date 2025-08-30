import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";
const inputTujuan = document.getElementById("inputTujuan");

export function menuBayarBpjs(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Cek Tagihan BPJS Kesehatan", () => kirimPesan("cbpjsks." + inputTujuan.value))
    );
}
