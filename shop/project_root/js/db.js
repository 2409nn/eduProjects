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
    async addUser() {
        try {
            const docRef = await addDoc(collection(this.db, "users"), {
                name: "Iskander",
                age: 17
            });
            console.log("Добавлен документ с ID:", docRef.id);
        } catch (e) {
            console.error("Ошибка при добавлении:", e);
        }
    }

    // Пример: получение всех пользователей
    async getUsers() {
        const querySnapshot = await getDocs(collection(this.db, "users"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} =>`, doc.data());
        });
    }
}

const db = new DataBase(firebaseConfig);
db.addUser();