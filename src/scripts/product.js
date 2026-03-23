document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    let response = await fetch("http://localhost:3000/products/" + id)

    let product = await response.json();

    let response2 = await fetch("../../templates/user/product-template.html");
    const template = await response2.text();

    const container = document.getElementById('product-container');
    container.innerHTML = createProduct(template, product)

    initProductQuantityControls();
});

function initProductQuantityControls() {
    const qtyNum = document.getElementById('product-qty-num');
    const decreaseBtn = document.querySelector('[data-qty-action="decrease"]');
    const increaseBtn = document.querySelector('[data-qty-action="increase"]');
    const addBtn = document.getElementById('add-to-cart-btn');

    if (!qtyNum || !decreaseBtn || !increaseBtn || !addBtn) {
        return;
    }

    let selectedQty = 1;

    const renderQty = () => {
        qtyNum.textContent = String(selectedQty);
    };

    decreaseBtn.addEventListener('click', () => {
        selectedQty = Math.max(1, selectedQty - 1);
        renderQty();
    });

    increaseBtn.addEventListener('click', () => {
        selectedQty += 1;
        renderQty();
    });

    addBtn.addEventListener('click', () => {
        addToCart(selectedQty);
    });
}

function createProduct(template, product) {
    return template.replace(/{{name}}/g, product.name)
        .replace(/{{id}}/g, product.id)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{img}}/g, product.img)
}
