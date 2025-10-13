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

const toggle = document.getElementById('toggle');

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        console.log('Включено');
        document.body.style.backgroundColor = '#d1ffd6';
    } else {
        console.log('Выключено');
        document.body.style.backgroundColor = '#f0f0f0';
    }
});

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