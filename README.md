# App Instructores

Aplicacion SaaS en `Next.js + TypeScript + Tailwind` para gestion de instructores, fichas, ambientes y colegios en contexto SENA.

## Estado actual

El proyecto ya incluye una base navegable y presentable para demo con:

- portal de coordinador
- portal de instructor
- base visual del rol admin
- modulos operativos de `Fichas`, `Ambientes` y `Colegios`
- mocks realistas para flujo de producto

## Stack

- `Next.js 16`
- `TypeScript`
- `Tailwind CSS`
- componentes estilo `shadcn/ui`

## Ejecutar el proyecto

Desde la raiz:

```powershell
npm.cmd install
npm.cmd run dev
```

Abrir en navegador:

```text
http://localhost:3000
```

## Scripts utiles

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

## Estructura de trabajo git

Ramas:

- `main`: version estable y presentable
- `develop`: rama base de trabajo continuo
- `feat/nombre-corto`: nuevas funcionalidades o modulos
- `fix/nombre-corto`: correcciones puntuales

Flujo sugerido:

1. partir desde `develop`
2. crear una rama tipo `feat/...` o `fix/...`
3. hacer cambios y validar con `npm.cmd run lint` y `npm.cmd run build`
4. hacer commit
5. subir rama a GitHub
6. integrar despues en `develop`
7. pasar a `main` solo lo estable

## Repositorio remoto

```text
https://github.com/Whitefox9/app_instructores.git
```

## Nota de trabajo

Actualmente estamos trabajando sobre la rama:

```text
develop
```
