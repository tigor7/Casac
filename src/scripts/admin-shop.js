let adminProducts = []
let adminCategoriesById = {}
let adminTemplate = ''
let adminQuery = ''

document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.getElementById('admin-search-input')
    adminQuery = searchInput ? searchInput.value : ''

    const [productsResponse, categoriesResponse, templateResponse] = await Promise.all([
        fetch('http://localhost:3000/products'),
        fetch('http://localhost:3000/categories'),
        fetch('../../templates/admin/article-template-admin.html')
    ])

    adminProducts = await productsResponse.json()
    const categories = await categoriesResponse.json()
    adminTemplate = await templateResponse.text()

    adminCategoriesById = categories.reduce((acc, category) => {
        acc[category.id] = category.name
        return acc
    }, {})

    bindAdminSearchControls()
    renderAdminProducts()
})

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function productSku(product) {
    return `CAS-${String(product.id || 0).padStart(4, '0')}`
}

function productCategoryNames(product) {
    if (!Array.isArray(product.categories)) {
        return []
    }

    return product.categories
        .map((categoryId) => adminCategoriesById[categoryId])
        .filter(Boolean)
}

function matchesAdminQuery(product, query) {
    const normalizedQuery = normalizeText(query)
    if (!normalizedQuery) {
        return true
    }

    const text = normalizeText([
        product.name,
        product.shortDescription,
        product.description,
        productSku(product),
        ...productCategoryNames(product)
    ].join(' '))

    return text.includes(normalizedQuery)
}

function filteredAdminProducts() {
    return adminProducts.filter((product) => matchesAdminQuery(product, adminQuery))
}

function renderAdminProducts() {
    const container = document.getElementById('admin-products-grid')
    if (!container) {
        return
    }

    const products = filteredAdminProducts()
    if (products.length === 0) {
        container.innerHTML = '<p class="search-empty">No hay productos que coincidan con el filtro.</p>'
        return
    }

    container.innerHTML = products.map((product) => createAdminProduct(adminTemplate, product)).join('')
}

function runAdminSearch() {
    const searchInput = document.getElementById('admin-search-input')
    adminQuery = searchInput ? searchInput.value : ''
    renderAdminProducts()
}

function bindAdminSearchControls() {
    const searchInput = document.getElementById('admin-search-input')
    const searchButton = document.getElementById('admin-search-btn')

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                runAdminSearch()
            }
        })
    }

    if (searchButton) {
        searchButton.addEventListener('click', runAdminSearch)
    }
}

function createAdminProduct(template, product) {
    return template
        .replace(/{{id}}/g, product.id)
        .replace(/{{name}}/g, product.name)
        .replace(/{{price}}/g, (Number(product.price || 0) / 100).toFixed(2).replace('.', ','))
        .replace(/{{img}}/g, product.img || '../../../img/placeholder.png')
}

