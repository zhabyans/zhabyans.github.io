// tema.js
export function setupTheme() {
    const toggleBtns = document.querySelectorAll(".toggleThemeBtn");
    const htmlTag = document.documentElement;
    const themeMeta = document.getElementById("theme-color");

    // warna yang akan dipakai untuk navigation bar/status bar
    const themeColors = {
        light: "#ffffff",
        dark: "#121212"
    };

    let savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        htmlTag.setAttribute("data-theme", savedTheme);
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        savedTheme = prefersDark ? "dark" : "light";
        htmlTag.setAttribute("data-theme", savedTheme);
        localStorage.setItem("theme", savedTheme);
    }

    function updateUI() {
        let theme = htmlTag.getAttribute("data-theme");
        let color = themeColors[theme] || "#ffffff";

        // update icon tombol
        toggleBtns.forEach(btn => {
            const icon = btn.querySelector(".akun-icon") || btn;
            icon.textContent = theme === "dark" ? "☀️" : "🌙";
        });

        // update warna navigation bar (via theme-color)
        themeMeta.setAttribute("content", color);
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            let currentTheme = htmlTag.getAttribute("data-theme");
            let newTheme = currentTheme === "dark" ? "light" : "dark";
            htmlTag.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateUI();
        });
    });

    updateUI();
}
