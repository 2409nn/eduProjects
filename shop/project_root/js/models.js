export class User {
    constructor(name, email, password, address) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
    }

    // для регистрации на auth.js
    checkPassword(password) {
        if (password === this.password) {
            return true;
        }
    }
}

export class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    getTotalPrice() {

    }
}

export class Cart {
    constructor() {}

    addProduct(product) {
    }

    removeProduct(productId) {
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

        let href = "./product.html?" + `image=${imageURL}&title=${title}&description=${description}&price=${price}`;
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
