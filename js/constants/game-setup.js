/**
 * Configuraciones principales del juego
 * Define constantes para rendimiento, dimensiones y relación de aspecto
 */

// Configuración de rendimiento
export const FPS = 60; // Frames por segundo objetivo
export const interval = 1000 / FPS; // Milisegundos por frame

// Dimensiones del juego (resolución interna)
export const GAME_WIDTH = 1408;   // Ancho base del canvas
export const GAME_HEIGHT = 700;   // Alto base del canvas
export const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT; // Relación de aspecto 2.01:1