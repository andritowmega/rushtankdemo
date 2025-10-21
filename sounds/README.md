# Sistema de Sonidos

Esta carpeta contiene todos los archivos de audio utilizados en el juego de tanques.

## Archivos de Sonido

### Efectos del Juego
- `canon.mp3`: Sonido de disparo del cañón del tanque
- `1.mp3`: Música de fondo del menú principal
- `2.mp3`: Música de fondo del juego

### Sonidos de Impacto
- `impact1.mp3` hasta `impact11.mp3`: 11 variaciones de sonido de impacto
  - Se seleccionan aleatoriamente cuando el jugador recibe daño
  - Cada archivo tiene características ligeramente diferentes para variedad

### Sonidos Especiales
- `impact-rock.mp3`: Sonido específico para impacto con rocas (no implementado)
- `sound-death.mp3`: Sonido de muerte del tanque (no implementado)

## Sistema de Reproducción

### Configuración de Volumen
- El volumen se guarda en cookies del navegador
- Control deslizante en la esquina inferior derecha
- Valores por defecto: 50% para música, configurable para efectos

### Tipos de Sonido
```javascript
SOUND_TYPES = {
  CANON: "CANON",  // Disparos
  HIT: "HIT"       // Daños recibidos
}
```

### Reproducción
- Los sonidos de cañón se reproducen una vez por disparo
- Los sonidos de impacto se seleccionan aleatoriamente del array IMPACT_SOUNDS
- Manejo de errores si el audio no puede cargarse

## Formato

- Todos los archivos están en formato MP3
- Optimizados para web (tamaño reducido)
- Frecuencia de muestreo estándar para juegos

## Agregar Nuevos Sonidos

1. Colocar el archivo MP3 en esta carpeta
2. Actualizar las constantes en `js/constants/` según corresponda
3. Implementar la reproducción en `Game.playSound()`

## Notas Técnicas

- Los sonidos se cargan dinámicamente durante el gameplay
- Compatible con la Web Audio API
- Fallback para navegadores sin soporte completo
- Volumen persistente entre sesiones usando cookies