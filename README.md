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
