import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    query,
    where,
    getDocs as getQueryDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { firebaseConfig } from "./firebase.js";

// На основе уникального fbConfig запускается приложение.
// С помощью функции getFirestore, мы получаем базу данных приложения.

export class DataBase {
    constructor(fbConfig) {
        this.fbConfig = fbConfig;
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.firestore = getFirestore(this.app);
    }

    async getUserByEmail(email) {
        try {
            const usersRef = collection(this.db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getQueryDocs(q);

            if (querySnapshot.empty) {
                return null; // Нет такого пользователя
            }

            // Если пользователь найден, возвращаем первый документ
            const userDoc = querySnapshot.docs[0];
            return {
                id: userDoc.id,
                ...userDoc.data()
            };
        } catch (e) {
            console.error("Ошибка при поиске пользователя по email:", e);
            return null;
        }
    }

    async addUser(username, email, address, userId) {
        try {
            // Создаём ссылку на документ users/{userId}
            const userRef = doc(this.db, "users", userId);

            // Сохраняем данные
            await setDoc(userRef, {
                username,
                email,
                address,
                createdAt: new Date()
            });

            console.log(`Пользователь добавлен с ID: ${userId}`);
            return userId;
        } catch (e) {
            console.error("Ошибка при добавлении пользователя:", e);
            return null;
        }
    }

    async getUsers() {
        return getDocs(collection(this.db, "users"));
    }

    // ✅ Получить ID текущего пользователя
    getCurrentUserId() {
        const user = this.auth.currentUser;
        if (user) {
            return user.uid; // UID из Firebase Authentication
        } else {
            console.warn("Пользователь не авторизован");
            return null;
        }
    }

    // ✅ Добавление товара в корзину
    async addToCart(userId, imageURL, title, description, price) {
        try {
            // если передали некорректный URL, экранируем его

            const safeImageURL = encodeURIComponent(imageURL);

            const cartRef = collection(this.db, "users", userId, "cart");
            await addDoc(cartRef, {
                imageURL: decodeURIComponent(safeImageURL), // храним как обычный URL
                title,
                description,
                price,
                createdAt: new Date()
            });
        } catch (e) {
            console.error("Ошибка при добавлении товара:", e);
        }
    }

    async getCartProducts(userId) {
        try {
            if (!userId) {
                console.warn("Не указан userId при получении корзины");
                return [];
            }

            // путь: users/{userId}/cart
            const cartRef = collection(this.db, "users", userId, "cart");
            const querySnapshot = await getDocs(cartRef);

            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return products;

        } catch (e) {
            console.error("Ошибка при получении товаров корзины:", e);
            return [];
        }
    }

    async updateUser(userId, newData) {
        try {
            const userRef = doc(this.db, "users", userId);
            await updateDoc(userRef, newData);
        } catch (e) {
            console.error("Ошибка при обновлении пользователя:", e);
        }
    }

    async deleteCartProduct(userId, productId) {
        try {
            const productRef = doc(this.db, "users", userId, "cart", productId);
            await deleteDoc(productRef);
        } catch (e) {
            console.error("Ошибка при удалении товара:", e);
        }
    }
}

export const db = new DataBase(firebaseConfig);
