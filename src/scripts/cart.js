document.addEventListener('DOMContentLoaded', async () => {
    bindCheckoutButton()
    await loadCartItems()
})

const TAX_RATE = 0.21
const SHIPPING_CENTS = 0
const CART_ORDERS_STORAGE_KEY = 'orders'
const PRODUCT_PLACEHOLDER_IMG = '../../../img/placeholder.png'

function normalizeCartItems(rawItems) {
    if (!Array.isArray(rawItems)) {
        return []
    }

    const normalized = []

    for (const rawItem of rawItems) {
        const id = Number(rawItem?.id ?? rawItem?.productId)
        const quantity = Math.max(1, Number(rawItem?.quantity) || 1)

        if (!Number.isFinite(id) || id <= 0) {
            continue
        }

        const normalizedSnapshot = {
            name: typeof rawItem?.name === 'string' ? rawItem.name : undefined,
            price: Number.isFinite(Number(rawItem?.price)) ? Math.max(0, Number(rawItem.price)) : undefined,
            img: typeof rawItem?.img === 'string' ? rawItem.img : undefined
        }

        const existing = normalized.find((item) => item.id === id)
        if (existing) {
            existing.quantity += quantity
            if (normalizedSnapshot.name) existing.name = normalizedSnapshot.name
            if (Number.isFinite(normalizedSnapshot.price)) existing.price = normalizedSnapshot.price
            if (normalizedSnapshot.img) existing.img = normalizedSnapshot.img
            continue
        }

        const normalizedItem = { id, quantity }
        if (normalizedSnapshot.name) normalizedItem.name = normalizedSnapshot.name
        if (Number.isFinite(normalizedSnapshot.price)) normalizedItem.price = normalizedSnapshot.price
        if (normalizedSnapshot.img) normalizedItem.img = normalizedSnapshot.img

        normalized.push(normalizedItem)
    }

    return normalized
}

function safeReadCartItems() {
    try {
        return JSON.parse(localStorage.getItem('cartItems'))
    } catch (error) {
        return []
    }
}

function getStoredCartItems() {
    const rawCartItems = safeReadCartItems()
    const normalized = normalizeCartItems(rawCartItems)

    if (!Array.isArray(rawCartItems) || rawCartItems.length !== normalized.length) {
        localStorage.setItem('cartItems', JSON.stringify(normalized))
    }

    return normalized
}

function saveCartItems(cartItems) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

function getStoredOrders() {
    const orders = JSON.parse(localStorage.getItem(CART_ORDERS_STORAGE_KEY))
    return Array.isArray(orders) ? orders : []
}

