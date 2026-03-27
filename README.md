# G45_1 Proyecto de Programación Web Y Móvil: Ferretería CASAC

Plataforma web e-commerce para la ferretería CASAC con catálogo dinámico, autenticación de usuarios, carrito de compra, perfil de cliente y panel de administración.

<img src="/img/Logo_Casac.png" width="300" alt="Logo CASAC">

## Tecnologías usadas
- HTML5, CSS3 y JavaScript (vanilla).
- `json-server` para simular backend API a partir de JSON local.
- Sistema propio de composición de plantillas con `xlu-include-file.js`.
- Git, GitHub, WebStorm.
- Figma y Trello.

## Puesta en marcha

1. Instalar dependencias:

```bash
npm install
```

2. Levantar API fake con JSON Server (por defecto en `:3000`):

```bash
npx json-server database/db.json
```

Si el puerto `3000` está ocupado, usar otro (ejemplo `3001`):

```bash
npx json-server database/db.json --port 3001
```

3. Abrir `index.html` en el navegador (redirige automáticamente a `src/pages/user/home.html`).

## Cumplimiento Sprint 2

### 1) Contenido final dinámico desde JSON + templates + JavaScript

Implementado y operativo mediante:

- **Fuente de datos estructurada como base de datos:** `database/db.json`
  - Colecciones: `products`, `categories`, `users`.
- **Simulación de servidor remoto:** `json-server` sobre `http://localhost:3000`.
- **Carga dinámica del catálogo y categorías:**
  - `src/scripts/home.js` (`loadCategories`, `loadProducts`).
  - `src/scripts/shop.js` (`renderShopProducts`, filtros y búsqueda).
  - `src/scripts/product.js` (detalle de producto por `id`).
  - `src/scripts/admin-shop.js` (catálogo de administración dinámico).
- **Composición de páginas con templates reutilizables:**
  - Inyección asíncrona de `header` y `footer` con `src/xlu-include-file.js`.
  - Templates en `src/templates/user/` y `src/templates/admin/`.
  - Ejemplos: `article-template.html`, `product-template.html`, `cart-item.html`, `order-history-item.html`, `article-template-admin.html`.

Resultado: el contenido de tienda, detalle de producto, carrito y administración se construye dinámicamente desde datos JSON y plantillas reutilizables.

### 2) Formularios + validación cliente (HTML5) + autenticación y roles

Implementado con validación nativa HTML5 y lógica de sesión en cliente:

- **Formulario de inicio de sesión:** `src/pages/user/sign-in.html`
  - `type="email"`, `required`, `minlength`, `autocomplete`.
- **Formulario de registro particular:** `src/pages/user/create-account.html`
  - Validaciones `required`, `pattern`, `minlength`, `title`.
- **Formulario de registro empresa:** `src/pages/user/create-company-account.html`
  - Validación de CIF (`pattern`), teléfono y contraseña.
- **Autenticación, autorización y roles:** `src/scripts/hamburger.js`
  - Login/logout persistente (`localStorage`/`sessionStorage`).
  - Gestión de usuarios y sesión (`casacUsers`, `casacAuthSession`).
  - Protección de rutas de perfil y admin (`enforceRouteGuards`).
  - Diferenciación de rol `customer` / `admin` para navegación y acceso.

Resultado: usuarios pueden registrarse/iniciar sesión, mantener sesión activa y ver contenido adaptado según autenticación y rol.

### 3) RWD con variantes desktop, tablet y móvil

Implementado mediante media queries y layouts flex/grid en estilos globales y por vista:

- **Global:** `src/styles/styles.css`
  - Desktop, tablet y móvil para estructura general, header/footer y menú hamburguesa.
- **Usuario:** `src/styles/user/*.css`
  - Vistas adaptadas (home, shop, product, cart, profile, addresses, security, auth, order-history).
- **Admin:** `src/styles/admin/admin.css`
  - Adaptación de panel admin para tablet y móvil.

Breakpoints usados en el proyecto (según cada hoja de estilo):
- Desktop/base (estilos por defecto).
- Tablet (por ejemplo `<= 1024px` o rangos intermedios).
- Móvil (por ejemplo `<= 768px`, `<= 600px`, `<= 599px`).

Resultado: los templates cambian de distribución y navegación para tamaños grandes, medios y pequeños manteniendo funcionalidad.

## Funcionalidades principales del proyecto
- Catálogo dinámico con búsqueda y filtros por categorías.
- Detalle de producto y añadido al carrito con contador (badge).
- Carrito con ajuste de cantidades, eliminación de líneas y resumen económico.
- Checkout con alta de pedidos en historial del usuario.
- Zona de perfil (perfil, seguridad, direcciones, pedidos).
- Panel de administración con vistas de inventario y pedidos.

## Estructura de páginas HTML

### Usuario
- `src/pages/user/home.html`
- `src/pages/user/shop.html`
- `src/pages/user/product.html`
- `src/pages/user/cart.html`
- `src/pages/user/sign-in.html`
- `src/pages/user/create-account.html`
- `src/pages/user/create-company-account.html`
- `src/pages/user/profile.html`
- `src/pages/user/order-history.html`
- `src/pages/user/addresses.html`
- `src/pages/user/security.html`

### Administración
- `src/pages/admin/admin-shop.html`
- `src/pages/admin/admin-product.html`
- `src/pages/admin/admin-orders.html`

## Templates

### Usuario (`src/templates/user/`)
- `header.html`
- `footer.html`
- `article-template.html`
- `product-template.html`
- `cart-item.html`
- `order-history-item.html`
- `work-address.html`
- `home-address.html`

### Administración (`src/templates/admin/`)
- `article-template-admin.html`
- `admin-editor-template.html`
- `order-admin-template.html`

## Mockups y Storyboard
- Mockups en la carpeta `mockups/`.
- Storyboard en el material del proyecto (según entrega académica).

## Enlaces de gestión del proyecto
- Figma: https://www.figma.com/site/K98fyIQYHsdLJpAOdcwr6R/CASAC?node-id=0-1&t=mZ7nRJfE3sYH67HO-1
- Trello: https://trello.com/invite/b/699376040c2fd72f9f2c7884/ATTI0b5edf7f9c52446d6ebc2f6603a5eed3067E60B3/casac

## Autores
- Javier González Velázquez
- Pablo Santana González
- Santiago Manuel Pujol Castellanos
- Francisco Javier Monleón Peña