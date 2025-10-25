import {db} from './db.js'
import {Modal} from "./models.js";
import {renderCart} from './common.js';
import {onSnapshot, collection} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"

const loaderSpinner = document.getElementById('loader');
loaderSpinner.classList.add('hidden');

// отображение количества товаров в корзине
const userId = localStorage.getItem("userId");

await renderCart();
onSnapshot(collection(db.firestore, "users", userId, "cart"), async () => {
    await renderCart();
})

// подгрузка данных о товаре
const params = new URLSearchParams(window.location.search);

const image = params.get("image");
const title = params.get("title");
const description = params.get("description");
const price = params.get("price");

document.querySelector(".productPage__image").src = image;
document.querySelector(".productPage__title").innerText = title;
document.querySelector(".productPage__description-text").innerText = description;
document.querySelector(".productPage__price").innerText = "$ " + price;

// обработка кнопки "добавить в корзину"
const cartBtn = document.querySelector(".productPage__cart-btn");
cartBtn.addEventListener("click", async (e) => {
    loaderSpinner.classList.remove('hidden');

    const userId = await db.getCurrentUserId();
    localStorage.setItem("userId", userId);
    console.log(userId);
    await db.addToCart(userId, image, title, description, price);

    loaderSpinner.classList.add('hidden');
    alert("Товар добавлен в корзину");
})

// Модальное окно оформления покупки
const modal = new Modal("purchase-modal");
const modalTriggerBtns = Array.from(document.querySelectorAll(".buy-button"));
const purchaseModalSubmit = document.querySelector("#purchase-modal input[type='submit']");

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