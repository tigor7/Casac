function addToCart() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    let cartItems = JSON.parse(localStorage.getItem('cartItems'))
    if (cartItems == null) {
        cartItems = []
    }
    addToCartById(cartItems, id);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function addToCartById(cartItems, id) {
    for (let cartItem of cartItems) {
        console.log(cartItem)
        if (cartItem.id === id) {
            cartItem.quantity += 1
            return
        }
    }
    cartItems.push({id: id, quantity: 1})
}