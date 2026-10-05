# Padrón IA — Consulta al Padrón Electoral

Front-end para consultar el padrón electoral universitario (FUL 2026 - 2028 · Integración Académica). Permite a cualquier estudiante ingresar su número de registro y ver su mesa, recinto, aula y habilitación para votar.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) como build tool
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) para iconografía

## API

Consume el endpoint público:

```
GET https://eleccionesuagrm.superficct.com/api/buscar.php?registro=<numero>
```

La lógica de consumo está en [`src/api.ts`](src/api.ts) y los tipos de la respuesta en [`src/types.ts`](src/types.ts).

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Estructura

```
src/
├─ api.ts                 # Cliente de la API del padrón
├─ types.ts                # Tipos de la respuesta de la API
├─ App.tsx                 # Layout principal y máquina de estados (idle/loading/success/error)
├─ assets/                  # Logo e imagen de fondo de marca
└─ components/
   ├─ SplashScreen.tsx      # Pantalla de carga animada con el logo
   ├─ SearchForm.tsx        # Formulario de búsqueda por registro
   ├─ InfoPanel.tsx         # Panel de avisos y recomendaciones
   ├─ ResultCard.tsx        # Tarjeta de resultado (mesa, recinto, aula, habilitación)
   ├─ ResultSkeleton.tsx    # Estado de carga tipo skeleton
   ├─ StatusBadge.tsx       # Badge de habilitado / no habilitado
   ├─ StatusMessage.tsx     # Estado de error / registro no encontrado
   └─ Logo.tsx              # Badge "IA"
```
