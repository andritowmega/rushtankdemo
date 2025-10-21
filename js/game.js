/**
 * Módulo principal del juego de tanques
 * Contiene las clases principales: Game, Tank, Bullet, Hud
 * Maneja el game loop, renderizado y lógica del juego
 */

import {SOUND_TYPES} from "./constants/sound-types.js";
import {GAME_SOUNDS} from "./constants/game-sounds.js";
import {IMPACT_SOUNDS} from "./constants/impact-sounds.js";
import {GAME_WIDTH,GAME_HEIGHT, ASPECT_RATIO, interval} from "./constants/game-setup.js";

// Variables globales del juego
let canvas;        // Canvas principal del juego
let ctx;           // Contexto 2D del canvas
let mapCanvas;     // Canvas gigante del mapa (10000x10000)
let mapOffsetX = 0; // Desplazamiento X de la cámara
let mapOffsetY = 0; // Desplazamiento Y de la cámara

let lastTime = 0;  // Timestamp del último frame para control de FPS

// Lista de imágenes a cargar al inicio
const imagesToLoad = [
  { name: "player", src: "images/tank-cut.png" },
  { name: "bullet", src: "images/bullet.png" },
  { name: "explosion", src: "images/explosion.png" }
];

// Variables de control de movimiento
let count = 0;        // Contador para animación de rotación
let countInLoop = 0;  // Contador de loops para inicialización

// Estado de las teclas presionadas
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  " ": false  // Espacio para disparar
};

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  count = 0;
});

/* ===== VARIABLES GLOBALES DE INSTANCIAS ===== */
const loadedImages = {};     // Objeto con imágenes cargadas
let imagesLoadedCount = 0;   // Contador de imágenes cargadas

// Instancias principales del juego
let player;    // Instancia del tanque del jugador
let game;      // Instancia del objeto Game
let bullets = new Array();  // Array de balas activas
let tanks = new Array();    // Array de tanques (NPCs)
let hud;       // Instancia del HUD

/**
 * Clase Bullet - Representa una bala disparada por un tanque
 * Maneja movimiento, renderizado y propiedades de daño
 */
class Bullet {
  /**
   * Constructor de la bala
   * @param {number} _x - Posición X inicial
   * @param {number} _y - Posición Y inicial
   * @param {number} _width - Ancho de la bala
   * @param {number} _height - Alto de la bala
   * @param {number} _angle - Ángulo de dirección en radianes
   * @param {Tank} _owner - Tanque que disparó la bala
   */
  constructor(_x, _y, _width, _height, _angle, _owner) {
    this.x = _x;
    this.y = _y;
    this.width = _width;
    this.height = _height;
    this.angle = _angle;
    this.owner = _owner;    // Referencia al tanque propietario
    this.speed = 9;         // Velocidad de movimiento
    this.img = loadedImages.bullet;  // Sprite de la bala
    this.dmg = 10;          // Daño que inflige
  }

  /**
   * Obtiene el daño de la bala
   * @returns {number} Daño de la bala
   */
  getDmg() {
    return this.dmg;
  }

  /**
   * Dibuja la bala en el canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  /**
   * Cambia el ángulo de la bala
   * @param {number} radian - Nuevo ángulo en radianes
   */
  rotateTo(radian) {
    this.angle = radian;
  }

  /**
   * Actualiza la posición de la bala
   */
  update() {
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}


/**
 * Clase Game - Gestiona el estado general del juego
 * Maneja el mapa, sonidos, detección de colisiones y actualización del HUD
 */
class Game {
  /**
   * Constructor del juego
   */
  constructor() {
    this.mapCanvas = generateMap(10000, 10000);  // Genera el mapa procedural
    this.bullets = [];  // Array de balas (usado localmente, pero bullets es global)
  }

  /**
   * Método de dibujo (actualmente vacío)
   */
  draw() {
    // TODO: Implementar dibujo general del juego si es necesario
  }

