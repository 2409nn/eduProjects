import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    browserLocalPersistence,
    setPersistence,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    linkWithCredential,
    EmailAuthProvider
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';

export const firebaseConfig = {
    apiKey: "AIzaSyBKdXRgRkme2L_pTIguNCP3veWO9VP2QTM",
    authDomain: "is-shop-project.firebaseapp.com",
    projectId: "is-shop-project",
    storageBucket: "is-shop-project.firebasestorage.app",
    messagingSenderId: "914404370235",
    appId: "1:914404370235:web:887027c2cdc41f14deb91e",
    measurementId: "G-15070QS7WQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// === Настраиваем сохранение авторизации ===
setPersistence(auth, browserLocalPersistence);

// === Вход через Google ===
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Вход выполнен:", result.user);
        return result.user;

    } catch (error) {
        if (error.code === 'auth/account-exists-with-different-credential') {
            // Пользователь уже зарегистрирован другим способом
            const email = error.customData.email;
            const pendingCred = GoogleAuthProvider.credentialFromError(error);

            // Просим пользователя войти обычным способом
            const password = prompt(`Аккаунт с ${email} уже существует. Введите пароль для привязки:`);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await linkWithCredential(userCredential.user, pendingCred);

            alert('Аккаунт успешно объединён!');
            return userCredential.user;
        } else {
            console.error("Google sign-in error:", error);
            alert(`Ошибка входа: ${error.code || error.message}`);
        }
    }
}

// === Регистрация пользователя ===
export async function signInWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Вход по email:", result.user);
    return result.user;
}

// === Выход ===
export async function signUserOut() {
    await signOut(auth);
    console.log("Пользователь вышел");
}

// === Отслеживание состояния ===
export function observeAuthState(callback) {
    return onAuthStateChanged(auth, user => callback(user));
}

export async function verifyUserPassword(email, password) {
    try {
        const auth = getAuth(this.app);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Если успешно — возвращаем объект пользователя
        return {
            success: true,
            user: userCredential.user
        };
    } catch (error) {
        // Обрабатываем типичные ошибки
        if (error.code === "auth/wrong-password") {
            return {success: false, message: "Неверный пароль"};
        } else if (error.code === "auth/user-not-found") {
            return {success: false, message: "Пользователь не найден"};
        } else if (error.code === "auth/too-many-requests") {
            return {success: false, message: "Слишком много попыток входа. Попробуйте позже."};
        } else {
            console.error("Ошибка проверки пароля:", error);
            return {success: false, message: "Ошибка проверки пароля"};
        }
    }
}