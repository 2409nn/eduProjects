import * as api from './api.js';
import {Product} from './models.js';
import {db} from './db.js';
import {Modal} from './models.js';

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
}

if (allLoaded) {

    const appendBlock = document.querySelector('.products__items');

// Отображение профиля:
    let email = localStorage.getItem('email');
    let userInfo = await getUserByEmail(email)
        .then()
        .catch((e) => console.error(e));

    const profileInfo = document.querySelectorAll('.profile__info li p');
    profileInfo.forEach((li) => {
        let attribute = li.getAttribute('data-inputName');
        console.log(attribute);
        li.innerText = userInfo[attribute];
    })

// рендеринг каждого товара в карты

    products.forEach(product => {
        let item = new Product(product.id, product.title, product.price, product.description, product.image, product.category);
        let card = item.renderCard(item.image, product.title, product.description, product.price);
        appendBlock.insertAdjacentHTML('beforeend', card);
    })

}

const editModal = new Modal("edit-modal");
const editModalSubmit = document.querySelector('#edit-modal input[type="submit"]');

editModalSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    editModal.close();

    let inputs = document.querySelectorAll("#edit-modal input[name]");
    inputs.forEach(input => {

        let inputName = input.getAttribute("name");
        let inputValue = input.value;

        document.querySelector(`.profile__info li p[data-inputName="${inputName}"]`).innerText = inputValue;
    })
})