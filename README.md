# ObsidianPortafolio-Frontend

Base inicial del frontend de Orion Portafolio con `Next.js`, `App Router` y `Tailwind CSS`.

## Que incluye

- estructura inicial del proyecto
- estilos globales
- layout reutilizable para dashboard
- rutas base:
  - `/`
  - `/portafolio`
  - `/activos/[symbol]`
  - `/cuentas/[accountId]`
  - `/perfil`
  - `/alertas`
  - `/recomendaciones`

## Instalar dependencias

```bash
npm install
```

## Levantar el proyecto

```bash
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000).

## Idea de estructura

- `app/`: rutas del proyecto
- `components/`: piezas visuales reutilizables
- `lib/`: mocks y helpers simples

La base esta pensada para partir simple y luego reemplazar los datos mock por llamadas reales al backend.

## Sobre Clerk
> **(Desarrollo):** Requiere tener un .env con ciertas variables de entorno, consultar por ellas :alert


La integración con Clerk permite delegar el sistema de gestión de sesiones, otorgando varias herramientas que pueden ser útiles para el desarrollo:

### JWT
Maneja la información de la sesión del usuario mediante JWT, el cual tiene distintas claims/campos, de los cuales el más relevante parece ser:
- `sub` = id del usuario actual

#### Documentación de:
- Tokens de sesión: https://clerk.com/docs/guides/sessions/session-tokens

### Hooks y funciones
- `auth()` = permite obtener el Auth object del usuario
- `useUser()` = permite obtener información del usuario (ej: id, isSignedIn, ...)
- `getToken()` = permite obtener el token asociado al usuario
- `isSignedIn`

#### Documentación de:
- Cómo leer los datos del usuario: https://clerk.com/docs/nextjs/guides/users/reading
- Obtener token y datos asociados: https://clerk.com/docs/reference/nextjs/app-router/auth#data-fetching-with-get-token


