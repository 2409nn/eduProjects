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


async function getUserByEmail(email) {
    let users = await db.getUsers();

// проверка на уникальность email
    let result = {isTaken: false};

    users.forEach((user) => {
        let savedEmail = user.data()['email'];
        if (savedEmail === email) {
             result.isTaken = true;
             result.email = email;
             result.username = user.data()['username'];
             result.password = user.data()['password'];
             result.address = user.data()['address'];
        }
    });

    return result;
}

// === Работа с DOM ===
const signInGoogle = document.getElementById('reg__google-signIn');



// Обработчик кнопки входа
signInGoogle.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const user = await signInWithGoogle();

        // Подписка на состояние авторизации
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // console.log('✅ Пользователь вошёл:', user.displayName);
                window.location.href = './index.html';
            } else {
                // console.log('Пользователь не авторизован');
            }
        });

    } catch (e) {
        console.error('Ошибка входа:', e);
    }
});

const submitBtn = document.querySelector('.reg input[type="submit"]');
const switchTab = document.querySelector('.reg__switch-tab');
submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let status = switchTab.getAttribute('data-status');

    const email = document.getElementById('email').value;
    let result = await getUserByEmail(email);

    if (status === 'noAccount') {

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const address = document.getElementById('address').value;

        if (result.isTaken) {
            alert("Данный email уже занят");
        }

        else {
            await db.addUser(username, email, password, address);
            window.location.href = './index.html';
            localStorage.setItem("email", email);
        }
    }

    else if (status === 'haveAccount') {

        if (!result.isTaken) {
            alert("Неверный email или пароль");
        }

        else {
            window.location.href = './index.html';
            localStorage.setItem("email", email);
        }
    }
})
