import {CartItem, Cart, Modal} from './models.js';
import {db} from './db.js'


function calcPrice(priceElem, amount, operation=null) {

    let priceValue = parseFloat(priceElem.innerText.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(priceValue)) priceValue = 0;
    priceValue = Math.round(priceValue * 100) / 100; // Number
    console.log(priceValue); // например: 12.3 или 12.34 или 12

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

const ul = document.querySelector('section ul');
const emptyState = document.querySelector('section .empty-state');

// после асинхронного рендера — скрываем лоадер и делаем проверку
let isLoaded = false;
let cartProducts = await db.getCartProducts()
    .then((res) => {
        isLoaded = true;
        return res;
    })
    .catch((e) => console.error(e));
const loaderSpinner = document.querySelector('#loader');

if (isLoaded) {

    // ===== рендеринг товаров =====
    cartProducts.forEach(cProduct => {
        const cart = new Cart(cProduct, cProduct.id);
        cart.renderProduct();
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


// ===== counter ======

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

    // ===== удаление товаров =====

    ul.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close-btn');
        if (!closeBtn) return;
        const productEl = closeBtn.closest('.cProducts__product');
        if (!productEl) return;
        const productId = productEl.getAttribute('data-productId');
        productEl.remove();
        // можно обновить БД асинхронно

        db.deleteCartProduct(productId);

    });

    loaderSpinner.classList.add('hidden');
})
}