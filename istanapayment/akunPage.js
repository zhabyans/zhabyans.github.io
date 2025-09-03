// file: akunPage.js

export function akunPage() {
  const akunDisplay = document.getElementById("akunDisplay");
  akunDisplay.innerHTML = `
    <div class="akun-list">
      <button id="logoutBtn" class="akun-item">
        <span class="akun-icon">📴</span>
        <span class="akun-label">Keluar Akun</span>
      </button>
      <button id="refreshBtn" class="akun-item">
        <span class="akun-icon">🔄</span>
        <span class="akun-label">Refresh Halaman</span>
      </button>
      <button id="toggleTheme" class="akun-item">
        <span class="akun-icon">🌙</span>
        <span class="akun-label">Tema Gelap/Terang</span>
      </button>
    </div>
  `;
}