  /**
   * Detecta colisiones entre balas y el jugador
   * Solo afecta balas que no sean del propio jugador
   */
  hits(){
    for(let i = 0; i < bullets.length; i++){
      // Saltar balas propias
      if(bullets[i].owner == player){
        continue;
      }

      // Verificar colisión con el jugador (bounding box simple)
      if(bullets[i].x > player.x - player.width/2 &&
         bullets[i].x < player.x + player.width/2 &&
         bullets[i].y > player.y - player.height/2 &&
         bullets[i].y < player.y + player.height/2){

        player.updateLife(bullets[i].getDmg());  // Aplicar daño
        game.playSound(SOUND_TYPES.HIT);         // Reproducir sonido de impacto
        bullets.splice(i, 1);                    // Remover bala
        i--;  // Ajustar índice después de splice
      }
    }
  }
  /**
   * Reproduce sonidos del juego
   * @param {string} type - Tipo de sonido (CANON o HIT)
   */
  playSound(type) {
    // Obtener configuración de volumen de efectos de sonido desde cookies
    const savedSoundEffect = document.cookie.split('; ').find(row => row.startsWith('soundeffect='));
    let soundEffectValue = 100;  // Valor por defecto
    if (savedSoundEffect) {
      soundEffectValue = savedSoundEffect.split('=')[1];
    }

    const audio = new Audio();

    switch (type) {
      case SOUND_TYPES.CANON:
        audio.src = `sounds/${GAME_SOUNDS.CANNON_SHOT}`;
        audio.volume = soundEffectValue / 100;
        audio.play().catch(err => console.warn("Error al reproducir el sonido:", err));
        break;

      case SOUND_TYPES.HIT:
        // Seleccionar sonido de impacto aleatorio
        const randomNum = Math.floor(Math.random() * 11);
        audio.src = `sounds/${IMPACT_SOUNDS[randomNum]}`;
        audio.volume = soundEffectValue / 100;
        audio.play().catch(err => console.warn("Error al reproducir el sonido:", err));
        break;

      default:
        console.warn("Tipo de sonido no reconocido:", type);
        break;
    }
  }
  /**
   * Método de prueba - Genera tanques y balas aleatorios para testing
   * Útil para probar rendimiento y colisiones
   */
  test() {
    // Generar 50 tanques NPC aleatorios
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 10000;
      tanks.push(new Tank(loadedImages.player, x, y, 50, 80));
    }

    // Generar 10000 balas aleatorias (para stress test)
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 10000;
      bullets.push(new Bullet(x, y, 10, 30, Math.random() * 2 * Math.PI, null));
    }
  }

  /**
   * Inicializa el timer para actualizar coordenadas y HUD
   */
  update() {
    const timer = () => setInterval(() => {
      getCoords();        // Actualizar display de coordenadas
      hud.updateHud(player);  // Actualizar HUD con stats del jugador
    }, 300);  // Actualizar cada 300ms
    timer();
  }
}
/**
 * Clase Hud - Interfaz de usuario en pantalla (Heads-Up Display)
 * Muestra estadísticas del jugador: vida, munición, nitro
 */
class Hud {
  /**
   * Constructor del HUD
   */
  constructor() {
    // Inicialización vacía por ahora
  }

  /**
   * Actualiza el contenido del HUD con las estadísticas actuales del jugador
   */
  updateHud() {
    const render = document.getElementById("hud");
    render.innerHTML = `<div id="hud" class="fixed top-2 left-2 text-white text-2xl bg-black/50 rounded-lg text-sm">
    ❤️ <span id="life" class="mr-5">${player.getLife()}</span>
    💥 <span id="bullet" class="mr-5">${player.getBullet()}</span>
    🚀 <span id="nitro" class="mr-5">${player.getNitro()}</span>
  </div>`;
  }
}


/**
 * Función principal que inicia el juego
 * Configura el canvas, carga assets y comienza el game loop
 */
function playNow() {
  // Configurar elementos de UI
  dataPlayer();  // HUD del jugador
  ranking();     // Panel de ranking
  coords();      // Display de coordenadas

  // Crear canvas del juego
  const render = document.getElementById("render");
  render.innerHTML = `<canvas id="gameCanvas" width="800" height="600"></canvas>`;
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Configurar redimensionamiento responsivo
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Cargar imágenes y luego inicializar juego
  preloadImages(() => {
    game = new Game();
    player = new Tank(loadedImages.player, GAME_WIDTH / 2, GAME_HEIGHT / 2, 50, 80);
    hud = new Hud();
    mapCanvas = generateMap(10000, 10000);  // Generar mapa procedural
    gameLoop();  // Iniciar bucle principal del juego
  });
}
window.playNow = playNow;

