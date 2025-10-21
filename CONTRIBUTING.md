# Guía de Desarrollo y Contribución

## Bienvenido

¡Gracias por tu interés en contribuir al Juego de Tanques! Esta guía te ayudará a entender el proceso de desarrollo y cómo contribuir efectivamente.

## 🚀 Inicio Rápido

### Prerrequisitos
- Navegador web moderno con soporte HTML5
- Editor de código (recomendado: VS Code)
- Conocimientos básicos de JavaScript ES6
- Familiaridad con HTML5 Canvas

### Configuración del Entorno
1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. Para desarrollo, abre el proyecto en tu editor preferido

## 📁 Estructura del Proyecto

```
tanque/
├── index.html              # Página principal
├── js/
│   ├── game.js            # Lógica principal del juego
│   └── constants/         # Configuraciones
├── css/
│   └── style.css          # Estilos básicos
├── images/                # Sprites y assets gráficos
├── sounds/                # Archivos de audio
├── docs/                  # Documentación técnica
└── tools/                 # Herramientas de desarrollo
```

## 🛠️ Desarrollo

### Flujo de Trabajo
1. **Planificación**: Revisa issues y documentación
2. **Desarrollo**: Implementa cambios en rama separada
3. **Testing**: Prueba en múltiples navegadores
4. **Documentación**: Actualiza docs si es necesario
5. **Pull Request**: Envía cambios para revisión

### Estándares de Código

#### JavaScript
- Usa ES6+ features (const/let, arrow functions, modules)
- Comentarios JSDoc para funciones públicas
- Nombres descriptivos en inglés
- Mantén consistencia con el código existente

#### HTML/CSS
- Semántico y accesible
- Tailwind para estilos de UI
- Responsive design

### Convenciones de Nombres
```javascript
// Clases: PascalCase
class GameController { }

// Funciones: camelCase
function preloadImages() { }

// Constantes: UPPER_SNAKE_CASE
const GAME_WIDTH = 1408;

// Variables: camelCase
let playerPosition = 0;
```

## 🎯 Áreas de Contribución

### Prioridades Actuales
1. **Multijugador**: Sincronización completa de estados
2. **Colisiones**: Sistema de colisiones con mapa
3. **Power-ups**: Items recolectables
4. **UI/UX**: Mejoras en la interfaz
5. **Performance**: Optimizaciones

### Tipos de Contribuciones
- 🐛 **Bug fixes**: Corrección de errores
- ✨ **Features**: Nuevas funcionalidades
- 📚 **Documentation**: Mejoras en docs
- 🎨 **UI/UX**: Interfaz y experiencia
- ⚡ **Performance**: Optimizaciones
- 🧪 **Testing**: Pruebas y QA

## 🔧 Guías Específicas

### Agregar Nuevos Sonidos
1. Coloca archivo MP3 en `/sounds/`
2. Actualiza `js/constants/sound-types.js`
3. Agrega mapeo en `js/constants/game-sounds.js`
4. Implementa reproducción en `Game.playSound()`

### Agregar Nuevos Sprites
1. Coloca imagen PNG en `/images/`
2. Agrega entrada en `imagesToLoad` en `game.js`
3. Implementa uso en clases correspondientes

### Modificar el Mapa
- Usa `tools/test.html` para prototipar
- Ajusta parámetros en `generateMap()`
- Considera impacto en performance

### Multijugador
- Lee `docs/peerjs-integration.md`
- Implementa protocolo de mensajes
- Maneja sincronización de estado

## 🧪 Testing

### Testing Manual
- Prueba en Chrome, Firefox, Safari, Edge
- Verifica responsive design
- Testea multijugador con 2+ pestañas
- Valida sonidos y gráficos

### Debugging
```javascript
// Console logging para debug
console.log('Player position:', player.x, player.y);

// Verificar estado del juego
console.log('Game state:', {
  bullets: bullets.length,
  player: player.getLife(),
  fps: Math.round(1000 / delta)
});
```

### Performance Testing
- Usa DevTools Performance tab
- Monitorea FPS y memory usage
- Test con muchos elementos (test mode)

## 📝 Pull Requests

### Template de PR
```
## Descripción
Breve descripción de los cambios

## Cambios
- Cambio 1
- Cambio 2
- Cambio 3

## Testing
- [ ] Probado en Chrome
- [ ] Probado en Firefox
- [ ] Funciona multijugador
- [ ] No rompe funcionalidad existente

## Screenshots (si aplica)
```

### Checklist
- [ ] Código sigue estándares del proyecto
- [ ] Funcionalidad probada
- [ ] Documentación actualizada
- [ ] Sin console.logs de debug
- [ ] Commit messages descriptivos

## 🚨 Issues y Bugs

### Reportar Bugs
Usa el template de issue:
```
**Descripción del bug:**

**Pasos para reproducir:**
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

**Comportamiento esperado:**
Lo que debería pasar

**Comportamiento actual:**
Lo que pasa en realidad

**Entorno:**
- Navegador: Chrome 120
- OS: Windows 11
- Versión del juego: main branch
```

### Labels
- `bug`: Error en funcionalidad
- `enhancement`: Nueva feature
- `documentation`: Issues de docs
- `help wanted`: Buena para contribuidores nuevos
- `good first issue`: Ideal para principiantes

## 📚 Recursos

### Documentación Técnica
- `README.md`: Información general
- `docs/game-loop-flow.md`: Arquitectura del game loop
- `docs/peerjs-integration.md`: Sistema multijugador
- `docs/dependencies.md`: Dependencias externas

### Herramientas de Desarrollo
- `tools/test.html`: Generador de mapas
- `tools/test1.html`: Prueba PeerJS
- DevTools del navegador

### Comunidad
- Issues para preguntas
- PRs para contribuciones
- Mantén comunicación respetuosa

## 🎉 Reconocimiento

Todos los contribuidores serán reconocidos en el README. ¡Gracias por hacer el juego mejor!

---

**Nota**: Este proyecto está en desarrollo activo. Las guías pueden actualizarse. Revisa regularmente para cambios.