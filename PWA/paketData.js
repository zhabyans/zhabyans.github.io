import { createButton } from "./utils.js";

export function showPaketDataOptions(extraButtons, operatorDisplay, operator) {
    if (!operator || operator === "Unknown") {
        alert("Operator tidak dikenali untuk Paket Data");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    if (operator === "Telkomsel") {
        extraButtons.appendChild(
            createButton("Internet OMG", () => alert("Paket Internet OMG Telkomsel"))
        );
        extraButtons.appendChild(
            createButton("Combo Sakti", () => alert("Paket Combo Sakti Telkomsel"))
        );
    }
    else if (operator === "Indosat") {
        extraButtons.appendChild(
            createButton("Freedom Internet", () => alert("Freedom Internet Indosat"))
        );
        extraButtons.appendChild(
            createButton("Freedom Combo", () => alert("Freedom Combo Indosat"))
        );
    }
    else if (operator === "XL") {
        extraButtons.appendChild(
            createButton("Xtra Combo", () => alert("Paket Xtra Combo XL"))
        );
        extraButtons.appendChild(
            createButton("HotRod", () => alert("Paket HotRod XL"))
        );
    }
    else {
        extraButtons.appendChild(
            createButton("Internet Reguler", () => alert("Paket Data " + operator))
        );
    }
}
