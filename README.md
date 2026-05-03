# G45_1 Proyecto de Programación Web Y Móvil: Ferretería CASAC

Plataforma web e-commerce para la ferretería CASAC con catálogo dinámico, autenticación de usuarios, carrito de compra, perfil de cliente y panel de administración.

## Sprint 3: Angular + Firebase (requisitos y estado)

Este Sprint adapta el sitio web a Angular y prepara la migración de datos y usuarios a Firebase. Se permite partir del sitio actual o recrearlo desde cero en Angular, manteniendo el contenido y el diseño.

### Requisitos funcionales (Sprint 3)

1) **Contenido dinámico desde JSON con Angular**
- La mayor parte del contenido debe cargarse de forma dinámica desde un JSON usando un servicio Angular.
- Se permite contenido estático adicional.

2) **Origen del JSON (local o remoto)**
- Se permite JSON local en una variable Angular o publicar con JSON-Server.
- El acceso se hace siempre vía servicios Angular (mismo flujo local o remoto).

3) **Formularios y validación con Angular**
- Al menos un formulario validado con herramientas de Angular.
- Obligatorio: registro y autenticación de usuarios, con contenido condicionado por autenticación y rol.

4) **RWD (responsive)**
- Uso de Flexbox o Bootstrap para adaptar el diseño a distintos dispositivos.

5) **Gestión de usuarios con Firebase**
- Registro y login contra Firebase Auth.
- Mantener sesión para mostrar contenido según usuario/rol.

6) **Datos dinámicos desde Firebase**
- El contenido dinámico debe leerse/escribirse desde Firestore (tiempo real).

7) **Imágenes en Firebase Storage**
- Subida de imágenes desde el frontend.
- Guardar URL en Firestore y renderizar desde esa URL.

### Estado en el proyecto (Angular)

- **Rutas SPA y Signal Forms:** `src/app/app.routes.ts` y formularios en `src/app/auth` y `src/app/users/profile`.
- **Validaciones Angular:** Signal Forms (`@angular/forms/signals`).
- **Autenticación Firebase:** `AuthService` en `src/app/auth/auth.service.ts`.
- **Firestore:** `UserService` en `src/app/users/user-service.ts`.
- **Perfil por secciones:** `/profile/info`, `/profile/security`, `/profile/orders`, `/profile/addresses`.
- **Guardas por rol:** `src/app/auth/auth.guard.ts`, `src/app/auth/role.guard.ts`.

## Puesta en marcha (Angular)

1. Instalar dependencias:

```bash
npm install --legacy-peer-deps
```

2. Arrancar la aplicacion:

```bash
npm run start
```

3. Abrir en el navegador:

```
http://localhost:4200/
```

### Rutas principales

- `/signin`
- `/create-account`
- `/create-company-account`
- `/profile/info`
- `/profile/security`
- `/profile/orders`
- `/profile/addresses`

### Nota sobre Firebase

Los datos de entorno estan en `src/environments/environment.development.ts`.
Si necesitas cambiar proyecto Firebase, actualiza ese archivo.

## Enlaces de gestion del proyecto
- Figma: https://www.figma.com/site/K98fyIQYHsdLJpAOdcwr6R/CASAC?node-id=0-1&t=mZ7nRJfE3sYH67HO-1
- Trello: https://trello.com/invite/b/699376040c2fd72f9f2c7884/ATTI0b5edf7f9c52446d6ebc2f6603a5eed3067E60B3/casac

## Autores
- Javier Gonzalez Velazquez
- Pablo Santana Gonzalez
- Santiago Manuel Pujol Castellanos
- Francisco Javier Monleon Pena