/**
 * Crea el HUD del jugador con estadísticas iniciales
 */
function dataPlayer() {
  const render = document.getElementById("content-game");
  render.innerHTML += `<div id="hud" class="fixed top-2 left-2 text-white text-2xl bg-black/50 rounded-lg text-sm">
    ❤️ <span id="life" class="mr-5">0</span>
    💥 <span id="bullet" class="mr-5">0</span>
    🚀 <span id="nitro" class="mr-5">0</span>
  </div> `;
}

/**
 * Crea el panel de ranking de jugadores
 */
function ranking() {
  const render = document.getElementById("content-game");
  render.innerHTML += `<div id="ranking" class="fixed top-2 right-2 text-white text-lg bg-black/50 p-3 rounded-lg w-auto text-sm">
    <h3 class="m-0 text-xl text-center">🏆 Ranking</h3>
    <ol id="ranking-list" class="mt-2 pl-5 list-decimal">
      <li>Jugador1 - 1000</li>
      <li>Jugador2 - 900</li>
      <li>Jugador3 - 850</li>
      <li>Jugador4 - 800</li>
      <li>Jugador5 - 750</li>
      <li>Jugador6 - 700</li>
      <li>Jugador7 - 650</li>
      <li>Jugador8 - 600</li>
      <li>Jugador9 - 550</li>
      <li>Jugador10 - 500</li>
    </ol>
  </div>`;
}

/**
 * Crea el display de coordenadas del jugador
 */
function coords() {
  const render = document.getElementById("content-game");
  render.innerHTML += `<div id="coords" class="fixed bottom-2 left-2 text-white text-lg bg-black/50 p-1 rounded-lg text-sm">
    📍 <span id="coords">X:0, Y:0</span>
  </div>`;
}
/**
 * Actualiza el display de coordenadas con la posición actual del jugador
 */
function getCoords() {
  const render = document.getElementById("coords");
  if (player) {
    render.innerHTML = `<div id="coords" class="fixed bottom-2 left-2 text-white text-lg bg-black/50 p-1 rounded-lg text-sm">
    📍 <span id="coords">X:${Math.round(player.x)}, Y:${Math.round(player.y)}</span>
    </div>`;
  }
}
/**
 * Clase Tank - Representa un tanque en el juego
 * Maneja movimiento, rotación, disparos y estadísticas
 */
class Tank {
  /**
   * Constructor del tanque
   * @param {Image} img - Sprite del tanque
   * @param {number} x - Posición X inicial
   * @param {number} y - Posición Y inicial
   * @param {number} width - Ancho del tanque
   * @param {number} height - Alto del tanque
   */
  constructor(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = 0;           // Ángulo de rotación en radianes
    this.lastShotTime = 0;    // Timestamp del último disparo
    this.shootCooldown = 1000; // Cooldown entre disparos (ms)
    this.life = 100;          // Vida del tanque
    this.bullet = 30;         // Munición disponible
    this.nitro = 5;           // Nitro disponible
  }

  /**
   * Dibuja el tanque en el canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  /**
   * Cambia el ángulo de rotación del tanque
   * @param {number} radian - Nuevo ángulo en radianes
   */
  rotateTo(radian) {
    this.angle = radian;
  }

  /**
   * Verifica si el tanque se está moviendo
   * @returns {boolean} True si alguna tecla de movimiento está presionada
   */
  isMoving() {
    return keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'];
  }

  /**
   * Reduce la vida del tanque por daño recibido
   * @param {number} dmg - Cantidad de daño a aplicar
   */
  updateLife(dmg) {
    this.life -= dmg;
  }

  /**
   * Obtiene la vida actual del tanque
   * @returns {number} Vida del tanque
   */
  getLife() {
    return this.life;
  }

  /**
   * Modifica la munición del tanque
   * @param {number} bullet - Cantidad de munición a agregar/restar
   */
  updateBullet(bullet) {
    this.bullet += bullet;
  }

  /**
   * Obtiene la munición actual del tanque
   * @returns {number} Munición del tanque
   */
  getBullet() {
    return this.bullet;
  }

