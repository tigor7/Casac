document.addEventListener('DOMContentLoaded', async () => {
    await loadCartItems()
})

const TAX_RATE = 0.21
const SHIPPING_CENTS = 0

function getStoredCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems'))
    return Array.isArray(cartItems) ? cartItems : []
}

function saveCartItems(cartItems) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

async function loadCartItems() {
    const cartItems = getStoredCartItems()

    let response = await fetch("../../templates/user/cart-item.html");
    const template = await response.text();

    const container = document.getElementById('cart-items-list');
    container.innerHTML = ""

    if (cartItems.length === 0) {
        container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'
        setSummaryValues(0)
        return
    }

    let subtotalCents = 0

    for (let cartItem of cartItems) {
        let res = await fetch("http://localhost:3000/products/" + cartItem.id)
        if (!res.ok) {
            continue
        }
        const product = await res.json()
        subtotalCents += product.price * cartItem.quantity
        container.innerHTML += createCartItem(template, product, cartItem)
    }

    setSummaryValues(subtotalCents)


}

function createCartItem(template, product, cartItem) {
    return template.replace(/{{name}}/g, product.name)
        .replace(/{{id}}/g, product.id)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{img}}/g, product.img)
        .replace(/{{quantity}}/g, cartItem.quantity)
}

function formatEuros(cents) {
    return `${(cents / 100).toFixed(2).replace('.', ',')}€`
}

function setSummaryValues(subtotalCents) {
    const subtotalEl = document.getElementById('summary-subtotal')
    const shippingEl = document.getElementById('summary-shipping')
    const taxesEl = document.getElementById('summary-taxes')
    const totalEl = document.getElementById('summary-total')

    const taxesCents = Math.round(subtotalCents * TAX_RATE)
    const totalCents = subtotalCents + SHIPPING_CENTS + taxesCents

    if (subtotalEl) subtotalEl.textContent = formatEuros(subtotalCents)
    if (shippingEl) shippingEl.textContent = SHIPPING_CENTS === 0 ? 'Gratis' : formatEuros(SHIPPING_CENTS)
    if (taxesEl) taxesEl.textContent = formatEuros(taxesCents)
    if (totalEl) totalEl.textContent = formatEuros(totalCents)
}

async function refreshCartSummary() {
    const cartItems = getStoredCartItems()

    if (cartItems.length === 0) {
        setSummaryValues(0)
        return
    }

    let subtotalCents = 0

    for (const cartItem of cartItems) {
        const res = await fetch("http://localhost:3000/products/" + cartItem.id)
        if (!res.ok) {
            continue
        }

        const product = await res.json()
        subtotalCents += product.price * cartItem.quantity
    }

    setSummaryValues(subtotalCents)
}

async function removeCartItem(id) {
    let cartItems = getStoredCartItems()

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

    saveCartItems(cartItems);
    await refreshCartSummary()

}

async function changeCartItemQuantity(id, delta) {
    let cartItems = getStoredCartItems()
    let nextQuantity = 0

    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            cartItems[i].quantity += delta
            nextQuantity = cartItems[i].quantity

            if (cartItems[i].quantity <= 0) {
                cartItems.splice(i, 1)

                const row = document.getElementById(id)
                if (row) {
                    row.outerHTML = ""
                }
            }

            break
        }
    }

    if (nextQuantity > 0) {
        const row = document.getElementById(id)
        if (row) {
            const quantityLabel = row.querySelector('.qty-selector span')
            if (quantityLabel) {
                quantityLabel.textContent = String(nextQuantity)
            }
        }
    }

    if (cartItems.length === 0) {
        const container = document.getElementById('cart-items-list')
        if (container) {
            container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'
        }
    }

    saveCartItems(cartItems)
    await refreshCartSummary()
}