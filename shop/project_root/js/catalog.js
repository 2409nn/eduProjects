import * as api from './api.js';
import {Product} from './models.js';
import {db} from './db.js';
import {Modal} from './models.js';


async function getUserIdByEmail(email) {
    let users = await db.getUsers()
        .then((users) => {return users})
        .catch((e) => {console.error(e)})

    let result;

    users.forEach((user) => {

        if (email == user.data().email) {
            result = user.id;
        }
    })

    return result;
}

async function getUserByEmail(email) {

// проверка на уникальность email
    let result = {isTaken: false};

    users.forEach((user) => {
        let savedEmail = user.data()['email'];
        if (savedEmail === email) {
            result.isTaken = true;
            result.username = user.data()['username'];
            result.email = email;
            result.password = user.data()['password'];
            result.address = user.data()['address'];
        }
    });

    return result;
}

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
    let userInfo = await getUserByEmail(email)
        .then()
        .catch((e) => console.error(e));

    const profileInfo = document.querySelectorAll('.profile__info li p');
    profileInfo.forEach((li) => {
        let attribute = li.getAttribute('data-inputName');
        li.innerText = userInfo[attribute];
    })

// рендеринг каждого товара в карты

    products.forEach(product => {
        let item = new Product(product.id, product.title, product.price, product.description, product.image, product.category);
        let card = item.renderCard(item.image, product.title, product.description, product.price);
        appendBlock.insertAdjacentHTML('beforeend', card);
    })
}

// modal

const editModal = new Modal("edit-modal");
const editModalSubmit = document.querySelector('#edit-modal input[type="submit"]');

editModalSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    // Валидация формы - проверка, что все поля заполнены
    let inputs = document.querySelectorAll("#edit-modal input[name]");
    let isValid = true;
    let emptyFields = [];

    inputs.forEach(input => {
        let inputValue = input.value.trim();
        if (!inputValue) {
            isValid = false;
            let fieldName = input.getAttribute("name");
            emptyFields.push(fieldName);

        }
    });

    // Если есть незаполненные поля, показываем ошибку и прерываем выполнение
    if (!isValid) {
        alert("Пожалуйста, заполните все поля");
        return;
    }

    // Если валидация прошла успешно, продолжаем изменение данных пользователя
    let oldEmail = document.querySelector(".profile .profile__email-value").textContent;
    let id = await getUserIdByEmail(oldEmail);
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

    await db.updateUser(id, data);
    editModal.close();
});


// интегрировать:

// ===== modal edit =====

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

const editModalTriggerBtns = Array.from(document.querySelectorAll(".edit-btn"));

editModalTriggerBtns.forEach(btn => {

    btn.addEventListener("click", (e) => {
        setEditModalData();
        editModal.show();
    })

    editModal.closeBtn.addEventListener("click", (e) => {
        editModal.close();
    })
})

