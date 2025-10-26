import {Cart, Modal} from './models.js';
import {db} from './db.js'
import {renderCart} from './common.js';
import {onSnapshot, collection} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"

function calcPrice(priceElem, amount, operation=null) {

    let priceValue = parseFloat(priceElem.innerText.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(priceValue)) priceValue = 0;
    priceValue = Math.round(priceValue * 100) / 100; // Number

    let total;

    switch (operation) {
        case null:
            total = Number(amount) * Number(priceValue);
            break;

        case "plus":
            total = priceValue + (Number(priceValue / (Number(amount) - 1)));
            break;

        case "minus":
            total = priceValue - (Number(priceValue) / (Number(amount) + 1));
    }

    priceElem.innerText = `$ ${total}`;
    return total;
}

// отображение количества товаров в корзине
let userId = localStorage.getItem("userId");

await renderCart();
onSnapshot(collection(db.firestore, "users", userId, "cart"), async () => {
    await renderCart();
})

// загрузка данных

const ul = document.querySelector('section ul');
let isLoaded = false;
let cartProducts = await db.getCartProducts(userId)
    .then((res) => {
        isLoaded = true;
        return res;
    })
    .catch((e) => console.error(e));
const loaderSpinner = document.querySelector('#loader');

if (isLoaded) {

    // отображение элементов корзины

    const cart = new Cart(userId);

    if (cartProducts.length > 0) {
        cartProducts.forEach((product) => {
            cart.renderProduct(product.imageURL, product.title, product.description, product.price, product.id);
        })
    }

    else {
        loaderSpinner.classList.add('hidden');
        alert("Корзина пуста");
    }

    // модальные окна

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

    // выбор количества штук товара

    document.querySelectorAll(".counter").forEach(counter => {
        let minusButton = counter.querySelector(".counter-minus");
        let plusButton = counter.querySelector(".counter-plus");
        let amount = counter.querySelector(".counter-amount");
        let amountValue = Number(amount.innerText);

        const product = counter.closest(".cProducts__product");
        const priceElement = product.querySelector(".price");
        const MIN = 1;
        const MAX = 99;

        minusButton.addEventListener("click", (e) => {
            if (amountValue > MIN) {
                amountValue -= 1;
                amount.innerText = amountValue;

                calcPrice(priceElement, amountValue, "minus");
            }
        })

        plusButton.addEventListener("click", (e) => {
            if (amountValue < MAX) {
                amountValue += 1;
                amount.innerText = amountValue;
                calcPrice(priceElement, amountValue, "plus");
            }
        })

    // удаление товаров

    ul.addEventListener('click', async (e) => {
        const closeBtn = e.target.closest('.close-btn');
        if (!closeBtn) return;
        const productEl = closeBtn.closest('.cProducts__product');
        if (!productEl) return;
        const productId = productEl.getAttribute('data-productId');
        productEl.remove();
        // можно обновить БД асинхронно

        await db.deleteCartProduct(userId, productId);

    });

    loaderSpinner.classList.add('hidden');
})
}