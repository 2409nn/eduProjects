class User {
    constructor(name, email, password, address) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
    }

    // для регистрации на auth.js
    checkPassword(password) {
        if (password === this.password) {
            return true;
        }
    }
}

class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    getTotalPrice() {

    }
}

class Cart {
    constructor() {}

    addProduct(product) {
    }

    removeProduct(productId) {
    }

    getTotal() {
    }

    clear() {
    }
}