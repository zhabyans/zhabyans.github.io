//file register.js
import { showToast } from "./utils.js";

export function setupRegister(domain) {
    const formLogin = document.getElementById("formLogin");
    const formRegister = document.getElementById("formRegister");
    const btnShowRegister = document.getElementById("showRegister");
    const btnBack = document.getElementById("backToLogin");

    const regUser = document.getElementById("regUser");
    const regPass = document.getElementById("regPass");
    const regPass2 = document.getElementById("regPass2");
    const regWarning = document.getElementById("regWarning");
    const passWarning = document.getElementById("passWarning");

    // 🔹 tampilkan form register
    btnShowRegister.addEventListener("click", () => {
        formLogin.style.display = "none";
        formRegister.style.display = "block";
    });

    // 🔹 kembali ke login
    btnBack.addEventListener("click", () => {
        formRegister.reset();
        regWarning.style.display = "none";
        passWarning.style.display = "none";
        formRegister.style.display = "none";
        formLogin.style.display = "block";
    });

    // 🔹 validasi username realtime
    regUser.addEventListener("input", () => {
        const value = regUser.value;

        if (!/^[A-Za-z0-9]*$/.test(value)) {
            regWarning.textContent = "Username hanya boleh huruf dan angka (tanpa spasi & simbol)!";
            regWarning.style.display = "block";
        } else {
            regWarning.style.display = "none";
        }
    });

    // 🔹 validasi password realtime
    function checkPasswordMatch() {
        if (regPass.value && regPass2.value && regPass.value !== regPass2.value) {
            passWarning.textContent = "Konfirmasi password tidak cocok!";
            passWarning.style.display = "block";
        } else {
            passWarning.style.display = "none";
        }
    }

    regPass.addEventListener("input", checkPasswordMatch);
    regPass2.addEventListener("input", checkPasswordMatch);

    // 🔹 submit register
    formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();

        // validasi username
        if (!/^[A-Za-z0-9]+$/.test(regUser.value)) {
            regWarning.textContent = "Username hanya boleh huruf dan angka (tanpa spasi & simbol)!";
            regWarning.style.display = "block";
            return;
        }

        // validasi password
        if (regPass.value !== regPass2.value) {
            passWarning.textContent = "Konfirmasi password tidak cocok!";
            passWarning.style.display = "block";
            return;
        }

        try {
            const res = await fetch("https://pulsa.dpdns.org:5443/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: regUser.value,
                    password: regPass.value,
                    host: domain
                })
            });

            if (!res.ok) throw new Error("Gagal register, coba lagi!");

            const data = await res.json();
            console.log("Register response:", data);

            showToast("Akun berhasil dibuat, silakan login!", "success");

            // balik ke login
            formRegister.reset();
            formRegister.style.display = "none";
            formLogin.style.display = "block";

            // otomatis isi username di login
            document.getElementById("akune").value = regUser.value;

        } catch (err) {
            console.error(err);
            showToast(err.message, "error");
        }
    });
}
