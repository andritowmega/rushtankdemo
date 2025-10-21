# Herramientas de Desarrollo

Esta carpeta contiene herramientas auxiliares para el desarrollo del juego de tanques.

## Archivos

### test.html
Herramienta para generar mapas procedurales de gran tamaño (10000x10000 píxeles).
- Utiliza ruido Perlin y algoritmos de generación procedural
- Permite descargar el mapa generado como archivo PNG
- Útil para probar diferentes algoritmos de generación de terreno

### test1.html
Prueba de concepto para el sistema multijugador usando PeerJS.
- Implementa un chat básico entre múltiples usuarios
- Crea y une salas de juego
- Sirve como referencia para la implementación del multijugador real

### menu.js (obsoleto)
Archivo JavaScript antiguo para el manejo del menú principal.
- Ya no se utiliza en la versión actual del juego
- Mantenido por referencia histórica
- Contiene la función `playNow()` básica

## Uso

Estas herramientas no son parte del juego final, sino utilidades para desarrollo y testing. Para ejecutarlas:

1. Abrir el archivo HTML correspondiente en un navegador
2. Seguir las instrucciones en pantalla

## Notas

- Los archivos en esta carpeta pueden contener código experimental
- No son necesarios para el funcionamiento del juego principal
- Se pueden eliminar si no se necesitan para desarrollo futuro