import {CartItem, Cart} from './models.js';
import {db} from './db.js'

// CartItem

var cartProducts = await db.getCartProducts().then()

cartProducts.forEach(cProduct => {
    const cart = new Cart(cProduct);
    cart.renderProduct();

    console.log(cProduct);
})
