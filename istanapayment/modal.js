// file modal.js
export function showModalCustom({ 
    title = "", 
    message = "", 
    buttons = [] 
}) {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalHeader = document.getElementById("modalHeader");
    const modalMessage = document.getElementById("modalMessage");
    const modalButtons = document.getElementById("modalButtons");

    modalHeader.textContent = title;
    modalMessage.innerHTML = message; // pakai innerHTML biar bisa format tabel / <br>
    modalOverlay.style.display = "flex";

    // kosongkan tombol lama
    modalButtons.innerHTML = "";

    // render tombol baru
    buttons.forEach(btn => {
        const buttonEl = document.createElement("button");
        buttonEl.textContent = btn.text;
        buttonEl.className = btn.className || "modal-ok";
        buttonEl.onclick = () => {
            modalOverlay.style.display = "none";
            if (btn.onClick) btn.onClick();
        };
        modalButtons.appendChild(buttonEl);
    });
}

// === wrapper lama agar tetap kompatibel ===
export function showModalConfirm(judul, message, onConfirm, onCancel) {
    showModalCustom({
        title: judul,
        message,
        buttons: [
            {
                text: "OK",
                className: "modal-ok",
                onClick: onConfirm
            },
            {
                text: "Cancel",
                className: "modal-cancel",
                onClick: onCancel
            }
        ]
    });
}
