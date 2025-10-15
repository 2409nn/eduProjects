import {db} from './db.js'
import {Modal} from "./models.js";


let cartProducts = await db.getCartProducts();
const loaderSpinner = document.querySelector('#loader');
loaderSpinner.classList.add('hidden');

const counter = document.querySelector("header .header__cart-amount");
const cartProductsAmount = cartProducts.length;
counter.textContent = cartProductsAmount;


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

    alert("Товар добавлен в корзину");
})

// ===== modals =====
const modal = new Modal("purchase-modal");
const modalTriggerBtns = Array.from(document.querySelectorAll(".buy-button"));
const purchaseModalSubmit = document.querySelector("#purchase-modal input[type='submit']");

modalTriggerBtns.forEach(trigger => {
    trigger.addEventListener("click", async (e) => {
        modal.show();
    })
})

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

modal.closeBtn.addEventListener("click", (e) => {
    modal.close();
})