import { createButton } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";
const inputTujuan = document.getElementById("inputTujuan");

export function menuBayarListrik(extraButtons, operatorDisplay, operator) {
    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;
    extraButtons.appendChild(
        createButton("Cek Tagihan Listrik", () => kirimPesan("cpln." + inputTujuan.value))
    );
}
