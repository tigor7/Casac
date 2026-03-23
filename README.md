# G45_1 Proyecto de Programación Web Y Móvil: Ferretería CASAC

Plataforma de comercio electrónico (e-commerce) para la ferretería CASAC. La aplicación web permite a los usuarios explorar un catálogo de herramientas y materiales segmentado por categorías (jardinería, carpintería, fontanería, etc.), visualizar detalles de productos y gestionar un carrito de la compra.

El sistema cuenta con un panel de usuario completo donde se puede gestionar la información personal, libretas de direcciones y consultar el historial de compras. Además, diferencia entre cuentas de clientes particulares y cuentas de empresa. También incluye un panel de administración exclusivo para gestionar el inventario (editar precios, descuentos e información) y el estado de los pedidos de los clientes.

<img src="/img/Logo_Casac.png" width="300">

## Tecnologías usadas
- HTML5, CSS3, JavaScript
- Sistema de inyección de componentes propios (`xlu-include-file.js`)
- Git, GitHub, WebStorm
- Figma, Trello

## Funcionalidades principales
- **Navegación y Catálogo:** El usuario puede buscar artículos y filtrar por las distintas áreas profesionales desde la página principal.
- **Gestión de Carrito:** Los usuarios pueden añadir productos, modificar cantidades, aplicar códigos de descuento y visualizar el desglose de precios (subtotal, envío, impuestos) antes de finalizar la compra.
- **Perfiles de Usuario:** Existen diferentes flujos de registro. Una vez dentro, el usuario tiene un panel con un menú lateral para navegar entre su información personal, seguridad, direcciones de envío y un historial detallado de pedidos.
- **Panel de Administración (Admin):** Interfaz restringida donde los gestores de la ferretería pueden ver el catálogo en modo edición y acceder a un editor visual para modificar imágenes, títulos, descripciones, precios y descuentos de los productos.

## Página de inicio de la aplicación web
- `index.html` (Punto de entrada principal de la tienda).
- `src/pages/user/home.html` (Vista Home de usuario).

## Nombre y ubicación de Mockups y StoryBoard
- **Mockups:** Ubicados en el directorio correspondiente. Se componen de wireframes estructurales planos que definen las vistas de usuario y las vistas de administración.
- **StoryBoard:** Ubicación en el directorio StoryBoard (Contiene enlaces de demostración del flujo).

## Listado de páginas HTML del proyecto
La estructura está dividida modularmente en carpetas (`user` y `admin`):
- `src/pages/user/home.html`: Implementa el Mockup "Home".
- `src/pages/user/shop.html`: Catálogo principal de la ferretería.
- `src/pages/user/product.html`: Implementa el Mockup "Product".
- `src/pages/user/cart.html`: Implementa el Mockup "Cart".
- `src/pages/user/sign-in.html`: Implementa el Mockup "LogIn".
- `src/pages/user/create-account.html`: Implementa el Mockup "CreateAccount".
- `src/pages/user/create-company-account.html`: Implementa el Mockup "CreateEntepriseAccount".
- `src/pages/user/profile.html`: Implementa el Mockup "Profile".
- `src/pages/user/order-history.html`: Implementa el Mockup "Orders".
- `src/pages/user/addresses.html`: Gestión de libreta de direcciones.
- `src/pages/user/security.html`: Implementa el Mockup "Security".
- `src/pages/admin/admin-shop.html`: Implementa el Mockup "AdminShop".
- `src/pages/admin/admin-product.html`: Implementa el Mockup "AdminProduct".
- `src/pages/admin/admin-orders.html`: Implementa el Mockup "AdminOders".

## Listado de archivos templates
El proyecto utiliza una arquitectura de componentes inyectables mediante JavaScript para evitar la duplicación de código. Los templates se encuentran en `src/templates/`:
- **Templates Globales:**
    - `header.html`
    - `footer.html`
- **Templates de Usuario (`user/`):**
    - `article-template.html` (Tarjeta de producto del catálogo).
    - `cart-item.html` (Fila individual de producto en el carrito).
    - `order-history-item-template.html` (Tarjeta de resumen de un pedido pasado).
    - `work-address.html` / `home-address.html` (Tarjetas de direcciones guardadas).
- **Templates de Administración (`admin/`):**
    - `article-template-admin.html` (Tarjeta de catálogo con botones de edición/borrado).
    - `admin-editor-template.html` (Formulario de edición de producto).
    - `order-admin-template.html` (Fila de gestión de pedidos entrantes).

## Enlaces a Figma y Trello
- Figma: https://www.figma.com/site/K98fyIQYHsdLJpAOdcwr6R/CASAC?node-id=0-1&t=mZ7nRJfE3sYH67HO-1
- Trello: https://trello.com/invite/b/699376040c2fd72f9f2c7884/ATTI0b5edf7f9c52446d6ebc2f6603a5eed3067E60B3/casac

## Autores
- Javier Gonález Velázquez
- Pablo Santana González
- Santiago Manuel Pujol Castellanos
- Francisco Javier Monleón Peña