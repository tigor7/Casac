let allProducts = []
let categoryFilterId = null
let currentQuery = ''
let productTemplate = ''

document.addEventListener('DOMContentLoaded', async () => {
    const searchParams = new URLSearchParams(window.location.search)
    const idParam = Number(searchParams.get('id'))

    categoryFilterId = Number.isInteger(idParam) && idParam > 0 ? idParam : null
    currentQuery = searchParams.get('q') || ''

    const response = await fetch("http://localhost:3000/products/")
    allProducts = await response.json()

    const response2 = await fetch("../../templates/user/article-template.html")
    productTemplate = await response2.text()

    bindShopSearchControls()
    renderShopProducts()
})

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function matchesTextQuery(product, normalizedQuery) {
    if (!normalizedQuery) {
        return true
    }

    const searchText = normalizeText([
        product.name,
        product.shortDescription,
        product.description
    ].join(' '))

    return searchText.includes(normalizedQuery)
}

function getFilteredProducts() {
    const normalizedQuery = normalizeText(currentQuery)

    return allProducts.filter((product) => {
        const matchesCategory = categoryFilterId == null
            ? true
            : Array.isArray(product.categories) && product.categories.includes(categoryFilterId)

        return matchesCategory && matchesTextQuery(product, normalizedQuery)
    })
}

function updateShopUrl() {
    const params = new URLSearchParams()

    if (categoryFilterId != null) {
        params.set('id', String(categoryFilterId))
    }

    if (currentQuery.trim()) {
        params.set('q', currentQuery.trim())
    }

    const nextQuery = params.toString()
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`
    window.history.replaceState({}, '', nextUrl)
}

function renderShopProducts() {
    const container = document.getElementById('shop-grid')
    if (!container) {
        return
    }

    const filteredProducts = getFilteredProducts()
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="search-empty">No se encontraron productos para esa busqueda.</p>'
        return
    }

    container.innerHTML = filteredProducts.map((product) => createProduct(productTemplate, product)).join('')
}

function runShopSearch() {
    const searchInput = document.getElementById('shop-search-input')
    currentQuery = searchInput ? searchInput.value : ''
    updateShopUrl()
    renderShopProducts()
}

function bindShopSearchControls() {
    const searchInput = document.getElementById('shop-search-input')
    const searchButton = document.getElementById('shop-search-btn')

    if (searchInput) {
        searchInput.value = currentQuery
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                runShopSearch()
            }
        })
    }

    if (searchButton) {
        searchButton.addEventListener('click', runShopSearch)
    }
}

function createProduct(template, product) {
    const shortDescription = product.shortDescription || product.name

    return template.replace(/{{name}}/g, product.name)
        .replace(/{{shortDescription}}/g, shortDescription)
        .replace(/{{id}}/g, product.id)
        .replace(/{{price}}/g, product.price / 100)
        .replace(/{{img}}/g, product.img)
}
