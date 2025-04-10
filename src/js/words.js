async function loadWords() {
    let addWordBtn = document.querySelector('.words__btn-add');
    let modal = document.querySelector(".custom-modal");
    let modalBtn = document.querySelector(".modal-btn");
    let modalText = document.querySelector('.modal-text');
    let inpName = document.querySelector('.words__inp-name');
    let inpTranslate = document.querySelector('.words__inp-translate');

    function addWord() {
        if(inpName.value != "" || inpTranslate.value != "") {
            fetch("http://remni55ru.beget.tech/english/api/words.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: inpName.value.trim(),
                    translate: inpTranslate.value.trim(),
                    user: localStorage.getItem("user_id"),
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        inpName.value = "";
                        inpTranslate.value = "";
                        loadWords();
                    } else {
                        modalText.textContent = data.message;
                        modal.classList.add("show");
                        modalBtn.addEventListener('click', function() {
                            modal.classList.remove("show");
                        });
                    }
                })
                .catch((error) => {
                    modalText.textContent = error;
                    modal.classList.add("show");
                    modalBtn.addEventListener('click', function() {
                        modal.classList.remove("show");
                    });
                });
        } else {
            modalText.textContent = "Заполните все поля";
            modal.classList.add("show");
            modalBtn.addEventListener('click', function() {
                modal.classList.remove("show");
            });
        }
    }

    function listWord(data) {
        let list = document.querySelector('.words__ul');
        list.innerHTML = '';

        data.forEach(e => {
            const li = document.createElement('li');
            li.classList.add('word-card');
            li.innerHTML = `
                <div class="word-card__word">${e["name"]}</div>
                <div class="word-card__translate">${e["translate"]}</div>
            `;
            list.appendChild(li);
        });
    }

    function loadWordsAll() {
        fetch("http://remni55ru.beget.tech/english/api/words.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "get_all_words",
                user_id: localStorage.getItem("user_id"),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    listWord(data.words);
                } else {
                    modalText.textContent = data.message;
                    modal.classList.add("show");
                    modalBtn.addEventListener('click', function() {
                        modal.classList.remove("show");
                    });
                }
            })
            .catch((error) => {
                modalText.textContent = error;
                modal.classList.add("show");
                modalBtn.addEventListener('click', function() {
                    modal.classList.remove("show");
                });
            });
    }

    loadWordsAll();

    addWordBtn.addEventListener('click', function() {
        addWord();
    });

    document.addEventListener('keydown', function(event) {
        if(event.key === 'Enter') {
            addWord();
        }
    }); 
}