// file: keyboard-fix.js
export function navigasiKeyboard() {
  const nav = document.getElementById("navBottom");
  if (!nav) return;

  const viewport = window.visualViewport;

  function updatePosition() {
    const offsetBottom = window.innerHeight - viewport.height - viewport.offsetTop;
    if (offsetBottom > 0) {
      // keyboard muncul → angkat nav
      nav.style.bottom = offsetBottom + "px";
    } else {
      // keyboard hilang → normal
      nav.style.bottom = "0px";
    }
  }

  viewport.addEventListener("resize", updatePosition);
  viewport.addEventListener("scroll", updatePosition);
}

// 🔹 Tambahkan fungsi baru untuk toast
export function navigasiToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;

  const viewport = window.visualViewport;

  function updatePosition() {
    const centerY = viewport.height / 2 + viewport.offsetTop;
    toast.style.top = centerY + "px";
  }

  viewport.addEventListener("resize", updatePosition);
  viewport.addEventListener("scroll", updatePosition);
  updatePosition(); // jalankan pertama kali
}

document.addEventListener("DOMContentLoaded", () => {
  navigasiKeyboard();
  navigasiToast();   // 🔹 aktifkan untuk toast
});