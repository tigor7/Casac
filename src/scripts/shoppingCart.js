function addToCart(quantityToAdd = 1) {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    const quantity = Math.max(1, Number(quantityToAdd) || 1);

    let cartItems = JSON.parse(localStorage.getItem('cartItems'))
    if (cartItems == null) {
        cartItems = []
    }
    addToCartById(cartItems, parseInt(id), quantity);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    if (typeof updateCartBadge === 'function') {
        updateCartBadge(true);
    }

    showCartAddedToast(quantity);
}

function addToCartById(cartItems, id, quantity = 1) {
    for (let cartItem of cartItems) {
        if (cartItem.id === id) {
            cartItem.quantity += quantity
            return
        }
    }
    cartItems.push({id: id, quantity: quantity})
}

function showCartAddedToast(quantityAdded = 1) {
    let toast = document.getElementById('cart-add-toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-add-toast';
        toast.className = 'cart-add-toast';
        document.body.appendChild(toast);
    }

    toast.textContent = quantityAdded > 1
        ? `${quantityAdded} productos añadidos al carrito`
        : 'Producto añadido al carrito';

    toast.classList.remove('show');
    // Reinicia la animación para pulsaciones consecutivas
    void toast.offsetWidth;
    toast.classList.add('show');

    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 1400);
}
