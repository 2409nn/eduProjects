import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

// На основе уникального fbConfig запускается приложение.
// С помощью функции gerFirestore, мы получаем базу данных приложения.

export class DataBase {
    constructor(fbConfig) {
        this.fbConfig = fbConfig;
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }

    async addUser(username, email, password, address) {
        try {
            const docRef = await addDoc(collection(this.db, "users"), {
                username,
                email,
                password,
                address
            });
            return docRef.id; // ✅ Возвращаем id
        } catch (e) {
            console.error("Ошибка при добавлении:", e);
            return null;
        }
    }

    async getUsers() {
        return getDocs(collection(this.db, "users"));
    }

    // сохранение товара в базу данных
    async addToCart(userId, imageURL, title, description, price) {
        try {
            const cartRef = collection(this.db, "users", userId, "cart");
            await addDoc(cartRef, {
                imageURL,
                title,
                description,
                price,
                createdAt: new Date()
            });
        } catch (e) {
            console.error("Ошибка при добавлении товара:", e);
        }
    }

    async getCartProducts() {
        try {
            const querySnapshot = await getDocs(collection(this.db, "catalog"));
            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return products;
        } catch (e) {
            console.error("Ошибка при получении товаров корзины:", e);
            return [];
        }
    }

    // ✅ Метод 1: изменение данных пользователя
    async updateUser(userId, newData) {
        try {
            const userRef = doc(this.db, "users", userId);
            await updateDoc(userRef, newData);
            // console.log(`Данные пользователя ${userId} успешно обновлены`);
        } catch (e) {
            console.error("Ошибка при обновлении пользователя:", e);
        }
    }

    // ✅ Метод 2: удаление товара из корзины
    async deleteCartProduct(productId) {
        try {
            const productRef = doc(this.db, "catalog", productId);
            await deleteDoc(productRef);
            // console.log(`Товар с ID ${productId} успешно удалён из корзины`);
        } catch (e) {
            console.error("Ошибка при удалении товара:", e);
        }
    }
}

export const db = new DataBase(firebaseConfig);
