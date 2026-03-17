document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search);

    let response = await fetch("http://localhost:3000/products/")
    let products = await response.json();

    if (searchParams.has('id')) {
        const id = searchParams.get('id');
        products = products.filter(product => product.categories.includes(parseInt(id)))
    }

    let response2 = await fetch("../../templates/user/article-template.html");
    const template = await response2.text();

    const container = document.getElementById('shop-grid');
    container.innerHTML = "";
    for (let product of products) {
        container.innerHTML += createProduct(template, product)
    }
});

function createProduct(template, product) {
    return template.replace(/{{name}}/g, product.name)
        .replace(/{{id}}/g, product.id)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{img}}/g, product.img)
}
