
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
    from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';

// Вставьте вашу конфигурацию
const firebaseConfig = {

    apiKey: "AIzaSyBKdXRgRkme2L_pTIguNCP3veWO9VP2QTM",
    authDomain: "is-shop-project.firebaseapp.com",
    projectId: "is-shop-project",
    storageBucket: "is-shop-project.firebasestorage.app",
    messagingSenderId: "914404370235",
    appId: "1:914404370235:web:887027c2cdc41f14deb91e",
    measurementId: "G-15070QS7WQ"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Инициализация (если app уже инициализирован в другом модуле — вынесите инициализацию в отдельный модуль)
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Google sign-in error:", error);
        throw error;
    }
}

export async function signUserOut() {
    await signOut(auth);
}

export function observeAuthState(callback) {
    return onAuthStateChanged(auth, user => callback(user));
}


