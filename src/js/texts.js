async function loadTexts() {
    function allText() {
        fetch("http://remni55ru.beget.tech/english/api/texts.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    listTexts(data.texts);
                    document.querySelectorAll('.text-item')?.forEach(item => {
                        item.addEventListener('click', function (e) {
                          document.querySelectorAll('.text-item').forEach(el => {
                            el.querySelector('.source-text')?.classList.remove('text__source-view--expanded');
                            el.querySelector('.source-text')?.classList.add('text__source-view');
                      
                            el.querySelector('.translation-text')?.classList.remove('text__source-view--expanded');
                            el.querySelector('.translation-text')?.classList.add('text__source-view');

                            if(!e.target.classList.contains('toggle-translation') && el.classList.contains('active')) {
                                el.querySelector('.toggle-translation').textContent = "Показать перевод";
                                el.classList.remove('active');
                            }
                          });
                      
                          item.querySelector('.source-text')?.classList.remove('text__source-view');
                          item.querySelector('.source-text')?.classList.add('text__source-view--expanded');
                      
                          item.querySelector('.translation-text')?.classList.remove('text__source-view');
                          item.querySelector('.translation-text')?.classList.add('text__source-view--expanded');
                        });
                      });
                    
                    translateView();
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

    function listTexts(text) {
        let textList = document.querySelector('.texts__list');
        text.forEach(item => {
            textList.innerHTML += `
            <div class="text-item">
                <h2 class="source-title">${item["title_en"]}</h2>
                <p class="source-text text__source-view">
                ${item["text_en"]}
                </p>
                <button class="toggle-translation">Показать перевод</button>
                <div class="translation">
                <h3 class="translation-title">${item["title_ru"]}</h3>
                <p class="translation-text text__source-view">
                ${item["text_ru"]}
                </p>
                </div>
            </div>
            `;
        })
    }

    function translateView() {
        document.querySelectorAll('.toggle-translation').forEach(btn => {
            btn.addEventListener('click', () => {
              const parent = btn.closest('.text-item');
              parent.classList.toggle('active');
              btn.textContent = parent.classList.contains('active') ? 'Скрыть перевод' : 'Показать перевод';
            });
        });
    }

    allText();
}