# Dependencias Externas

## Resumen de Dependencias

El proyecto utiliza varias librerías y frameworks externos para implementar funcionalidades específicas del juego.

## Tailwind CSS

### Uso
```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

### Propósito
- Framework CSS utility-first para estilos de la interfaz
- Utilizado en el menú principal y modales
- Estilos responsive y moderno sin CSS custom

### Ventajas
- Rápido desarrollo de UI
- Consistente con estándares modernos
- Ligero y optimizado para producción

### Alternativas Consideradas
- CSS puro (más verboso)
- Bootstrap (más pesado)
- CSS Modules (requiere build process)

## PeerJS

### Uso
```html
<script src="https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js"></script>
```

### Propósito
- Implementar conectividad peer-to-peer para multijugador
- Crear y unirse a salas de juego
- Comunicación en tiempo real entre jugadores

### Configuración
```javascript
new Peer({
  host: "0.peerjs.com",
  port: 443,
  path: "/",
  secure: true
});
```

### Ventajas
- Fácil implementación de WebRTC
- Servidores públicos gratuitos
- API simple y bien documentada

### Limitaciones
- Dependiente de servidores externos
- Escalabilidad limitada para muchos jugadores
- Requiere refactorización para sincronización completa

### Alternativas
- Socket.IO (requiere servidor)
- WebRTC nativo (más complejo)
- Photon (comercial)

## Web APIs Nativas

### Canvas 2D API
- Renderizado del juego
- Manipulación de gráficos en tiempo real
- Transformaciones y composición

### Web Audio API
- Reproducción de sonidos del juego
- Control de volumen
- Manejo de múltiples fuentes de audio

### Local Storage / Cookies
- Persistencia de configuración de volumen
- Guardar preferencias del usuario

## Dependencias de Desarrollo

### Herramientas en `/tools/`
- `test.html`: Generador de mapas procedurales
- `test1.html`: Prueba de PeerJS
- `menu.js`: Código legacy (obsoleto)

## Consideraciones de Producción

### CDN Dependencies
- **Ventaja**: Sin archivos locales, siempre actualizados
- **Desventaja**: Dependiente de conectividad externa
- **Riesgo**: Fallos si CDN no disponible

### Estrategia de Fallback
```javascript
// Ejemplo para PeerJS
if (typeof Peer === 'undefined') {
  console.error('PeerJS no cargó correctamente');
  // Mostrar mensaje de error al usuario
}
```

## Actualización de Dependencias

### Tailwind CSS
- Versión 4 (beta) - verificar estabilidad
- Monitorear releases para actualizaciones

### PeerJS
- Versión 1.5.5 - verificar compatibilidad
- Considerar migrar a versión más reciente si disponible

## Impacto en el Proyecto

### Tamaño del Bundle
- Tailwind: ~100KB (CSS generado)
- PeerJS: ~50KB (minificado)
- Total: ~150KB de dependencias externas

### Performance
- Carga inicial: Mínima (CDNs optimizados)
- Runtime: Canvas y Web Audio son nativos
- PeerJS: Solo cuando se usa multijugador

## Recomendaciones

1. **Monitoreo**: Verificar estado de CDNs regularmente
2. **Fallbacks**: Implementar detección de carga fallida
3. **Offline**: Considerar versiones locales para producción
4. **Actualizaciones**: Mantener dependencias actualizadas
5. **Alternativas**: Evaluar soluciones self-hosted para producción

## Migración Futura

### Posibles Cambios
- Tailwind local con PostCSS
- Servidor PeerJS propio
- WebRTC nativo para más control
- Service Workers para offline

### Beneficios
- Mayor control sobre dependencias
- Mejor performance
- Independencia de servicios externos
- Mejor experiencia offline