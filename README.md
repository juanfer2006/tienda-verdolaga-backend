# Tienda Verdolaga — Backend API REST

> API REST profesional construida con **Node.js**, **Express**, **TypeScript**, **Prisma ORM** y **PostgreSQL** bajo una **arquitectura limpia en 4 capas** (*Domain*, *Application*, *Infrastructure*, *Interface*).

Este repositorio forma parte de la **Entrega 3 (Full-Stack)** de la materia de Desarrollo Web (Universidad de Medellín), adaptando la identidad y catálogo temático de Atlético Nacional.

---

## 1. Enlaces del Proyecto

* **Repositorio Frontend:** [github.com/juanfer2006/tienda-verdolaga-frontend](https://github.com/juanfer2006/tienda-verdolaga-frontend)
* **API Desplegada (Backend):** `[PENDIENTE - URL de Render/Railway]`
* **Sitio Desplegado en Vercel (Frontend):** `[PENDIENTE - URL de Vercel]`

---

## 2. Credenciales de Prueba (Seed)

Para probar los roles, la autenticación y las rutas protegidas, la base de datos cuenta con dos usuarios creados automáticamente mediante el script de seed:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@tiendaverdolaga.com` | `Verdolaga2026*` | CRUD total de catálogo (`POST`, `PUT`, `DELETE`), ver todos los pedidos y acceso al panel `/admin`. |
| **USER** | `hincha@gmail.com` | `Verdolaga2026*` | Comprar/crear pedidos a su nombre y consultar su propio historial en `/mis-pedidos`. |

> *Aclaración:* Las contraseñas se encuentran almacenadas de forma segura utilizando **bcrypt con 10 rondas de salt**. Nunca se almacenan en texto plano ni se devuelven en las respuestas HTTP.

---

## 3. Decisiones Técnicas (Respuestas a la Rúbrica)

### A. Flujo completo del Login
1. **Envío del formulario:** El usuario escribe sus credenciales en el frontend (`/login`) y envía la petición `POST /api/auth/login` con su `email` y `password`.
2. **Recepción y búsqueda:** El `AuthController` delega la operación al `AuthService`, el cual consulta al repositorio (`PrismaUserRepository`) buscando al usuario por correo.
3. **Validación con bcrypt:** Si el usuario no existe o la contraseña no coincide al compararla con `bcrypt.compare()`, el servidor responde con un código `401 Unauthorized` y un mensaje genérico (*"Credenciales inválidas"*), impidiendo ataques de enumeración de usuarios.
4. **Firma del JWT:** Si la validación es correcta, `TokenService` firma un token con `jsonwebtoken` usando la clave secreta `JWT_SECRET` y un tiempo de expiración (`8h`).
5. **Payload mínimo:** El payload contiene únicamente `{ id, role }`, omitiendo cualquier dato sensible.
6. **Respuesta y almacenamiento:** El frontend recibe el token y lo guarda en `localStorage`.
7. **Petición protegida:** Cuando el usuario accede a una ruta privada (como `GET /api/pedidos/mias`), el cliente HTTP inyecta el header `Authorization: Bearer <token>`.
8. **Middleware de autenticación:** El middleware `autenticarToken` verifica la firma y vigencia del JWT, e inyecta `req.user = { id, role }`. Si la ruta exige permisos de administrador, el middleware `soloAdmin` valida que `req.user.role === 'ADMIN'`.

### B. ¿Dónde se guarda el token en el frontend y qué riesgo tiene esa decisión?
* **Decisión:** El token se guarda en el `localStorage` del navegador.
* **Riesgo:** El principal riesgo de usar `localStorage` es la vulnerabilidad ante ataques de tipo **XSS (Cross-Site Scripting)**, ya que cualquier script malicioso inyectado en el cliente podría leer el almacenamiento local y extraer el token.
* **Alternativa más segura:** Almacenarlo en una cookie con bandera `HttpOnly`, `Secure` y `SameSite=Strict`, lo cual previene el acceso mediante JavaScript desde el navegador. Para este proyecto académico se utilizó `localStorage` por simplicidad en el manejo de estado entre componentes cliente.

### C. ¿En qué caso la API responde 401 y en cuál 403? (Ejemplos reales del proyecto)
* **401 Unauthorized (Falta o invalidez de autenticación):**
  * *Cuándo ocurre:* Cuando el cliente no envía el header `Authorization`, envía un token malformado, o el token ya expiró.
  * *Ejemplo real:* Si un usuario anónimo o sin sesión intenta crear un pedido enviando `POST /api/pedidos` sin token, el middleware `autenticarToken` responde de inmediato con status **401**.
* **403 Forbidden (Falta de autorización / permisos):**
  * *Cuándo ocurre:* El usuario está debidamente autenticado con un token válido, pero su rol no tiene los privilegios necesarios para esa acción específica.
  * *Ejemplo real:* Si el usuario normal (`hincha@gmail.com` con rol `USER`) intenta eliminar un producto del catálogo enviando `DELETE /api/productos/:id`, el token es válido, pero el middleware `soloAdmin` comprueba que no es administrador y responde con status **403**.

### D. Uso de Inteligencia Artificial
* **¿Para qué se utilizó?:** Se utilizó como asistente de desarrollo para agilizar la maquetación de la arquitectura en capas, generar el esquema de Prisma y adaptar el arreglo de 30 productos de la Entrega 1 al formato de Seed.
* **¿Qué se corrigió manualmente?:** Se ajustaron los tipos estrictos de TypeScript en las extensiones de Express (`req.user`), la configuración de CORS para admitir orígenes específicos de producción y la lógica de validación para asegurar que el `userId` en los pedidos se obtenga obligatoriamente del token y nunca del cuerpo de la petición (`req.body`).

---

## 4. Endpoints de la API

### Autenticación (`/api/auth`)
* `POST /api/auth/register` — Registro de nuevo usuario (hashea contraseña con bcrypt, devuelve 409 si el correo ya existe).
* `POST /api/auth/login` — Inicio de sesión (devuelve token JWT firmado y datos del usuario sin contraseña).

### Catálogo de Productos (`/api/productos`)
* `GET /api/productos` — Listado público paginado `{ pagination: { total, page, limit, totalPages }, data: [...] }`. Soporta `?page=1&limit=9&categoria=camisetas`.
* `GET /api/productos/:id` — Detalle de un producto por ID.
* `POST /api/productos` — Crear nuevo producto (*Solo ADMIN con Bearer token*).
* `PUT /api/productos/:id` — Editar producto existente (*Solo ADMIN con Bearer token*).
* `DELETE /api/productos/:id` — Eliminar producto (*Solo ADMIN con Bearer token*).

### Interacción / Pedidos (`/api/pedidos`)
* `POST /api/pedidos` — Crear pedido (*Usuario autenticado, el pedido se asocia al ID del token*).
* `GET /api/pedidos/mias` — Obtener historial de pedidos del usuario autenticado.
* `GET /api/pedidos` — Obtener todos los pedidos registrados (*Solo ADMIN*).

---

## 5. Arquitectura en 4 Capas

```text
src/
├── domain/                    # Entidades e interfaces del dominio puro
│   └── entities/              # User, Producto, Pedido
├── application/               # Casos de uso y reglas de negocio
│   ├── repositories/          # Contratos IUserRepository, IProductoRepository, IPedidoRepository
│   └── services/              # AuthService, ProductoService, PedidoService
├── infrastructure/            # Implementaciones externas y bases de datos
│   ├── config/                # Variables de entorno tipadas
│   ├── database/              # Cliente Prisma singleton
│   ├── repositories/          # PrismaUserRepository, PrismaProductoRepository, PrismaPedidoRepository
│   └── security/              # TokenService (JWT)
└── interface/                 # Puntos de entrada HTTP
    ├── controllers/           # AuthController, ProductoController, PedidoController
    ├── middlewares/           # authMiddleware (401/403), errorHandler (captura sin stack trace)
    ├── routes/                # authRoutes, productoRoutes, pedidoRoutes
    └── types/                 # Extensiones de tipos para Express (req.user)
```

---

## 6. Cómo ejecutar el proyecto en local

### Requisitos previos
* Node.js v18 o superior.
* Base de datos PostgreSQL activa (local o en la nube como Neon / Supabase).

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/juanfer2006/tienda-verdolaga-backend.git
   cd tienda-verdolaga-backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y configurar la URL de PostgreSQL:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://usuario:password@host:5432/neondb?sslmode=require"
   JWT_SECRET="mi_secreto_super_seguro_2026"
   JWT_EXPIRES_IN="8h"
   FRONTEND_URL="http://localhost:3000"
   ```
4. Sincronizar esquema y cargar datos con el seed:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
5. Iniciar servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:4000`.

---

## 7. Autor
**Juan Fernando Castañeda Agudelo**  
Desarrollo Web — Universidad de Medellín (Semestre 2026-2).
