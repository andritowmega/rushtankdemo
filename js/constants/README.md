# Constantes del Juego

Esta carpeta contiene todas las constantes y configuraciones del juego de tanques, organizadas por funcionalidad.

## Archivos

### game-setup.js
Configuraciones principales del rendimiento y dimensiones:
- `FPS`: Frames por segundo objetivo (60)
- `interval`: Milisegundos por frame
- `GAME_WIDTH`: Ancho base del canvas (1408px)
- `GAME_HEIGHT`: Alto base del canvas (700px)
- `ASPECT_RATIO`: Relación de aspecto del juego

### sound-types.js
Tipos de sonidos disponibles:
- `CANON`: Sonido de disparo de cañón
- `HIT`: Sonido de impacto/recibir daño

### game-sounds.js
Mapeo de tipos de sonido a archivos específicos:
- `CANNON_SHOT`: "canon.mp3"

### impact-sounds.js
Array con todos los archivos de sonido de impacto:
- Lista de 11 archivos de sonido diferentes para variar los efectos de daño

## Uso

```javascript
import { FPS, GAME_WIDTH, GAME_HEIGHT } from './constants/game-setup.js';
import { SOUND_TYPES } from './constants/sound-types.js';
import { GAME_SOUNDS } from './constants/game-sounds.js';
import { IMPACT_SOUNDS } from './constants/impact-sounds.js';
```

## Modificación

Al modificar estas constantes, considerar:
- Cambios en `FPS` afectan el rendimiento del juego
- Modificaciones en dimensiones pueden requerir ajustes en el CSS
- Nuevos sonidos deben agregarse tanto al array correspondiente como al directorio `sounds/`

## Notas

- Todas las constantes se exportan usando ES6 modules
- Los valores están optimizados para el rendimiento actual del juego
- Las rutas de sonido son relativas al directorio `sounds/`