  /**
   * Modifica el nitro del tanque
   * @param {number} nitro - Cantidad de nitro a agregar/restar
   */
  updateNitro(nitro) {
    this.nitro += nitro;
  }

  /**
   * Obtiene el nitro actual del tanque
   * @returns {number} Nitro del tanque
   */
  getNitro() {
    return this.nitro;
  }
  /**
   * Actualiza la lógica del tanque (movimiento, disparos, límites)
   */
  update() {
    const speed = 5;  // Velocidad de movimiento
    const now = Date.now();

    // Contar teclas de movimiento presionadas (prevenir movimiento diagonal)
    const pressed = [
      keys['ArrowUp'],
      keys['ArrowDown'],
      keys['ArrowLeft'],
      keys['ArrowRight']
    ].filter(Boolean).length;

    if (pressed > 1) return;  // No permitir movimiento diagonal

    // Aplicar límites del mapa (con borde de 200px)
    if (this.x < 200) this.x = 200;
    if (this.x > 9800) this.x = 9800;
    if (this.y < 200) this.y = 200;
    if (this.y > 9800) this.y = 9800;

    // Procesar movimiento según tecla presionada
    switch (true) {
      case keys['ArrowUp']:
        if (count <= 0) this.rotateTo(0);  // Apuntar hacia arriba
        this.y -= speed;
        count++;
        break;

      case keys['ArrowDown']:
        if (count <= 0) this.rotateTo(Math.PI);  // Apuntar hacia abajo
        this.y += speed;
        count++;
        break;

      case keys['ArrowLeft']:
        if (count <= 0) this.rotateTo(-Math.PI / 2);  // Apuntar hacia izquierda
        this.x -= speed;
        count++;
        break;

      case keys['ArrowRight']:
        if (count <= 0) this.rotateTo(Math.PI / 2);  // Apuntar hacia derecha
        this.x += speed;
        count++;
        break;

      case keys[" "]:  // Barra espaciadora
        // Disparar solo si está quieto y pasó el cooldown
        if (!this.isMoving() && now - this.lastShotTime > this.shootCooldown) {
          if (!bullets) bullets = [];
          bullets.push(new Bullet(this.x, this.y, 10, 30, this.angle, this));
          this.lastShotTime = now;  // Reiniciar cooldown
          if (game) {
            game.playSound(SOUND_TYPES.CANON);  // Reproducir sonido de cañón
          }
        }
        break;
    }
  }
}


/**
 * Ajusta el tamaño del canvas para mantener el aspect ratio responsivo
 * Mantiene la resolución interna pero escala visualmente
 */
function resizeCanvas() {
  let windowRatio = window.innerWidth / window.innerHeight;
  let newWidth, newHeight;

  if (windowRatio > ASPECT_RATIO) {
    // La ventana es más ancha → ajustar al alto
    newHeight = window.innerHeight;
    newWidth = newHeight * ASPECT_RATIO;
  } else {
    // La ventana es más alta → ajustar al ancho
    newWidth = window.innerWidth;
    newHeight = newWidth / ASPECT_RATIO;
  }

  // Mantener resolución interna del juego
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;

  // Escalar el canvas visualmente
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";
}
/**
 * Carga todas las imágenes necesarias antes de iniciar el juego
 * @param {Function} callback - Función a ejecutar cuando todas las imágenes estén cargadas
 */
function preloadImages(callback) {
  imagesToLoad.forEach(imgData => {
    const img = new Image();
    img.src = imgData.src;
    img.onload = () => {
      loadedImages[imgData.name] = img;  // Guardar la imagen cargada
      imagesLoadedCount++;

      // Si todas las imágenes se cargaron, ejecutar callback
      if (imagesLoadedCount === imagesToLoad.length) {
        callback();
      }
    };
    img.onerror = () => {
      console.error("Error cargando imagen:", imgData.src);
    };
  });
}

/**
 * Genera un mapa procedural de gran tamaño usando gradientes y ruido
 * @param {number} width - Ancho del mapa en píxeles
 * @param {number} height - Alto del mapa en píxeles
 * @returns {HTMLCanvasElement} Canvas con el mapa generado
 */
