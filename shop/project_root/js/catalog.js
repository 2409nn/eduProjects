import * as api from './api.js';
import {Product} from './models.js';
import {db} from './db.js';

async function getUserByEmail(email) {
    let users = await db.getUsers();

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

// получение данных из fakeAPI:
api.getProducts()
    .then(products => {
        products.forEach(product => {

            // рендеринг каждого товара в карты
            let item = new Product(product.id, product.title, product.price, product.description, product.image, product.category);
            let card = item.renderCard(item.image, product.title, product.description, product.price);
            appendBlock.insertAdjacentHTML('beforeend', card);
        })
    })
