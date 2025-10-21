# Juego de Tanques - Tank Game

Un juego multijugador de tanques en tiempo real desarrollado con HTML5 Canvas, JavaScript ES6 y PeerJS para la conectividad.

## 🎮 Descripción

Este es un juego de batalla de tanques donde los jugadores pueden crear salas y unirse a partidas multijugador. El juego cuenta con un mapa procedural generado dinámicamente, sistema de balas, sonidos y una interfaz de usuario moderna.

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
/
├── index.html          # Página principal con menú y canvas del juego
├── js/
│   ├── game.js         # Lógica principal del juego, clases y game loop
│   ├── menu.js         # Funciones del menú (obsoleto)
│   └── constants/
│       ├── game-setup.js     # Configuraciones del juego (FPS, dimensiones)
│       ├── game-sounds.js    # Nombres de archivos de sonidos del juego
│       ├── impact-sounds.js  # Lista de sonidos de impacto
│       └── sound-types.js    # Tipos de sonidos disponibles
├── css/
│   └── style.css       # Estilos CSS básicos
├── images/             # Sprites y assets gráficos
├── sounds/             # Archivos de audio
├── test.html           # Generador de mapas procedurales (herramienta de desarrollo)
├── test1.html          # Prueba de PeerJS (herramienta de desarrollo)
└── README.md           # Esta documentación
```

### Componentes Principales

#### 1. Sistema de Juego (`js/game.js`)
- **Clase Game**: Gestiona el estado general del juego, mapa y detección de colisiones
- **Clase Tank**: Representa a los tanques con movimiento, rotación y disparos
- **Clase Bullet**: Maneja las balas con física básica
- **Clase Hud**: Interfaz de usuario en pantalla (vida, munición, nitro)

#### 2. Sistema de Multijugador (`index.html`)
- Integración con PeerJS para conexiones P2P
- Creación y unión a salas
- Sincronización básica de estado

#### 3. Generación de Mapa
- Mapa procedural de 10000x10000 píxeles
- Generado con ruido Perlin y manchas aleatorias
- Renderizado por tiles para optimización de memoria

#### 4. Sistema de Sonidos
- Sonidos de cañón y impactos
- Control de volumen persistente con cookies
- Reproducción aleatoria de sonidos de impacto

### Tecnologías Utilizadas

- **HTML5 Canvas**: Renderizado del juego
- **JavaScript ES6**: Lógica del juego con módulos
- **PeerJS**: Conectividad multijugador P2P
- **Tailwind CSS**: Estilos de la interfaz
- **Web Audio API**: Reproducción de sonidos

### Configuraciones Importantes

- **FPS**: 60 frames por segundo
- **Resolución del juego**: 1408x700 píxeles
- **Mapa**: 10000x10000 píxeles
- **Cooldown de disparo**: 1000ms
- **Velocidad de tanque**: 5 píxeles por frame

## 🚀 Cómo Ejecutar

1. Clona o descarga el proyecto
2. Abre `index.html` en un navegador web moderno
3. Crea una sala o únete con un ID de sala existente

### Requisitos
- Navegador con soporte para HTML5 Canvas y WebRTC
- Conexión a internet para PeerJS

## 🎯 Estados del Juego

1. **Menú Principal**: Creación/unión a salas
2. **Esperando Jugadores**: Modal de carga
3. **Juego Activo**: Gameplay con HUD y controles
4. **Game Over**: Pantalla de fin (no implementado)

## 🎮 Controles

- **Flechas**: Movimiento del tanque
- **Espacio**: Disparar (solo cuando estático)
- **Control de Volumen**: Esquina inferior derecha

## 🔧 Desarrollo

### Agregar Nuevos Sonidos
1. Coloca el archivo en `sounds/`
2. Actualiza las constantes en `js/constants/`
3. Implementa la reproducción en `Game.playSound()`

### Modificar el Mapa
- Ajusta parámetros en `generateMap()` en `js/game.js`
- Usa `test.html` para probar generadores de mapas

### Multijugador
- La sincronización actual es básica
- Se puede expandir enviando posiciones y estados vía PeerJS

## 📚 Documentación

### 📖 Guías y Tutoriales
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guía completa para contribuidores
- **[docs/game-loop-flow.md](docs/game-loop-flow.md)** - Arquitectura del game loop
- **[docs/peerjs-integration.md](docs/peerjs-integration.md)** - Sistema multijugador PeerJS
- **[docs/dependencies.md](docs/dependencies.md)** - Dependencias externas

### 🗂️ Documentación de Componentes
- **[js/constants/README.md](js/constants/README.md)** - Sistema de constantes
- **[sounds/README.md](sounds/README.md)** - Sistema de audio
- **[images/README.md](images/README.md)** - Assets gráficos
- **[tools/README.md](tools/README.md)** - Herramientas de desarrollo

## 📝 Notas de Desarrollo

- El proyecto está en desarrollo activo
- Algunos archivos como `menu.js`, `test.html` y `test1.html` son herramientas de desarrollo
- El multijugador requiere refactorización para sincronización completa
- Falta implementación de colisiones con el mapa y power-ups

## 🤝 Contribución

Para contribuir:
1. Lee la **[guía de contribución](CONTRIBUTING.md)**
2. Revisa la estructura del código
3. Implementa cambios en ramas separadas
4. Prueba en múltiples navegadores
5. Actualiza esta documentación

## 📄 Licencia

Proyecto de código abierto - usar bajo tu propio riesgo.