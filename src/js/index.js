document.addEventListener("DOMContentLoaded", () => {
    const contentWrapper = document.querySelector(".main__content");
    const sidebarLinks = document.querySelectorAll(".link_page[data-page]");
    let mainBlock = document.querySelector('.main');

    document.querySelector('.main__man').addEventListener('dblclick', function() {
        mainBlock.classList.contains('main__background') ? mainBlock.classList.remove('main__background') : mainBlock.classList.add('main__background');
    });

    async function loadContent(page) {
        try {
            const response = await fetch(`${page}.html`);
            if (!response.ok) throw new Error("Страница не найдена");

            const html = await response.text();
            contentWrapper.innerHTML = html;

            if (page === "profile") {
                const script = document.createElement("script");
                script.src = "./js/profile.js";
                script.onload = () => loadProfileData();
                document.body.appendChild(script);
            } else if(page === "words") {
                const script = document.createElement("script");
                script.src = "./js/words.js";
                script.onload = () => loadWords();
                document.body.appendChild(script);
            } else if(page === "text") {
                const script = document.createElement("script");
                script.src = "./js/texts.js";
                script.onload = () => loadTexts();
                document.body.appendChild(script);
            }
        } catch (error) {
            console.error("Ошибка загрузки:", error);
            contentWrapper.innerHTML = `
                <div class="main__content">
                    <h1 class="main__title">Ошибка</h1>
                    <p class="main__subtitle">Не удалось загрузить страницу</p>
                </div>
            `;
        }
    }

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            sidebarLinks.forEach((l) => l.classList.remove("sidebar-active"));
            link.classList.add("sidebar-active");

            const page = link.getAttribute("data-page");
            loadContent(page);
        });
    });

    loadContent("main");
    const exit = document.querySelector(".exit_link");
    exit.addEventListener("click", function () {
        let modal = document.querySelector(".custom-modal");
        modal.classList.add("show");

        document.querySelectorAll(".modal-btn").forEach((item) => {
            item.addEventListener("click", function () {
                if (item.classList.contains("modal-true")) {
                    modal.classList.remove("show");
                    localStorage.removeItem("user_id");
                    location.href = "./auth.html";
                } else {
                    modal.classList.remove("show");
                }
            });
        });
        // if (res) {

        // } else {
        //     console.log("Отмена выхода");
        // }
    });
});
