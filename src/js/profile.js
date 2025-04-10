let avatarBtn = document.querySelector('.profile__edit-photo');
let inputAvatar = document.querySelector('#avatarInput');

// Отображение данных профиля
function dataProfile(data) {
    let nameEl = document.querySelector('.profile__name');
    let emailEl = document.querySelector('.profile__email');
    let dateEl = document.querySelector('.profile__date');

    nameEl.textContent = "Имя: " + data["name"];
    emailEl.textContent = "Email: " + data["email"];
    dateEl.textContent = "Дата регистрации: " + data["date"];

    // Устанавливаем аватар, если есть путь к изображению
    const avatarImage = document.querySelector('.profile__avatar');
    if(data.avatar_url){
        avatarImage.style.backgroundImage = `url(${data.avatar_url})`;
    }
}

// Функция для открытия диалогового окна выбора файла
function editAvatar() {
    inputAvatar.click();
}

// Функция для загрузки аватара на сервер
async function uploadAvatar(event) {
    const file = event.target.files[0];

    if (file) {
        // Прочитаем файл для предварительного показа
        const reader = new FileReader();

        reader.onload = async function(e) {
            const avatarImage = document.querySelector('.profile__avatar');
            avatarImage.style.backgroundImage = `url(${e.target.result})`; // Предварительный просмотр

            // Создаем форму для отправки файла
            const formData = new FormData();
            formData.append("avatar", file);
            // Передаем идентификатор пользователя, чтобы сервер знал, чей аватар обновлять
            formData.append("user_id", localStorage.getItem("user_id"));

            try {
                const response = await fetch('http://remni55ru.beget.tech/english/api/users.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.status === 'success') {
                    console.log("Аватар успешно обновлен");
                    // Обновляем данные профиля, если сервер возвращает новый путь аватара
                    loadProfileData();
                } else {
                    console.error("Ошибка при загрузке аватара", result.message);
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
            }
        };

        reader.readAsDataURL(file); // Читаем файл для предварительного показа
    }
}

// Загрузка данных пользователя
async function loadProfileData() {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        console.error("Идентификатор пользователя не найден в localStorage");
        return;
    }

    try {
        const response = await fetch('http://remni55ru.beget.tech/english/api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();

        if (data.status === 'success') {
            console.log('Данные пользователя:', data.user);
            dataProfile(data.user);
        } else {
            console.error('Ошибка:', data.message);
        }
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

// Устанавливаем обработчики событий
avatarBtn.addEventListener('click', editAvatar);
inputAvatar.addEventListener('change', uploadAvatar);

// Загружаем данные профиля при загрузке страницы
document.addEventListener("DOMContentLoaded", loadProfileData);
