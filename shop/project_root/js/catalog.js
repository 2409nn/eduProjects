import * as api from './api.js';
import {Product, Modal} from './models.js';
import {db} from './db.js';
import {renderCart, inputsEmptyCheck} from './common.js';
import {onSnapshot, collection} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"

// установка данных из профиля в модальное окно editModal
function setEditModalData() {
    const editModalData = document.querySelector(".profile__info");
    const editDataObject = {};
    editModalData.querySelectorAll("li p").forEach(p => {
        editDataObject[p.getAttribute("data-inputName")] = p.textContent;
    });

    Object.keys(editDataObject).forEach((key) => {
        const input = Array.from(editModal.getInputs()).find(input => input.name === key);
        if (input) {
            input.value = editDataObject[key]; // например, подставляем данные
        }
    });
}
const userId = localStorage.getItem("userId");

await renderCart();
onSnapshot(collection(db.firestore, "users", userId, "cart"), async () => {
    await renderCart();
})

// загрузка персональных данных из Firebase
let isLoaded = {users: false, products: false};
let users = await db.getUsers().then((res) => {
    isLoaded.users = true;
    return res;

}).catch(e => console.error(e));
const loaderSpinner = document.querySelector('#loader');

// получение данных из fakeAPI:
let products = await api.getProducts().then(isLoaded.products = true).catch(e => console.error(e));
const allLoaded = Object.values(isLoaded).every(v => v === true);

if (allLoaded) {
    loaderSpinner.classList.add('hidden');
    const appendBlock = document.querySelector('.products__items');

// Отображение профиля:
    let email = localStorage.getItem('email');
    const userInfo = await db.getUserInfo(userId);

    if (userInfo !== undefined) {
        const profileInfo = document.querySelectorAll('.profile__info li p');
        profileInfo.forEach((li) => {

            let attribute = li.getAttribute('data-inputName');
            li.innerText = userInfo[attribute];
        })
    }
    else {
        alert("Вы не авторизованы. Зарегистрируйтесь пожалуйста");
    }

// рендеринг каждого товара в карточки
    products.forEach(product => {
        let item = new Product(product.id, product.title, product.price, product.description, product.image, product.category);
        let card = item.renderCard(item.image, product.title, product.description, product.price);
        appendBlock.insertAdjacentHTML('beforeend', card);
    })
}

// Модальное окно редактирования профиля
const editModalTriggerBtns = Array.from(document.querySelectorAll(".edit-btn"));
const editModal = new Modal("edit-modal");
const editModalSubmit = document.querySelector('#edit-modal input[type="submit"]');

editModalTriggerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        setEditModalData();
        editModal.show();
    })
    editModal.closeBtn.addEventListener("click", (e) => {
        editModal.close();
    })
})

editModalSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    // Валидация формы - проверка, что все поля заполнены
    let inputs = document.querySelectorAll("#edit-modal input[name]");
    let modalForm = document.querySelector("#edit-modal form");
    let isValid = inputsEmptyCheck(modalForm);

    // Если валидация прошла успешно, продолжаем изменение данных пользователя
    if (isValid) {
        let oldEmail = document.querySelector(".profile .profile__email-value").textContent;
        let data = {};

        inputs.forEach(input => {
            let inputName = input.getAttribute("name");
            let inputValue = input.value.trim();
            data[inputName] = inputValue;

            // Обновляем данные в интерфейсе
            let profileElement = document.querySelector(`.profile__info li p[data-inputName="${inputName}"]`);
            if (profileElement) {
                profileElement.innerText = inputValue;
            }
        });

        await db.updateUser(userId, data);
        editModal.close();
    }
    else {
        alert("Пожалуйста, заполните все поля");
        return;
    }

});