function generateMap(width, height) {
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = width;
  mapCanvas.height = height;
  const ctx = mapCanvas.getContext("2d");

  // Fondo base marrón claro
  ctx.fillStyle = "#61614E";
  ctx.fillRect(0, 0, width, height);

  // Generar manchas verdes (vegetación)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 50 + Math.random() * 200;

    const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    grad.addColorStop(0, "rgba(50,150,50,0.8)");
    grad.addColorStop(1, "rgba(50,150,50,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Manchas verdes oscuras (vegetación densa)
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 50 + Math.random() * 200;

    const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    grad.addColorStop(0, "rgba(61, 109, 68, 0.8)");
    grad.addColorStop(1, "rgba(50, 87, 55,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Manchas marrón oscuro (tierra árida)
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 30 + Math.random() * 150;

    const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    grad.addColorStop(0, "rgba(80, 50, 20, 0.8)");
    grad.addColorStop(1, "rgba(80, 50, 20, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Manchas de piedras/roca (15000 para detalle fino)
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 5;

    const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.8)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Difuminado de bordes para efecto de niebla
  const fadeSize = 200; // píxeles de difuminado

  // Borde superior
  const fadeGrad = ctx.createLinearGradient(0, 0, 0, fadeSize);
  fadeGrad.addColorStop(0, "rgba(0,0,0,1)");
  fadeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = fadeGrad;
  ctx.fillRect(0, 0, width, fadeSize);

  // Borde inferior
  const fadeGrad2 = ctx.createLinearGradient(0, height - fadeSize, 0, height);
  fadeGrad2.addColorStop(0, "rgba(0,0,0,0)");
  fadeGrad2.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = fadeGrad2;
  ctx.fillRect(0, height - fadeSize, width, fadeSize);

  // Borde izquierdo
  const fadeGrad3 = ctx.createLinearGradient(0, 0, fadeSize, 0);
  fadeGrad3.addColorStop(0, "rgba(0,0,0,1)");
  fadeGrad3.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fadeGrad3;
  ctx.fillRect(0, 0, fadeSize, height);

  // Borde derecho
  const fadeGrad4 = ctx.createLinearGradient(width - fadeSize, 0, width, 0);
  fadeGrad4.addColorStop(0, "rgba(0,0,0,0)");
  fadeGrad4.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = fadeGrad4;
  ctx.fillRect(width - fadeSize, 0, fadeSize, height);

  return mapCanvas;
}


/**
 * Bucle principal del juego - Game Loop
 * Maneja la actualización y renderizado a 60 FPS
 * @param {number} timestamp - Timestamp del navegador para control de FPS
 */
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  // Control de FPS (60 FPS)
  if (delta > interval) {
    lastTime = timestamp - (delta % interval);

    // Actualizar lógica del jugador
    player.update();

    // Actualizar posición de la cámara para seguir al jugador
    mapOffsetX = player.x - GAME_WIDTH / 2;
    mapOffsetY = player.y - GAME_HEIGHT / 2;

    // Limpiar canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Aplicar transformación de cámara
    ctx.save();
    ctx.translate(-mapOffsetX, -mapOffsetY);

    // Dibujar mapa completo
    ctx.drawImage(mapCanvas, 0, 0);

    // Dibujar jugador
    player.draw(ctx);

    // Procesar colisiones y daños
    game.hits();

    // Dibujar y actualizar balas
    if (Array.isArray(bullets)) {
      // Filtrar balas fuera de límites
      bullets = bullets.filter(bullet =>
        bullet.x > 0 && bullet.x < 10000 &&
        bullet.y > 0 && bullet.y < 10000
      );

      // Actualizar y dibujar cada bala
      bullets.forEach(bullet => {
        bullet.update();
        bullet.draw(ctx);
      });
    }

    // Dibujar tanques NPC (si existen)
    if (Array.isArray(tanks)) {
      tanks.forEach(tank => {
        tank.draw(ctx);
      });
    }

    // Inicialización de elementos de prueba (solo primera iteración)
    if(countInLoop == 0) {
      game.test();  // Generar tanques y balas de prueba
      console.log("test");
      game.update();  // Iniciar timer del HUD
    }
    countInLoop++;

    // Restaurar transformación del canvas
    ctx.restore();
  }

  // Continuar el loop
  requestAnimationFrame(gameLoop);
}




