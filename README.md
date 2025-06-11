# Eleven

Este proyecto contiene tres partes principales:

- `backend` – API construida con [NestJS](https://nestjs.com/).
- `frontend-public` – Sitio público donde los clientes pueden realizar pedidos.
- `frontend-admin` – Panel de administración para gestionar la tienda.

El carrito se almacena tanto en `localStorage` como en la base de datos. Al ingresar, se genera una sesión identificada por la IP y un UUID almacenados en `localStorage`.

## Desarrollo

Para el backend es necesario instalar las dependencias de Node.js:

```bash
cd backend
npm install
```

Luego puede ejecutarse en modo desarrollo con:

```bash
npm run start:dev
```

Los frontends se construyen con [SolidJS](https://www.solidjs.com/) y [Vite](https://vitejs.dev/).
Para iniciar cualquiera de ellos:

```bash
cd frontend-public # o frontend-admin
npm install
npm run dev
```
