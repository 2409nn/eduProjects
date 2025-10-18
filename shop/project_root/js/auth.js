import {signInWithGoogle, signUserOut, observeAuthState, firebaseConfig, auth} from './firebase.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import {db} from "./db.js";

function validateLogin(email) {
    if (!email || email.length === 0) {
        return false;
    }

    // Более гибкое регулярное выражение для email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
}

function validateForm(username, password, address, email, status) {
    // Обязательные поля для обеих форм
    if (!email || !password) {
        alert("Заполните email и пароль");
        return false;
    }

    if (!validateLogin(email)) {
        alert("Введите корректный email");
        return false;
    }

    if (password.length < 6) {
        alert("Пароль должен содержать минимум 6 символов");
        return false;
    }

    // Дополнительные проверки для регистрации
    if (status === 'noAccount') {
        if (!username || username.length === 0) {
            alert("Введите имя пользователя");
            return false;
        }
        if (!address || address.length === 0) {
            alert("Введите адрес");
            return false;
        }
    }

    return true;
}

async function getUserByEmail(email) {
    let users = await db.getUsers();
    let result = {isTaken: false};

    users.forEach((user) => {
        let savedEmail = user.data()['email'];
        if (savedEmail === email) {
            result.isTaken = true;
            result.email = email;
            result.username = user.data()['username'];
            result.password = user.data()['password'];
            result.address = user.data()['address'];
            result.userData = user.data(); // сохраняем все данные пользователя
        }
    });

    return result;
}

// === Работа с DOM ===
const signInGoogle = document.getElementById('reg__google-signIn');

// Обработчик кнопки входа через Google
signInGoogle.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const user = await signInWithGoogle();
        let userEmail = user.email;
        let isTransfered = false;

        let users = await db.getUsers()
            .then((users) => { return users })
            .catch((e) => { console.error(e) });

        users.forEach((user) => {
            if (userEmail === user.data().email) {
                window.location.href = './index.html';
                isTransfered = true;
                localStorage.setItem("email", userEmail);
            }
        });

        if (!isTransfered) {
            alert('Вы еще не зарегистрированы. Пожалуйста, зарегистрируйтесь сначала.');
            // Можно предложить регистрацию или выход
            await signUserOut();
        }

    } catch (e) {
        console.error('Ошибка входа:', e);
        alert('Ошибка входа через Google');
    }
});

const submitBtn = document.querySelector('.reg input[type="submit"]');
const switchTab = document.querySelector('.reg__switch-tab');

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value.trim();
    const email = document.getElementById('email').value.trim();

    const status = switchTab.getAttribute('data-status');

    // Валидация формы
    if (!validateForm(username, password, address, email, status)) {
        return;
    }

    try {
        if (status === 'noAccount') {
            // РЕГИСТРАЦИЯ
            let result = await getUserByEmail(email);

            if (result.isTaken) {
                alert("Данный email уже занят");
            } else {
                await db.addUser(username, email, password, address);
                localStorage.setItem("email", email);
                alert("Регистрация успешна!");
                window.location.href = './index.html';
            }

        } else if (status === 'haveAccount') {
            // ВХОД
            let result = await getUserByEmail(email);

            if (!result.isTaken) {
                alert("Пользователь с таким email не найден");
                return;
            }

            // Проверяем пароль (предполагая, что пароль хранится в открытом виде)
            // В реальном приложении используйте хеширование!
            if (password === result.password) {
                localStorage.setItem("email", email);
                alert("Вход выполнен успешно!");
                window.location.href = './index.html';
            } else {
                alert("Неверный пароль");
            }
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert("Произошла ошибка. Попробуйте еще раз.");
    }
});


// внедрить
const switchTab = document.querySelector(".reg__switch-tab");
const optionalInputs = document.querySelector(".reg__optional-inputs");

checkoutRegTable(optionalInputs, switchTab);

switchTab.addEventListener("click", (e) => {
    optionalInputs.classList.toggle("active");

    checkoutRegTable(optionalInputs, switchTab);
})

// -----

