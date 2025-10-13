const API_URL = "https://fakestoreapi.com";

async function getProducts() {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
}
async function getProductById(id) {
    const res = await fetch(`${API_URL}/products/${id}`);
    return res.json();
}

async function getCategories() {
    const res = await fetch(`${API_URL}/products/categories`);
    return res.json();
}
async function getProductsByCategory(category) {
    const res = await fetch(`${API_URL}/products/category/${category}`);
    return res.json();
}

export {getProducts, getProductById, getCategories, getProductsByCategory};