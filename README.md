# estacionamiento_fronted

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Estacionamiento Frontend

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_API_URL=http://localhost:3000
```

- Cambia el valor según la URL de tu backend en producción o desarrollo.

## Comandos útiles

- Instalar dependencias: `npm install`
- Ejecutar en desarrollo: `npm run dev`
- Construir para producción: `npm run build`
- Servir build localmente: `npm run preview`

## Docker

- Construir imagen:  
  `docker build -t estacionamiento-frontend .`
- Ejecutar contenedor:  
  `docker run -p 8080:80 estacionamiento-frontend`

## Notas

- El archivo `nginx.conf` está configurado para servir una SPA.
- Para un tema rosa, usa el `Dockerfile.rosa`.
