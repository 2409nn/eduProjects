import {db} from './db.js'

const params = new URLSearchParams(window.location.search);

// Например, получить параметр "image"
const image = params.get("image");
const title = params.get("title");
const description = params.get("description");
const price = params.get("price");

document.querySelector(".productPage__image").src = image;
document.querySelector(".productPage__title").innerText = title;
document.querySelector(".productPage__description-text").innerText = description;
document.querySelector(".productPage__price").innerText = "$ " + price;

const cartBtn = document.querySelector(".productPage__cart-btn");

cartBtn.addEventListener("click", async (e) => {
    await db.addToCart(image, title, description, price);
    alert("Товар добавлен в карзину");
})