function saveOrders(orders) {
    localStorage.setItem(CART_ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

async function loadCartItems() {
    const cartItems = getStoredCartItems()

    let template = ''
    try {
        const response = await fetch("../../templates/user/cart-item.html")
        template = await response.text()
    } catch (error) {
        template = ''
    }

    if (!template || !template.includes('{{id}}')) {
        template = `<div class="cart-product-row" id="{{id}}"><div class="cell-product"><div class="product-img-box"><img src="{{img}}" alt="Producto"></div><span class="product-title">{{name}}</span></div><div class="cell-delete"><button class="icon-del" onclick="removeCartItem({{id}})">✕</button></div><div class="cell-qty"><div class="qty-selector"><button type="button" onclick="changeCartItemQuantity({{id}}, -1)">-</button><span>{{quantity}}</span><button type="button" onclick="changeCartItemQuantity({{id}}, 1)">+</button></div></div><div class="cell-price"><span class="price-value">{{price}}€</span></div></div>`
    }

    const container = document.getElementById('cart-items-list');
    container.innerHTML = ""

    if (cartItems.length === 0) {
        container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'
        setSummaryValues(0)
        return
    }

    const snapshot = await getCartSnapshot(cartItems)

    if (snapshot.items.length === 0) {
        container.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>'
        setSummaryValues(0)
        return
    }

    for (const item of snapshot.items) {
        container.innerHTML += createCartItem(template, item.product, item.cartItem)
    }

    setSummaryValues(snapshot.subtotalCents)


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

    const snapshot = await getCartSnapshot(cartItems)
    setSummaryValues(snapshot.subtotalCents)
}

async function getCartSnapshot(cartItems) {
    const catalogById = await getCatalogById()
    const items = []
    let subtotalCents = 0

    for (const cartItem of cartItems) {
        const product = await resolveProduct(catalogById, cartItem.id, cartItem)
        if (!product) {
            continue
        }

        subtotalCents += product.price * cartItem.quantity
        items.push({
            cartItem,
            product
        })
    }

    return {
        items,
        subtotalCents
    }
}

function normalizeProduct(product, id) {
    return {
        id: Number(product?.id) || Number(id) || 0,
        name: String(product?.name || `Producto #${id}`),
        price: Math.max(0, Number(product?.price) || 0),
        img: String(product?.img || PRODUCT_PLACEHOLDER_IMG)
    }
}

async function getCatalogById() {
    const endpoints = [
        'http://localhost:3000/products',
        '/database/db.json',
        '../../../database/db.json'
    ]

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint)
            if (!response.ok) {
                continue
            }

            const payload = await response.json()
            const products = Array.isArray(payload) ? payload : payload?.products
            if (!Array.isArray(products)) {
                continue
            }

            const byId = new Map()
            products.forEach((product) => {
                const id = Number(product?.id)
                if (!Number.isFinite(id) || id <= 0) {
                    return
                }
                byId.set(id, normalizeProduct(product, id))
            })

            return byId
        } catch (error) {
            // Probamos con el siguiente endpoint
        }
    }

    return new Map()
}

async function resolveProduct(catalogById, id, cartItem = null) {
    const numericId = Number(id)
    if (!Number.isFinite(numericId) || numericId <= 0) {
        return null
    }

    const fromCatalog = catalogById.get(numericId)
    if (fromCatalog) {
        return fromCatalog
    }

    if (cartItem && (cartItem.name || Number.isFinite(Number(cartItem.price)) || cartItem.img)) {
        return normalizeProduct({
            id: numericId,
            name: cartItem.name,
            price: cartItem.price,
            img: cartItem.img
        }, numericId)
    }

    try {
        const response = await fetch('http://localhost:3000/products/' + numericId)
        if (response.ok) {
            const product = await response.json()
            return normalizeProduct(product, numericId)
        }
    } catch (error) {
        // Si falla red/servidor mostramos item mínimo con placeholder
    }

    return normalizeProduct(null, numericId)
}

function buildOrderFromSnapshot(snapshot) {
    const subtotalCents = snapshot.subtotalCents
    const taxesCents = Math.round(subtotalCents * TAX_RATE)
    const totalCents = subtotalCents + SHIPPING_CENTS + taxesCents

    return {
        id: `CAS-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: 'shipping',
        items: snapshot.items.map(({ cartItem, product }) => ({
            id: product.id,
            name: product.name,
            img: product.img,
            priceCents: product.price,
            quantity: cartItem.quantity,
            lineTotalCents: product.price * cartItem.quantity
        })),
        subtotalCents,
        taxesCents,
        shippingCents: SHIPPING_CENTS,
        totalCents
    }
}

async function handleCheckout() {

    if (typeof isUserLoggedIn === 'function' && !isUserLoggedIn()) {
        const next = `${window.location.pathname}${window.location.search || ''}`
        const params = new URLSearchParams()
        params.set('reason', 'auth-required')
        params.set('next', next)
        window.location.href = `sign-in.html?${params.toString()}`
        return
    }

    const cartItems = getStoredCartItems()
    if (cartItems.length === 0) {
        return
    }

    const snapshot = await getCartSnapshot(cartItems)
    if (snapshot.items.length === 0) {
        return
    }

    const order = buildOrderFromSnapshot(snapshot)
    const orders = getStoredOrders()
    orders.unshift(order)
    saveOrders(orders)

    saveCartItems([])
    window.location.href = 'order-history.html'
}

function bindCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-btn')
    if (!checkoutButton || checkoutButton._checkoutBound) {
        return
    }

    checkoutButton._checkoutBound = true
    checkoutButton.addEventListener('click', handleCheckout)
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