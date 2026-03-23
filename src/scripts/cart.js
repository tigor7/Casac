document.addEventListener('DOMContentLoaded', async () => {
    await loadCartItems()
})

async function loadCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'))
    if (!Array.isArray(cartItems)) {
        cartItems = []
    }

    let response = await fetch("../../templates/user/cart-item.html");
    const template = await response.text();

    const container = document.getElementById('cart-items-list');
    container.innerHTML = ""

    if (cartItems.length === 0) {
        container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'
        return
    }

    for (let cartItem of cartItems) {
        let res = await fetch("http://localhost:3000/products/" + cartItem.id)
        if (!res.ok) {
            continue
        }
        const product = await res.json()
        container.innerHTML += createCartItem(template, product, cartItem)
    }


}

function createCartItem(template, product, cartItem) {
    return template.replace(/{{name}}/g, product.name)
        .replace(/{{id}}/g, product.id)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{img}}/g, product.img)
        .replace(/{{quantity}}/g, cartItem.quantity)
}

function removeCartItem(id) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'))
    if (!Array.isArray(cartItems)) {
        cartItems = []
    }

    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            cartItems.splice(i, 1);
            break
        }
    }

    const row = document.getElementById(id)
    if (row) {
        row.outerHTML = ""
    }

    if (cartItems.length === 0) {
        const container = document.getElementById('cart-items-list')
        if (container) {
            container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'
        }
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

}