# Tienda Verdolaga — Backend API REST

Este repositorio contiene la API REST del proyecto Tienda Verdolaga, construida con Node.js, Express, TypeScript, Prisma y PostgreSQL. La aplicación expone una API segura con autenticación JWT, autorización por roles y base de datos con seed inicial.

## Enlaces del proyecto

- Frontend desplegado: https://tienda-verdolaga-frontend.vercel.app/
- Backend desplegado: https://tienda-verdolaga-backend.onrender.com
- Repositorio frontend: https://github.com/juanfer2006/tienda-verdolaga-frontend.git
- Repositorio backend: https://github.com/juanfer2006/tienda-verdolaga-backend.git

## Stack principal

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

## Credenciales de prueba

El backend crea dos usuarios automáticamente mediante el seed:

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| Administrador | `admin@tiendaverdolaga.com` | `Verdolaga2026*` |
| Usuario | `hincha@gmail.com` | `Verdolaga2026*` |

> Estas credenciales son solo para pruebas del entorno de entrega.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/db?schema=public"
JWT_SECRET="cambia_esta_clave_por_una_secreta_y_larga"
JWT_EXPIRES_IN="8h"
PORT=4000
FRONTEND_URL="https://tienda-verdolaga-frontend.vercel.app"
```

## Instalación y ejecución local

1. Instala dependencias:

```bash
npm install
```

2. Configura `.env` con tu base de datos y secretos.

3. Ejecuta la migración y el seed:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Inicia la API:

```bash
npm run dev
```

La API quedará disponible en:

```bash
http://localhost:4000
```

## Endpoints principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Productos

- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos` (solo admin)
- `PUT /api/productos/:id` (solo admin)
- `DELETE /api/productos/:id` (solo admin)

### Pedidos

- `POST /api/pedidos`
- `GET /api/pedidos/mias`
- `GET /api/pedidos` (solo admin)

## Decisiones técnicas

### 1. Flujo completo del login

1. El usuario llena el formulario en el frontend.
2. El frontend envía `POST /api/auth/login` con email y password.
3. El backend busca al usuario por email.
4. Si existe, compara la contraseña con `bcrypt.compare()`.
5. Si la contraseña es válida, el backend firma un JWT con `JWT_SECRET` y `JWT_EXPIRES_IN`.
6. El frontend recibe el token y lo guarda en `localStorage`.
7. Cuando el usuario accede a una ruta protegida, el frontend envía el header `Authorization: Bearer <token>`.
8. El middleware valida el JWT y, si corresponde, autoriza la acción.

### 2. ¿Dónde se guarda el token en el frontend?

El frontend lo guarda en `localStorage` con la clave `tienda_verdolaga_token`.

Esto tiene riesgo ante XSS, porque un script malicioso podría leer el token. La alternativa más segura es usar cookies HttpOnly con `SameSite` y políticas CSRF, pero para la entrega se usó `localStorage` por simplicidad.

### 3. 401 vs 403

- `401 Unauthorized`: no hay token, el token es inválido o expiró.
- `403 Forbidden`: el token es válido, pero el usuario no tiene permisos para la ruta o acción.

Ejemplos reales del proyecto:

- Usuario sin sesión intenta crear un pedido → `401`.
- Usuario normal intenta eliminar un producto → `403`.

### 4. Uso de IA

La IA se usó como apoyo para la organización del proyecto, la lógica del auth y la configuración de Prisma. La validación final de la seguridad y del comportamiento real se revisó manualmente.

## Despliegue

- Frontend Vercel: https://tienda-verdolaga-frontend.vercel.app/
- Backend Render: https://tienda-verdolaga-backend.onrender.com

## Evidencia de Network

La rúbrica exige una captura de la pestaña `Network` mostrando una petición protegida con el header `Authorization`.

Se recomienda guardar la captura en una carpeta `docs/` y referenciarla así:

```md
![Captura de Network con JWT](./docs/network-login.png)
```

La imagen debe mostrar una petición autenticada al backend con `Authorization: Bearer ...` y la respuesta `200 OK`.

## Mensaje sugerido de commit

```bash
docs: readme completo con decisiones tecnicas y guia de ejecucion
```
