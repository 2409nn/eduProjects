import {
    signInWithGoogle,
    signUserOut,
    observeAuthState,
    auth,
    signInWithEmail,
    verifyUserPassword
} from './firebase.js';

import {
    signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';

import { db } from "./db.js";
import { inputsEmptyCheck, validateEmail, checkoutRegTable } from "./common.js";

// === Элементы DOM ===
const signInGoogle = document.getElementById('reg__google-signIn');
const submitBtn = document.querySelector('.reg input[type="submit"]');
const switchTab = document.querySelector(".reg__switch-tab");
const optionalInputs = document.querySelector(".reg__optional-inputs");
const form = document.querySelector('.reg__form');

var accountStatus = "hoAccount";

// === Обработчик кнопки входа через Google ===
signInGoogle.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const user = await signInWithGoogle();
        console.log('Google вход:', user);

        // Проверяем, есть ли документ пользователя в базе
        const existingUser = await db.getUserByEmail(user.email);
        if (!existingUser) {
            await db.addUser(
                user.displayName || "Без имени",
                user.email,
                "google-auth",
                "Не указан"
            );
        }

        window.location.href = './catalog.html';
    } catch (e) {
        console.error('Ошибка входа через Google:', e);
        alert('Ошибка входа через Google');
    }
});


// === Обработка нажатия кнопки регистрации/входа ===
submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();
    const username = form.querySelector('input[name="username"]')?.value.trim();
    const address = form.querySelector('input[name="address"]')?.value.trim();

    // Проверяем корректность email
    if (!validateEmail(form)) return alert("Введите корректный email");

    if (accountStatus === "noAccount") {
        // === Регистрация нового пользователя ===
        try {
            if (password.length < 6) {
                alert("Пароль должен содержать не менее 6 символов");
                return;
            }

            if (inputsEmptyCheck(form) === false) {
                throw new Error('Не все необходимые поля были заполнены')
                return alert("Пожалуйста, заполните все поля")
            }

            const user = await signInWithEmail(email, password);
            if (user) {
                await db.addUser(username, email, password, address);
                console.log("Пользователь создан и добавлен в базу:", user.uid);
                window.location.href = './catalog.html';
            }
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Не удалось зарегистрировать пользователя.");
        }
    }
    else if (accountStatus === "haveAccount") {
        // === Вход существующего пользователя ===
        try {
            const loginResult = await verifyUserPassword(email, password);
            if (loginResult.success) {
                window.location.href = './catalog.html';
            }
            else if (loginResult.message) {
                alert(loginResult.message);
            }

        } catch (error) {
            console.error("Ошибка входа:", error);
            alert("Неверный email или пароль.");
        }
    }
});

// === Переключение вкладки регистрации/входа ===
switchTab.addEventListener("click", () => {
    optionalInputs.classList.toggle("active");
    checkoutRegTable(optionalInputs, switchTab);

    accountStatus = optionalInputs.classList.contains("active")
        ? "noAccount"
        : "haveAccount";

    console.log(accountStatus);
    });
