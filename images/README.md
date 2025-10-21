# Assets Gráficos

Esta carpeta contiene todas las imágenes y sprites utilizados en el juego de tanques.

## Sprites del Juego

### Tanques
- `tank.png`: Sprite principal del tanque (no utilizado en la versión actual)
- `tank-cut.png`: Sprite del tanque recortado y optimizado (actualmente en uso)

### Proyectiles
- `bullet.png`: Sprite de la bala disparada por el tanque
- `bala.png`: Sprite alternativo de bala (no utilizado)

### Efectos
- `explosion.png`: Sprite de explosión (no implementado en el juego actual)

### Interfaz
- `banner.png`: Logo/banner del juego para el menú principal

## Especificaciones Técnicas

### Formatos
- Todos los archivos están en formato PNG
- Soporte para transparencias (canal alpha)
- Optimizados para web (tamaño reducido)

### Dimensiones
- `tank-cut.png`: 50x80 píxeles (ancho x alto)
- `bullet.png`: 10x30 píxeles
- Dimensiones variables para otros assets

### Uso en el Código
```javascript
const imagesToLoad = [
  { name: "player", src: "images/tank-cut.png" },
  { name: "bullet", src: "images/bullet.png" },
  { name: "explosion", src: "images/explosion.png" }
];
```

## Sistema de Carga

- Las imágenes se cargan al inicio del juego mediante `preloadImages()`
- Se almacenan en el objeto `loadedImages` con claves nombradas
- Manejo de errores si alguna imagen falla al cargar

## Agregar Nuevos Assets

1. Colocar el archivo PNG en esta carpeta
2. Agregar entrada al array `imagesToLoad` en `js/game.js`
3. Acceder mediante `loadedImages["nombre"]`

## Notas

- Algunos sprites pueden estar sin utilizar en la versión actual
- Los assets están preparados para futuras expansiones del juego
- Optimizados para rendimiento en canvas HTML5