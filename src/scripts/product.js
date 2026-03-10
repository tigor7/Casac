document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    let response = await fetch("http://localhost:3000/products/" + id)

    let product = await response.json();

    let response2 = await fetch("../../templates/user/product-template.html");
    const template = await response2.text();

    const container = document.getElementById('product-container');
    container.innerHTML = createProduct(template, product)
});

function createProduct(template, product) {
    return template.replace(/{{name}}/g, product.name)
        .replace(/{{id}}/g, product.id)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{img}}/g, product.img)
}
