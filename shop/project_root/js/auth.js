import {signInWithGoogle, signUserOut, observeAuthState, auth} from './firebase.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';

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