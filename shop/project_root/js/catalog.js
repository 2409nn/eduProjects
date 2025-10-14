import * as api from './api.js';
import {Product} from './models.js';

const appendBlock = document.querySelector('.products__items');

// получение данных из fakeAPI:
api.getProducts()
    .then(products => {
        products.forEach(product => {

            // рендеринг каждого товара в карты
            let item = new Product(product.id, product.title, product.price, product.description, product.image, product.category);
            let card = item.renderCard();
            appendBlock.insertAdjacentHTML('beforeend', card);
        })
    })