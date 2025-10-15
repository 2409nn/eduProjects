import {db} from './db.js'
import {Modal} from './models.js'

document.addEventListener('DOMContentLoaded', () => {
    toggleTheme(localStorage.getItem("theme"));
});

let isLoaded = false;
const cartProducts = await db.getCartProducts().then((res) => {
    isLoaded = true;
    return res;
}).catch(e => console.error(e));


function checkoutRegTable(optionalInputs, switchTab) {
    if (optionalInputs.classList.contains("active")) {
        switchTab.innerText = "Уже есть аккаунт";
        switchTab.setAttribute("data-status", "noAccount");
    }

    else {
        switchTab.innerText = "Еще нет аккаунта";
        switchTab.setAttribute("data-status", "haveAccount");
    }
}

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
    // console.log("burger menu not found");
}

// ===== SWITCH THEME =====

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


// ===== registration switch tab =====

try {

    const switchTab = document.querySelector(".reg__switch-tab");
    const optionalInputs = document.querySelector(".reg__optional-inputs");

    checkoutRegTable(optionalInputs, switchTab);

    switchTab.addEventListener("click", (e) => {
        optionalInputs.classList.toggle("active");

        checkoutRegTable(optionalInputs, switchTab);
    })

} catch (e) {}

// ===== modal edit =====

try {

    function setEditModalData() {

        const editModalData = document.querySelector(".profile__info");
        const editDataObject = {};
        editModalData.querySelectorAll("li p").forEach(p => {
            editDataObject[p.getAttribute("data-inputName")] = p.textContent;
        });

        Object.keys(editDataObject).forEach((key) => {
            const input = Array.from(editModal.getInputs()).find(input => input.name === key);
            if (input) {
                input.value = editDataObject[key]; // например, подставляем данные
            }
        });
    }

    const editModal = new Modal('edit-modal');
    const editModalTriggerBtns = Array.from(document.querySelectorAll(".edit-btn"));
    const editModalSubmit = document.querySelector("#edit-modal input[type='submit']");

    editModalTriggerBtns.forEach(btn => {

        btn.addEventListener("click", (e) => {
            setEditModalData();
            editModal.show();
        })

        editModal.closeBtn.addEventListener("click", (e) => {
            editModal.close();
        })
    })



} catch (e) {
    // console.log('edit modal not found')
}


// --- 1️⃣ Запускаем при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    checkEmptyState();

    // --- 2️⃣ Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(() => {
        checkEmptyState();
    });

    // --- 3️⃣ Следим за изменениями внутри всех секций
    document.querySelectorAll("section").forEach((section) => {
        observer.observe(section, {
            childList: true,  // следить за добавлением/удалением элементов
            subtree: true     // учитывать вложенные элементы (например, ul > li)
        });
    });
});

