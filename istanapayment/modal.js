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
    const modalCloseBtn = document.getElementById("modalCloseBtn");

    modalHeader.textContent = title;
    modalMessage.innerHTML = message;
    modalOverlay.style.display = "flex";
    window.modalTerbuka = true; // ⬅️ tandai modal terbuka

    // setiap kali buka modal, dorong state baru
    history.pushState({ modal: true }, null, location.href);

    // kosongkan tombol lama
    modalButtons.innerHTML = "";

    buttons.forEach(btn => {
        const buttonEl = document.createElement("button");
        buttonEl.textContent = btn.text;
        buttonEl.className = btn.className || "modal-ok";
        buttonEl.onclick = () => {
            modalOverlay.style.display = "none";
            window.modalTerbuka = false;
            if (btn.onClick) btn.onClick();
        };
        modalButtons.appendChild(buttonEl);
    });

    modalCloseBtn.onclick = () => {
        modalOverlay.style.display = "none";
        window.modalTerbuka = false;
    };
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
                onClick: () => {
                    window.modalTerbuka = false; // pastikan reset
                    if (onConfirm) onConfirm();
                }
            },
            {
                text: "Cancel",
                className: "modal-cancel",
                onClick: () => {
                    window.modalTerbuka = false; // pastikan reset
                    if (onCancel) onCancel();
                }
            }
        ]
    });
}

