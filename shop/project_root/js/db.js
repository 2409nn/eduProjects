import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

// ТВОЯ КОНФИГУРАЦИЯ

// Инициализация Firebase

export class DataBase {
    constructor(fbConfig) {
        this.fbConfig = fbConfig;
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
    }

    // Пример: добавление данных в коллекцию "users"
    async addUser(username, email, password, address) {
        try {
            const docRef = await addDoc(collection(this.db, "users"), {
                username: username,
                email: email,
                password: password,
                address: address
            });
            console.log("Добавлен документ с ID:", docRef.id);
        } catch (e) {
            console.error("Ошибка при добавлении:", e);
        }
    }

    // Пример: получение всех пользователей
    async getUsers() {
        const querySnapshot = await getDocs(collection(this.db, "users"));
        return querySnapshot;
    }

    async saveProduct() {
        const docRef = await addDoc(collection(this.db, "catalog"), {
            name: "Iskander",
        })
    }

    async addToCart(imageURL, title, description, price) {
        try {
            const docRef = await addDoc(collection(this.db, "catalog"), {
                imageURL: imageURL,
                title: title,
                description: description,
                price: price,
                createdAt: new Date()
            });
            console.log("Товар добавлен с ID:", docRef.id);
        } catch (e) {
            console.error("Ошибка при сохранении товара:", e);
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
            return products; // Возвращает массив объектов с данными товаров
        } catch (e) {
            console.error("Ошибка при получении товаров корзины:", e);
            return [];
        }
    }
}

export const db = new DataBase(firebaseConfig);
