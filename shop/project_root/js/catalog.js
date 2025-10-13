class Product {
    constructor(id, title, price, description, image, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
        this.category = category;
    }

    renderCard() {
        const html = `<li class="products__item product">
                    <a href="./product.html" target="_blank">
                        <img src="${this.image}" alt="product_pic" class="product__image">
                        <div class="product__info">
                            <h3 class="product__title" style="border-bottom: 2px solid black">${this.title}</h3>
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
}// вернёт HTML карточки } 👉 используется в catalog.js и product.js.

export default Product;