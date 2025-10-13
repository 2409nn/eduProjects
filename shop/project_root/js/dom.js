// ====== BURGER ======

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

});