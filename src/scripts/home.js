document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories()
    await loadProducts()
});


async function loadCategories() {
    let response = await fetch("http://localhost:3000/categories");
    let categories = await response.json();



    const container = document.getElementById('categories-box');
    container.innerHTML = '';
    for (let category of categories) {
        container.innerHTML += `<a href="shop.html?id=${category.id}">${category.name}</a>`
    }
}

async function loadProducts() {
    let response = await fetch("http://localhost:3000/products");
    let products = await response.json();

    let response2 = await fetch("../../templates/user/article-template.html");
    const template = await response2.text();

    const container = document.getElementById('grid-productos');
    for (let product of products) {
        container.innerHTML += createProduct(template, product)
    }
}

function createProduct(template, product) {
    return template.replace(/{{name}}/g, product.name)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{id}}/g, product.id)
        .replace(/{{img}}/g, product.img)
}