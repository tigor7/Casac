document.addEventListener('DOMContentLoaded', async () => {
    bindHomeSearchControls()
    await loadCategories()
    await loadProducts()
});

function runHomeSearch() {
    const input = document.getElementById('home-search-input')
    const query = input ? input.value.trim() : ''

    if (!query) {
        window.location.href = 'shop.html'
        return
    }

    window.location.href = `shop.html?q=${encodeURIComponent(query)}`
}

function bindHomeSearchControls() {
    const input = document.getElementById('home-search-input')
    const button = document.getElementById('home-search-btn')

    if (input) {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                runHomeSearch()
            }
        })
    }

    if (button) {
        button.addEventListener('click', runHomeSearch)
    }
}


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
    const shortDescription = product.shortDescription || product.name

    return template.replace(/{{name}}/g, product.name)
        .replace(/{{shortDescription}}/g, shortDescription)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{id}}/g, product.id)
        .replace(/{{img}}/g, product.img)
}