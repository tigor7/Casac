function safeParseCartItems() {
    try {
        const parsed = JSON.parse(localStorage.getItem('cartItems'))
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        return []
    }
}

function createCartProductSnapshot(productData) {
    if (!productData || typeof productData !== 'object') {
        return null;
    }

    const id = Number(productData.id);
    if (!Number.isFinite(id) || id <= 0) {
        return null;
    }

    return {
        id,
        name: String(productData.name || `Producto #${id}`),
        price: Math.max(0, Number(productData.price) || 0),
        img: String(productData.img || '../../../img/placeholder.png')
    };
}

function resolveProductId(productData) {
    const fromProductData = Number(productData?.id);
    if (Number.isFinite(fromProductData) && fromProductData > 0) {
        return fromProductData;
    }

    const searchParams = new URLSearchParams(window.location.search);
    return Number(searchParams.get('id'));
}

function addToCart(quantityToAdd = 1, productData = null) {
    const id = resolveProductId(productData);
    const quantity = Math.max(1, Number(quantityToAdd) || 1);
    const snapshot = createCartProductSnapshot(productData);

    if (!Number.isFinite(id) || id <= 0) {
        return;
    }

    let cartItems = safeParseCartItems()
    addToCartById(cartItems, id, quantity, snapshot);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    if (typeof updateCartBadge === 'function') {
        updateCartBadge(true);
    }

    showCartAddedToast(quantity);
}

function addToCartById(cartItems, id, quantity = 1, snapshot = null) {
    for (let cartItem of cartItems) {
        if (Number(cartItem.id) === id) {
            cartItem.quantity += quantity
            if (snapshot) {
                cartItem.name = snapshot.name
                cartItem.price = snapshot.price
                cartItem.img = snapshot.img
            }
            return
        }
    }

    const newItem = {id: id, quantity: quantity}
    if (snapshot) {
        newItem.name = snapshot.name
        newItem.price = snapshot.price
        newItem.img = snapshot.img
    }

    cartItems.push(newItem)
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
