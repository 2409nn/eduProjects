import {
    signInWithGoogle,
    signUserOut,
    observeAuthState,
    auth,
    signInWithEmail,
    verifyUserPassword,
    registerWithEmail,
} from './firebase.js';

import {
    signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';

import { db } from "./db.js";
import { inputsEmptyCheck, validateEmail, checkoutRegTable } from "./common.js";

// Элементы DOM
const signInGoogle = document.getElementById('reg__google-signIn');
const submitBtn = document.querySelector('.reg input[type="submit"]');
const switchTab = document.querySelector(".reg__switch-tab");
const optionalInputs = document.querySelector(".reg__optional-inputs");
const form = document.querySelector('.reg__form');

var accountStatus = "noAccount";

// Обработчик кнопки входа через Google
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
                "Не указан"
            );
        }

        localStorage.setItem("email", user.email);
        localStorage.setItem("userId", user.uid);
        window.location.href = './catalog.html';
    } catch (e) {
        console.error('Ошибка входа через Google:', e);
        alert('Ошибка входа через Google');
    }
});

// Обработка нажатия кнопки регистрации/входа
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
                const error = new Error('Не все необходимые поля были заполнены')
                error.code = "not-every-input-filled"
                throw error;
            }

            const user = await registerWithEmail(email, password);
            if (user) {
                await db.addUser(username, email, address, user.uid);
                console.log("Пользователь создан и добавлен в базу:", user.uid);

                localStorage.setItem("email", user.email);
                localStorage.setItem("userId", user.uid);
                window.location.href = "./catalog.html";
            }
        } catch (error) {

            console.group("%cОшибка регистрации", "color: red; font-weight: bold;");
            console.log("Код:", error.code);
            console.log("Сообщение:", error.message);
            console.groupEnd();

            if (error.code === "auth/email-already-in-use") {
                alert("Пользователь с такой почтой уже зарегистрирован. Попробуйте поменять вкладку на \"Уже есть аккаунт\"");
            }

            else if (error.code === "not-every-input-filled") {
                alert("Пожалуйста, введите все поля");
            }

            else {
                alert("Не удалось зарегистрировать пользователя.");
            }

        }
    }
    else if (accountStatus === "haveAccount") {
        // === Вход существующего пользователя ===
        try {
            const loginResult = await verifyUserPassword(email, password);
            if (loginResult.success) {
                localStorage.setItem("email", email);
                let userId = await db.getUserByEmail(email);
                userId = userId.id;

                localStorage.setItem("email", email);
                localStorage.setItem("userId", userId);

                window.location.href = './catalog.html';
            }

            else if (!loginResult.success) {
                const error = new Error("Неверная почта или пароль");
                error.code = "auth/invalid-credential";
                throw error;
            }

        } catch (error) {

            if (error.code === "auth/invalid-credential") {
                alert(error.message);
            }

            console.group("%cОшибка регистрации", "color: red; font-weight: bold;");
            console.log("Код:", error.code);
            console.log("Сообщение:", error.message);
            console.groupEnd();
        }
    }
});

// Переключение вкладки регистрации/входа
switchTab.addEventListener("click", () => {
    optionalInputs.classList.toggle("active");
    checkoutRegTable(optionalInputs, switchTab);

    accountStatus = optionalInputs.classList.contains("active")
        ? "noAccount"
        : "haveAccount";

    });
