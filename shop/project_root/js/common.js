import {db} from './db.js'

// ===== Установка темы =====

const userId = localStorage.getItem("userId");
let isLoaded = false;

console.log(localStorage.getItem("email"));

// отображение количества товаров в корзине в header

export async function renderCart() {
    const cartProducts = await db.getCartProducts(userId).then((res) => {
        isLoaded = true;
        return res;
    }).catch(e => console.error(e));

    const counter = document.querySelector("header .header__cart-amount");
    const cartProductsAmount = cartProducts.length;
    counter.textContent = cartProductsAmount;
}

// отслеживание изменений в корзине


function toggleTheme(mode) {
    const root = document.documentElement;
    const currentBg = getComputedStyle(root).getPropertyValue('--body-background-color').trim();

    if (mode === 'dark') {
        // Тёмная тема
        root.style.setProperty('--body-background-color', '#0A0A0A');
        root.style.setProperty('--main-font-color', '#FFFFFF');
        root.style.setProperty('--section-background-color', '#171717');
        root.style.setProperty('--secondary-font-color', '#D0D0D0');
        root.style.setProperty('--border-color', '#e8e8e8');
        root.style.setProperty('--desc-font-color', '#D0D0D0');
        root.style.setProperty('--secondary-font-color', '#FFFFFF');
        root.style.setProperty('--main-button-background-color', '#FFFFFF');
        root.style.setProperty('--main-button-font-color', '#000000');
        root.style.setProperty('--secondary-button-font-color', '#FFFFFF');
        localStorage.setItem("theme", "dark");

    } else if (mode === 'light') {
        // Светлая тема
        root.style.setProperty('--body-background-color', '#EEEEEE');
        root.style.setProperty('--section-background-color', '#FFFFFF');
        root.style.setProperty('--secondary-font-color', '#000000');
        root.style.setProperty('--border-color', '#000000');
        root.style.setProperty('--desc-font-color', '#404040');
        root.style.setProperty('--main-font-color', '#000000');
        root.style.setProperty('--main-button-background-color', '#000000');
        root.style.setProperty('--main-button-font-color', '#FFFFFF');
        root.style.setProperty('--secondary-button-font-color', '#000000');
        localStorage.setItem("theme", "light");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    toggleTheme(localStorage.getItem("theme"));
});


// ===== кнопка-переключатель темы =====

const toggles = document.querySelectorAll('.toggle');
toggles.forEach(toggle => {
    if (localStorage.getItem("theme") === "dark") {
        toggle.setAttribute("checked", "true");
    }
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            toggleTheme('dark');

        } else {
            toggleTheme('light');
        }
    });
})

// ===== переключить вкладку регистрации =====

export function checkoutRegTable(optionalInputs, switchTab) {
    if (optionalInputs.classList.contains("active")) {
        switchTab.innerText = "Уже есть аккаунт";
        switchTab.setAttribute("data-status", "noAccount");
    }

    else {
        switchTab.innerText = "Еще нет аккаунта";
        switchTab.setAttribute("data-status", "haveAccount");
    }
}

// ===== BURGER =====

try {
    class Burger {
        constructor() {
            this.item = document.querySelector("#header__burger-menu");
            this.icon = document.querySelector(".header__burger-pic");
            this.menu = document.querySelector(".header__burger-list");
        }

        callMenu() {
            this.menu.classList.toggle("active");
            this.icon.classList.toggle("active");
        }
    }

    const burger = new Burger();
    burger.icon.addEventListener("click", (e) => {
        burger.callMenu();
    })

} catch (e) {
    console.warn("Page does not contain burger menu");
}

// ===== валидация =====

export function inputsEmptyCheck(form) {
    const checkInputs = Array.from(form.querySelectorAll("input[name]"));

    const allFilled = checkInputs.every(input => input.value.trim() !== "");
    return allFilled;
}

export function validateEmail(form) {
    const email = form.querySelector("input[type='email']").value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // базовая проверка email
    return regex.test(email);
}
