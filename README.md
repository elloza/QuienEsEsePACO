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

El dataset candidato es [Names 100 Dataset](https://purl.stanford.edu/tp945cq9122), alojado en Stanford Digital Repository. Su fuente descargable primaria es:

```text
https://stacks.stanford.edu/file/tp945cq9122/Names100Dataset.tar.gz
```

Metadatos relevantes:

- Objeto SDR: `druid:tp945cq9122`.
- Archivo: `Names100Dataset.tar.gz`.
- Tamaño declarado: `2352440687` bytes.
- MD5 declarado: `78660c7fb994c98c50c5e71714057f17`.
- SHA1 declarado: `5e9f71cd980167aad13b60e858665e3f1ab49bfc`.
- Acceso del objeto: `view: world`, `download: world`.
- Contacto del depositante: `hchen2@stanford.edu`.

Conclusión legal operativa: Stanford permite descargar el archivo desde SDR, pero no hay una licencia abierta explícita que autorice republicar o redistribuir las fotos reales. La condición de uso del registro dice que el usuario acepta no usar el contenido para identificar ni vulnerar privacidad/confidencialidad, y advierte que el contenido puede estar sujeto a restricciones adicionales del depositante. Además, los términos generales de Stanford limitan la descarga a uso personal no comercial y prohíben copiar, reproducir, retransmitir, distribuir o publicar material salvo permiso o derecho legal aplicable. Por tanto, este repo no publica caras reales de Names100 en `public/` ni en GitHub Pages.

Para jugar localmente con fotos reales, descarga y extrae el paquete solo en `datasets/`, que está ignorado por Git:

```bash
mkdir -p datasets/names100
curl -L "https://stacks.stanford.edu/file/tp945cq9122/Names100Dataset.tar.gz" -o datasets/Names100Dataset.tar.gz
tar -xzf datasets/Names100Dataset.tar.gz -C datasets/names100
```

Si obtienes permiso escrito del depositante o confirmas una licencia compatible con redistribución web pública, conserva ese permiso junto a la documentación del proyecto antes de copiar resultados a `public/` para deploy.

El pipeline acepta originales extractados con carpetas anidadas. Intenta inferir `originalName` desde la carpeta de nombre más cercana y `gender` desde segmentos como `male`, `female`, `men` o `women`.

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

El pipeline convierte originales locales a WebP cuadrado de 512x512 px, organiza la salida en `public/faces/<nombre-espanol>/<archivo>.webp` y regenera `public/data/faces.json`. El manifiesto conserva `originalName`, `spanishName`, `gender` e `image`; la app solo muestra `spanishName`.

```bash
npm run prepare:dataset -- -- --input=datasets/names100 --clean --source=names100-local --limit-per-name=20
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

El validador comprueba que el manifiesto tenga `id`, `originalName`, `spanishName`, `gender`, `image`, IDs únicos, rutas relativas sin `/` inicial, imágenes existentes y al menos 4 nombres distintos.

`public/data/name-map.json` contiene equivalencias inglés→español para nombres frecuentes. Si el preparador encuentra un `originalName` que no está en el mapa, conserva ese nombre como `spanishName`; añade la equivalencia antes de preparar de nuevo si quieres una adaptación española concreta.

## Deploy

El workflow `.github/workflows/deploy.yml` compila con Node 20 y publica `./dist` en GitHub Pages.

## Aviso

Este MVP usa retratos mock seguros y datos locales en `public/data`. El juego es lúdico: no identifica personas reales ni pretende hacer inferencias biométricas o científicas.
