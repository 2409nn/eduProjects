import {db} from './db.js'
import {Modal} from "./models.js";

const loaderSpinner = document.getElementById('loader');
loaderSpinner.classList.add('hidden');
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

    loaderSpinner.classList.remove('hidden');
    await db.addToCart(image, title, description, price);
    loaderSpinner.classList.add('hidden');

    alert("Товар добавлен в карзину");
})

// ===== modals =====
const modal = new Modal("purchase-modal");
const modalTriggerBtns = Array.from(document.querySelectorAll(".buy-button"));
const purchaseModalSubmit = document.querySelector("#purchase-modal input[type='submit']");
console.log(modalTriggerBtns);

purchaseModalSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Заказ оформлен!");
    modal.close();
})

modalTriggerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        modal.show();
    })
})

modal.closeBtn.addEventListener("click", (e) => {
    modal.close();
})