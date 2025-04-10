if (localStorage.getItem("user_id")) {
    location.href = "./index.html";
}

let toggleBtns = document.querySelectorAll(".auth__btn");
let forms = document.querySelectorAll(".auth__form");
let formsContainer = document.querySelector(".auth__forms");
let formReg = document.querySelector(".auth__form--register");
let formLog = document.querySelector(".auth__form--login");
let modal = document.querySelector(".custom-modal");
let modalBtn = document.querySelector(".modal-btn");
let modalText = document.querySelector('.modal-text');
let phoneInputs = document.querySelectorAll('.auth__input--tel');

phoneInputs.forEach(input => {
    input.addEventListener('input', onPhoneInput, false);
    input.addEventListener('focus', onPhoneInput, false);
    input.addEventListener('blur', onPhoneInput, false);
    input.addEventListener('keydown', onPhoneKeyDown, false);
});

function onPhoneInput(e) {
    let input = e.target,
        inputNumbersValue = input.value.replace(/\D/g, ''),
        formattedInputValue = '',
        selectionStart = input.selectionStart;

    if (!inputNumbersValue) {
        return input.value = '';
    }

    if (input.value.length != selectionStart) {
        // editing in the middle of input, not last symbol
        if (e.data && /\D/g.test(e.data)) {
            input.value = inputNumbersValue;
        }
        return;
    }

    if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
        // Russian phone number
        if (inputNumbersValue[0] === '9') inputNumbersValue = '7' + inputNumbersValue;
        let firstSymbols = (inputNumbersValue[0] === '8') ? '8' : '+7';
        formattedInputValue = firstSymbols + ' ';
        if (inputNumbersValue.length > 1) {
            formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
            formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
            formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
            formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
        }
    } else {
        // not Russian number
        formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    }

    input.value = formattedInputValue;
}

function onPhoneKeyDown(e) {
    // Clear on backspace
    const input = e.target;
    if (e.key === 'Backspace' && input.value.replace(/\D/g, '').length === 1) {
        input.value = '';
    }
}

toggleBtns.forEach((item) => {
    let currentAtr = item.getAttribute("data-tab");

    item.addEventListener("click", function () {
        toggleBtns.forEach((btn) => btn.classList.remove("auth__btn--active"));
        item.classList.add("auth__btn--active");

        let startHeight = formsContainer.offsetHeight;
        formsContainer.style.height = startHeight + "px";

        forms.forEach((form) => form.classList.remove("auth__form--active"));
        let activeForm = document.querySelector(`.auth__form--${currentAtr}`);
        activeForm.classList.add("auth__form--active");

        let newHeight = activeForm.scrollHeight;
        formsContainer.offsetHeight;
        formsContainer.style.height = newHeight + "px";
        formsContainer.addEventListener("transitionend", function handler() {
            formsContainer.style.height = "auto";
            formsContainer.removeEventListener("transitionend", handler);
        });
    });
});

formReg.addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.querySelector(".auth__input--name").value.trim();
    let tel = document.querySelector(".auth__input--tel").value.trim();
    let email = document.querySelector(".auth__input--email").value.trim();
    let pass = document.querySelector(".auth__input--pass").value;
    let repass = document.querySelector(".auth__input--repass").value;

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("tel", tel);
    formData.append("email", email);
    formData.append("pass", pass);
    formData.append("repass", repass);

    fetch("http://remni55ru.beget.tech/english/api/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            tel: tel,
            email: email,
            pass: pass,
            repass: repass,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                localStorage.setItem("user_id", data.user["user_id"]);
                console.log(localStorage.getItem("user_id"));
                modalText.textContent = data.message;
                modal.classList.add("show");
                modalBtn.addEventListener('click', function() {
                    location.href = "./index.html";
                });
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
});

formLog.addEventListener("submit", function (event) {
    event.preventDefault();

    let email = document.querySelector(".login__input--email").value.trim();
    let pass = document.querySelector(".login__input--pass").value;
    console.log("Пароль trim", pass.trim());
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("pass", pass);

    fetch("http://remni55ru.beget.tech/english/api/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            pass: pass,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                localStorage.setItem("user_id", data.user["user_id"]);
                console.log(localStorage.getItem("user_id"));
                modalText.textContent = data.message;
                modal.classList.add("show");
                modalBtn.addEventListener('click', function() {
                    location.href = "./index.html";
                });
            } else {
                modalText.textContent = data.message;
                modal.classList.add("show");
                modalBtn.addEventListener('click', function() {
                    modal.classList.remove('show');
                });
            }
        })
        .catch((error) => {
            modalText.textContent = error;
            modal.classList.add("show");
            modalBtn.addEventListener('click', function() {
                modal.classList.remove('show');
            });
        });
});