import {CartItem, Cart, Modal} from './models.js';
import {db} from './db.js'


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

    purchaseModalSubmit.addEventListener("click", (e) => {
        e.preventDefault();

        // Получаем все input'ы формы по правильным селекторам
        const cardNumber = document.querySelector("#purchase-modal input[name='card-number']");
        const cvv = document.querySelector("#purchase-modal input[name='password']"); // исправлено на password
        const cardHolder = document.querySelector("#purchase-modal #modal__card-user"); // исправлено на id
        const expiryDate = document.querySelector("#purchase-modal input[name='expiry-date']");

        // Проверяем, что все элементы найдены
        if (!cardNumber || !cvv || !cardHolder || !expiryDate) {
            console.error("Один или несколько элементов формы не найдены");
            console.log({cardNumber, cvv, cardHolder, expiryDate});
            alert("Ошибка формы. Пожалуйста, обновите страницу.");
            return;
        }

        // Сбрасываем стили ошибок
        const inputs = [cardNumber, cvv, cardHolder, expiryDate];

        let isValid = true;
        let errorMessage = "";

        // Проверка на заполненность полей
        if (!cardNumber.value.trim()) {
            isValid = false;
        }
        if (!cvv.value.trim()) {
            isValid = false;
        }
        if (!cardHolder.value.trim()) {
            isValid = false;
        }
        if (!expiryDate.value.trim()) {
            isValid = false;
        }

        // Если есть пустые поля, показываем ошибку и прерываем выполнение
        if (!isValid) {
            alert("Пожалуйста, заполните все поля" + errorMessage);
            return;
        }

        // Валидация номера карты (16 цифр)
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(cardNumber.value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = "Номер карты должен содержать 16 цифр\n";
        }

        // Валидация CVV (3 цифры, так как maxlength="3")
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(cvv.value)) {
            isValid = false;
            errorMessage += "CVV код должен содержать 3 цифры\n";
        }

        // Валидация имени владельца (только буквы и пробелы)
        const cardHolderRegex = /^[A-Za-zА-Яа-я\s]+$/;
        if (!cardHolderRegex.test(cardHolder.value.trim()) || cardHolder.value.trim().length < 2) {
            isValid = false;
            errorMessage += "Имя владельца должно содержать только буквы и быть не короче 2 символов\n";
        }

        // Валидация даты (для type="date" формат будет YYYY-MM-DD)
        if (!expiryDate.value) {
            isValid = false;
            errorMessage += "Дата должна быть выбрана\n";
        } else {
            // Дополнительная проверка на актуальность даты для type="date"
            const expiry = new Date(expiryDate.value);
            const now = new Date();

            if (expiry < now) {
                isValid = false;
                errorMessage += "Срок действия карты истек\n";
            }
        }

        // Если все поля валидны, показываем сообщение и закрываем модальное окно
        if (isValid) {
            alert("Заказ оформлен!");
            modal.close();

            // Очищаем форму после успешной отправки
            cardNumber.value = "";
            cvv.value = "";
            cardHolder.value = "";
            expiryDate.value = "";
        } else {
            alert("Пожалуйста, проверьте правильность введенных данных:\n" + errorMessage);
        }
    });

    modalTriggerBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            modal.show();
        })
    })

    modal.closeBtn.addEventListener("click", (e) => {
        modal.close();
    })


// ===== counter ======

    // ===== счетчик товаров в корзине =====

    const counter = document.querySelector("header .header__cart-amount");
    const cartProductsAmount = cartProducts.length;
    counter.textContent = cartProductsAmount;

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