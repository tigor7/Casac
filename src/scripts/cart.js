document.addEventListener('DOMContentLoaded', async () => {
    await loadCartItems()
})

async function loadCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems'))

    let response = await fetch("../../templates/user/cart-item.html");
    const template = await response.text();

    const container = document.getElementById('cart-box');

    for (let cartItem of cartItems) {
        let res = await fetch("http://localhost:3000/products/" + cartItem.id)
        console.log(res)
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
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            console.log(cartItems[i])
            cartItems.splice(i, 1);
            break
        }
    }

    document.getElementById(id).outerHTML = ""

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

}