import { createButton, showToast } from "./utils.js";
import { kirimPesan } from "./xmppHelper.js";

export function menuPaketData(extraButtons, operatorDisplay, operator) {
    if (!operator || operator === "Unknown") {
        showToast("Nomor Tujuan Tidak Dikenali untuk Paket Data");
        return;
    }

    extraButtons.style.display = "block";
    operatorDisplay.textContent = operator;

    if (operator === "Tsel") {
        extraButtons.appendChild(
            createButton("1 Bulan", () => kirimPesan("harga.td"))
        );
        extraButtons.appendChild(
            createButton("Jawa Timur", () => kirimPesan("harga.jtm"))
        );
        extraButtons.appendChild(
            createButton("Jawa Tengah", () => kirimPesan("harga.jtg"))
        );
        extraButtons.appendChild(
            createButton("Jawa Barat", () => kirimPesan("harga.jbr"))
        );
    }
    else if (operator === "Isat") {
        extraButtons.appendChild(
            createButton("Freedom Internet", () => kirimPesan("harga.if"))
        );
        extraButtons.appendChild(
            createButton("Freedom Unlimited", () => kirimPesan("harga.iu"))
        );
        extraButtons.appendChild(
            createButton("Freedom Mini", () => kirimPesan("harga.im"))
        );
    }
    else if (operator === "XL") {
        extraButtons.appendChild(
            createButton("Xtra Combo Flex", () => kirimPesan("harga.xcf"))
        );
        extraButtons.appendChild(
            createButton("XL Mini", () => kirimPesan("harga.xm"))
        );
    }
    else if (operator === "Axis") {
        extraButtons.appendChild(
            createButton("1 Bulan", () => kirimPesan("harga.bro"))
        );
        extraButtons.appendChild(
            createButton("Axis Mini", () => kirimPesan("harga.am"))
        );
    }
    else if (operator === "Tri") {
        extraButtons.appendChild(
            createButton("AON", () => kirimPesan("harga.aon"))
        );
        extraButtons.appendChild(
            createButton("Happy", () => kirimPesan("harga.hap"))
        );
    }
    else if (operator === "Smartfren") {
        extraButtons.appendChild(
            createButton("Unlimited Harian", () => kirimPesan("harga.suh"))
        );
        extraButtons.appendChild(
            createButton("Smartfren Unlimited", () => kirimPesan("harga.sun"))
        );
        extraButtons.appendChild(
            createButton("Smartfren Mini", () => kirimPesan("harga.sd"))
        );
    }
}
