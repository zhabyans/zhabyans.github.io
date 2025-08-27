// ----------------------
// TEMA DARK / LIGHT
// ----------------------
export function setupTheme() {
    const toggleBtn = document.getElementById("toggleTheme");
    const htmlTag = document.documentElement;
    const themeMeta = document.getElementById("theme-color");

    // cek preferensi dari localStorage dulu
    let savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        htmlTag.setAttribute("data-theme", savedTheme);
    } else {
        // kalau belum ada, ikuti preferensi perangkat
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            htmlTag.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            htmlTag.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }

    // set status bar & tombol sesuai mode
    updateUI();

    toggleBtn.addEventListener("click", () => {
        let currentTheme = htmlTag.getAttribute("data-theme");

        if (currentTheme === "dark") {
            htmlTag.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            htmlTag.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
        updateUI();
    });

    function updateUI() {
        let theme = htmlTag.getAttribute("data-theme");

        // update tombol
        if (theme === "dark") {
            toggleBtn.textContent = "☀️";
            themeMeta.setAttribute("content", "#121212"); // status bar dark
        } else {
            toggleBtn.textContent = "🌙";
            themeMeta.setAttribute("content", "#ffffff"); // status bar light
        }
    }
}