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

const modal = new Modal("purchase-modal");
const modalTriggerBtn = document.querySelector(".productPage__buy-btn");

modalTriggerBtn.addEventListener("click", (e) => {
    modal.show();
})

modal.closeBtn.addEventListener("click", (e) => {
    modal.close();
})
