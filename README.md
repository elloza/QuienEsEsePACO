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

## Dataset de caras

La app carga el manifiesto público desde `public/data/faces.json` y construye cada URL con la ruta relativa indicada en `image`. El MVP publicado usa avatares sintéticos optimizados en `public/faces/`; los SVG mock de `public/images/` quedan como fallback histórico seguro.

### Dataset publicado

El dataset publicado para el MVP usa avatares sintéticos generados con [DiceBear HTTP API](https://www.dicebear.com/how-to-use/http-api/) y el estilo [Open Peeps](https://www.dicebear.com/styles/open-peeps/). DiceBear documenta que Open Peeps es un remix de Open Peeps de Pablo Stanley con licencia [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), por lo que es una opción segura para un MVP web estático sin redistribuir caras reales.

Las imágenes optimizadas están en `public/faces/` como WebP 512x512 px. El manifiesto `public/data/faces.json` mantiene rutas relativas y marca la fuente como `dicebear-open-peeps-cc0`.

### Names100

El dataset candidato es [Names 100 Dataset](https://purl.stanford.edu/tp945cq9122), alojado en Stanford Digital Repository. Stanford indica que la descarga es pública, pero su condición de uso exige no usar el contenido para identificar personas ni vulnerar privacidad/confidencialidad, y advierte que puede estar sujeto a restricciones adicionales del depositante. Mientras no exista una licencia explícita que permita redistribuir y servir las imágenes reales en GitHub Pages, no se deben copiar esas caras a `public/` ni sustituir el mock publicado.

Si obtienes permiso o confirmas una licencia compatible, descarga los originales fuera del repo y colócalos localmente con una carpeta por nombre:

```text
datasets/originals/
  Francisco/
    image-001.jpg
    image-002.jpg
  Paco/
    image-001.png
  Fran/
    image-001.webp
  Curro/
    image-001.jpg
```

`datasets/` está ignorado por Git para evitar publicar originales por accidente.

### Preparar imágenes optimizadas

El pipeline convierte originales locales a WebP cuadrado de 512x512 px, organiza la salida en `public/faces/<nombre>/<archivo>.webp` y regenera `public/data/faces.json`.

```bash
npm run prepare:dataset -- -- --input=datasets/originals --clean --source=names100-local --limit-per-name=20
npm run validate:dataset
```

Opciones útiles:

- `--input`: carpeta local de originales, por defecto `datasets/originals`.
- `--faces-output`: salida de imágenes, por defecto `public/faces`.
- `--manifest`: manifiesto generado, por defecto `public/data/faces.json`.
- `--name-map`: mapa de nombres, por defecto `public/data/name-map.json`.
- `--quality`: calidad WebP, por defecto `72`.
- `--size`: tamaño cuadrado, por defecto `512`.
- `--limit-per-name`: límite opcional por nombre.
- `--clean`: borra la carpeta de salida antes de generar.

El validador comprueba que el manifiesto tenga campos requeridos, IDs únicos, rutas relativas sin `/` inicial, imágenes existentes y al menos 4 nombres distintos.

## Deploy

El workflow `.github/workflows/deploy.yml` compila con Node 20 y publica `./dist` en GitHub Pages.

## Aviso

Este MVP usa retratos mock seguros y datos locales en `public/data`. El juego es lúdico: no identifica personas reales ni pretende hacer inferencias biométricas o científicas.
