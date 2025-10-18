import {db} from './db.js'

export class User {
    constructor(name, email, password, address) {
        this.username = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.id = null; // заранее создаём поле id
    }

    async init() {
        const userId = await db.addUser(this.username, this.email, this.password, this.address);
        this.id = userId; // ✅ сохраняем id в объект
        return this;
    }
}

export class Cart {
    constructor(userId) {
        this.userId = userId;
    }

    async addProduct(url, title, description, price) {
        this.productUrl = url
        this.productTitle = title
        this.productDescription = description
        this.productPrice = price

        await db.addToCart(this.userId, url, title, description, price);
    }

    async init() {
        const productId = await db.addToCart(this.userId, url, title, description, price);
        this.productId = productId;
    }

    renderProduct() {
        const insertBlock = document.querySelector(".cProducts .cProducts__items")
        const html = `<li class="cProducts__item">
                    <div class="cProducts__product">
                        <img class="cProducts__product-pic" src="${this.productUrl}" alt="product_pic">
                        <div class="cProducts__product-info">
                            <h2 class="cProducts__product-title title">${this.productTitle}</h2>
                            <div class="cProducts__product-counter counter">
                                <button class="counter-minus counter-btn">-</button>
                                <span class="counter-amount">1</span>
                                <button class="counter-plus counter-btn">+</button>
                            </div>
                            <p class="cProducts__product-description description">
                                ${this.productDescription}
                            </p>
                        </div>
                        <div class="cProducts__product-decide">
                            <button class="cProducts__product-closeBtn close-btn">
                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="36.8789" y="10.0001" width="4.95814" height="38.0124" rx="2.47907" transform="rotate(45 36.8789 10.0001)" fill="currentColor"/>
                                    <rect x="40.3848" y="36.8788" width="4.95814" height="38.0124" rx="2.47907" transform="rotate(135 40.3848 36.8788)" fill="currentColor"/>
                                </svg>
                            </button>
                            <div class="cProducts__product-buy">
                                <p class="cProducts__product-price price">$ ${this.productPrice}</p>
                                <button class="cProducts__product-buy buy-button">Купить</button>
                            </div>

                        </div>
                    </div>

                </li>`

        insertBlock.insertAdjacentHTML("beforeend", html);
    }

    async removeProduct() {
        await db.deleteCartProduct(this.productId);
    }

    getTotal() {
    }

    clear() {
    }
}

export class Product {
    constructor(id, title, price, description, image, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
        this.category = category;
    }

    renderCard(imageURL, title, description, price) {

        const href = `./product.html?` +
            `image=${encodeURIComponent(imageURL)}&` +
            `title=${encodeURIComponent(title)}&` +
            `description=${encodeURIComponent(description)}&` +
            `price=${encodeURIComponent(price)}`;

        const html = `<li class="products__item product">
                    <a href=${href} target="_blank">
                        <img src="${this.image}" alt="product_pic" class="product__image">
                        <div class="product__info">
                            <h3 class="product__title" style="border-bottom: 2px solid var(--border-color)">${this.title}</h3>
                            <div class="product__description description">
                                <p class="product__description-text">
                                    ${this.description}
                                </p>
                            </div>
                            <p class="product__price" style="text-align: center; margin-top: 15px;">${this.price} $</p>
                        </div>
                    </a>
                </li>`

        return html;
    }
}

export class Modal {
    constructor(id) {
        this.modal = document.getElementById(id);
        this.closeBtn = document.querySelector(`#${id} .close-btn`);
    }

    close() {
        this.modal.classList.remove("active");
    }

    show() {
        this.modal.classList.add("active");
    }

    getInputs() {
        return this.modal.querySelectorAll('input[name]')
    }
}