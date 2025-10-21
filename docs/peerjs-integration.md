# Integración con PeerJS - Multijugador

## Arquitectura del Multijugador

El juego utiliza PeerJS para implementar conectividad peer-to-peer (P2P) entre jugadores, permitiendo crear salas y unirse a partidas multijugador.

## Componentes del Sistema

### 1. Variables Globales (index.html)
```javascript
let idpeer;           // ID único del peer local
var globalPeer;       // Instancia global del peer
var total = 0;        // Contador de conexiones
```

### 2. Inicialización de PeerJS
```javascript
function initPeer() {
  window.peer = new Peer({
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    secure: true
  });
}
```

## Flujo de Creación de Sala

```mermaid
graph TD
    A[Usuario hace clic en "Crear Sala"] --> B[Llamar createRoom()]
    B --> C[Mostrar modal de creación]
    C --> D[Llamar createPeer()]
    D --> E[Inicializar PeerJS]
    E --> F[Peer.on 'open' - Obtener ID]
    F --> G[Actualizar total++]
    G --> H[Ocultar modal]
    H --> I[Llamar createdRoom()]
    I --> J[Mostrar modal con ID de sala]
```

### Funciones de Creación
- `createRoom()`: Muestra modal y llama a `createPeer()`
- `createPeer()`: Inicializa PeerJS y configura eventos
- `createdRoom()`: Muestra el ID de sala generado

## Flujo de Unión a Sala

```mermaid
graph TD
    A[Usuario ingresa nickname y room ID] --> B[Hacer clic "Unirse"]
    B --> C[Llamar joinRoom()]
    C --> D[Mostrar modal de unión]
    D --> E[Llamar joinPeers(nick, room)]
    E --> F[Inicializar PeerJS]
    F --> G[Peer.on 'open']
    G --> H[peer.connect(roomId)]
    H --> I[conn.send nick]
    I --> J[Llamar window.playNow()]
```

### Funciones de Unión
- `joinRoom()`: Obtiene datos del formulario y llama a `joinPeers()`
- `joinPeers(nick, room)`: Conecta con el peer del creador de sala

## Manejo de Conexiones

### Eventos del Peer Creador (Host)
```javascript
peer.on('connection', conn => {
  total++;  // Incrementar contador de jugadores
  console.log("conectados", total);

  conn.on('data', data => {
    console.log('Recibido:', data);
    window.playNow();  // Iniciar juego cuando llegue data
  });
});
```

### Eventos del Peer Conectado (Cliente)
```javascript
conn.on("open", () => {
  // Conexión establecida
  conn.send("nick:" + nick);
  window.playNow();  // Iniciar juego
});
```

## Estados del Multijugador

### 1. Sin Conexión
- Menú principal visible
- Opciones para crear o unirse a sala

### 2. Creando Sala
- Modal con spinner de carga
- Esperando generación de ID de peer

### 3. Sala Creada
- Modal mostrando ID de sala para compartir
- Contador de jugadores conectados

### 4. Uniéndose a Sala
- Modal con spinner de carga
- Intentando conectar con peer remoto

### 5. Conectado
- Juego iniciado
- Comunicación P2P activa

## Limitaciones Actuales

### Sincronización
- **Básica**: Solo inicia el juego cuando se conecta
- **Falta**: Sincronización de posiciones, estados, acciones

### Comunicación
- **Implementado**: Conexión inicial y señal de inicio
- **Pendiente**: Intercambio continuo de datos de juego

### Escalabilidad
- **Limitado**: Solo 1vs1 básico
- **Falta**: Múltiples jugadores, gestión de desconexiones

## Problemas Conocidos

1. **Timeout**: Conexión puede fallar sin feedback claro
2. **Sincronización**: Estados de juego no se sincronizan
3. **Reconexión**: No maneja desconexiones gracefully
4. **Validación**: No verifica si sala existe antes de conectar

## Expansión Futura

### Mejoras Necesarias
1. **Sincronización de Estado**: Enviar posiciones, ángulos, balas
2. **Protocolo de Mensajes**: Definir tipos de mensajes (pos, shoot, hit)
3. **Gestión de Jugadores**: Lista de peers conectados
4. **Chat In-Game**: Comunicación entre jugadores
5. **Reconección**: Manejar desconexiones y reconectar

### Código de Ejemplo para Sincronización
```javascript
// Enviar posición cada frame
function sendPosition() {
  if (conn && conn.open) {
    conn.send({
      type: 'position',
      x: player.x,
      y: player.y,
      angle: player.angle
    });
  }
}

// Recibir datos de otros jugadores
conn.on('data', (data) => {
  if (data.type === 'position') {
    // Actualizar posición del jugador remoto
    updateRemotePlayer(data);
  }
});
```

## Dependencias

- **PeerJS**: `https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js`
- **Servidor**: Usa servidores públicos de PeerJS (0.peerjs.com)

## Notas de Desarrollo

- La implementación actual es funcional para pruebas básicas
- Requiere refactorización completa para multijugador real
- Considerar usar WebRTC directamente para más control
- Evaluar alternativas como Socket.IO para servidor dedicado