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

document.addEventListener("DOMContentLoaded", navigasiKeyboard);