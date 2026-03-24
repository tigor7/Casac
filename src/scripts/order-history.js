document.addEventListener('DOMContentLoaded', async () => {
    await renderOrderHistory()
})

const ORDERS_STORAGE_KEY = 'orders'
const ORDER_TEMPLATE_PATH = '../../templates/user/order-history-item.html'
const ORDER_PLACEHOLDER_IMG = '../../../img/placeholder.png'

function getStoredOrders() {
    const orders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY))
    return Array.isArray(orders) ? orders : []
}

function formatEuros(cents) {
    return `${(Number(cents || 0) / 100).toFixed(2).replace('.', ',')}€`
}

function formatOrderDate(dateLike) {
    const date = new Date(dateLike)
    if (Number.isNaN(date.getTime())) {
        return '-'
    }

    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(date)
}

function getStatusMeta(status) {
    if (status === 'delivered') {
        return { statusClass: 'delivered', statusLabel: 'Entregado' }
    }

    return { statusClass: 'shipping', statusLabel: 'En camino' }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function buildOrderItemsMarkup(items) {
    if (!Array.isArray(items) || items.length === 0) {
        return '<p class="u-order-empty-items">Pedido sin articulos</p>'
    }

    return items.map((item) => {
        const quantity = Math.max(1, Number(item?.quantity) || 1)
        const priceCents = Math.max(0, Number(item?.priceCents) || 0)
        const lineTotalCents = Math.max(0, Number(item?.lineTotalCents) || (priceCents * quantity))
        const imgSrc = escapeHtml(item?.img || ORDER_PLACEHOLDER_IMG)
        const itemName = escapeHtml(item?.name || 'Producto')

        return `
            <div class="u-order-item">
                <img src="${imgSrc}" alt="${itemName}">
                <div class="u-order-item-meta">
                    <p>${itemName}</p>
                    <span>${quantity} x ${formatEuros(priceCents)}</span>
                </div>
                <strong>${formatEuros(lineTotalCents)}</strong>
            </div>
        `
    }).join('')
}

function createOrderCard(template, order) {
    const items = Array.isArray(order.items) ? order.items : []
    const statusMeta = getStatusMeta(order.status)

    return template
        .replace(/{{orderCode}}/g, order.id || 'CAS-000000')
        .replace(/{{date}}/g, formatOrderDate(order.createdAt))
        .replace(/{{statusClass}}/g, statusMeta.statusClass)
        .replace(/{{statusLabel}}/g, statusMeta.statusLabel)
        .replace(/{{itemsMarkup}}/g, buildOrderItemsMarkup(items))
        .replace(/{{total}}/g, formatEuros(order.totalCents))
}

function renderEmptyState(container) {
    container.innerHTML = '<p class="orders-empty">Todavia no tienes pedidos. Cuando finalices una compra, aparecera aqui.</p>'
}

async function renderOrderHistory() {
    const container = document.querySelector('.user-orders-list')
    if (!container) {
        return
    }

    const orders = getStoredOrders()
    if (orders.length === 0) {
        renderEmptyState(container)
        return
    }

    try {
        const response = await fetch(ORDER_TEMPLATE_PATH)
        if (!response.ok) {
            renderEmptyState(container)
            return
        }

        const template = await response.text()
        container.innerHTML = orders.map((order) => createOrderCard(template, order)).join('')
    } catch (error) {
        renderEmptyState(container)
    }
}


