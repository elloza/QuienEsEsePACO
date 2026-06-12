# ¿Quién es este PACO?

Juego web móvil en español para mirar una cara, elegir un nombre y sobrevivir con 3 vidas.

Demo esperada: [https://elloza.github.io/QuienEsEsePACO/](https://elloza.github.io/QuienEsEsePACO/)

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

La app usa Vite con `base: '/QuienEsEsePACO/'`, necesario para GitHub Pages.

## Deploy

El workflow `.github/workflows/deploy.yml` compila con Node 20 y publica `./dist` en GitHub Pages.

## Aviso

Este MVP usa retratos mock seguros y datos locales en `public/data`. El juego es lúdico: no identifica personas reales ni pretende hacer inferencias biométricas o científicas.
