function calcPrice(priceElem, amount, operation=null) {

    let priceValue = Number(priceElem.innerText.match(/\d+/g));
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

    priceElem.innerText = total;
    return total;
}

function checkoutRegTable(optionalInputs, switchTab) {
    if (optionalInputs.classList.contains("active")) {
        switchTab.innerText = "Уже есть аккаунт";
    }

    else {
        switchTab.innerText = "Еще нет аккаунта";
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

document.addEventListener('DOMContentLoaded', () => {
    toggleTheme(localStorage.getItem("theme"));
});

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
    console.log("burger menu not found");
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

// ===== MODAL =====

class Modal {
    constructor(id) {
        this.modal = document.getElementById(id);
        this.closeBtn = document.querySelector(`#${id} .close-btn`);
    }

    close() {
        this.modal.classList.remove("active");
    }

    show() {
        this.modal.classList.add("active");
    }

    getInputs() {
        return this.modal.querySelectorAll('input[name]')
    }
}

try {
    const modal = new Modal("purchase-modal");
    const modalTriggerBtns = Array.from(document.querySelectorAll(".buy-button"));

    modalTriggerBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            modal.show();
        })
    })

    modal.closeBtn.addEventListener("click", (e) => {
        modal.close();
    })
}

catch (e) {
    console.log('modal not found')
}

// ===== counter ======

try {
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

    })

} catch (e) {
    console.log('counter not found')
}

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

// ===== remove cart item =====

document.querySelectorAll(".cProducts__product").forEach(cProduct => {
    let closeBtn = cProduct.querySelector(".close-btn");
    closeBtn.addEventListener("click", (e) => {
        cProduct.remove();
        checkEmptyState();
    })
})

// ===== modal edit =====

try {

    const editModal = new Modal('edit-modal');
    const editModalTriggerBtns = Array.from(document.querySelectorAll(".edit-btn"));
    editModalTriggerBtns.forEach(btn => {

        btn.addEventListener("click", (e) => {
            editModal.show();
        })

        editModal.closeBtn.addEventListener("click", (e) => {
            editModal.close();
        })

    })

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
} catch (e) {
    console.log('edit modal not found')
}

function checkEmptyState() {
    document.querySelectorAll("section").forEach((section) => {
        const list = section.querySelector("ul");
        const emptyState = section.querySelector(".empty-state");
        if (!list || !emptyState) return; // защита от ошибок

        console.log(list.children.length);

        if (list.children.length === 0) {
            emptyState.classList.add("active");
        } else {
            emptyState.classList.remove("active");
        }
    });
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

// ===== сохранение темы в localstorage =====
