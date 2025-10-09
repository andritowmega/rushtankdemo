
let canvas;
let ctx;
let mapCanvas;    // canvas gigante del mapa
let mapOffsetX = 0;
let mapOffsetY = 0;

let lastTime = 0;
const FPS = 60; // frames por segundo
const interval = 1000 / FPS; // ms por framee

const GAME_WIDTH = 1408;   // tamaño base
const GAME_HEIGHT = 700;  // tamaño base
const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

const imagesToLoad = [
  { name: "player", src: "images/tank-cut.png" },
  { name: "bullet", src: "images/bullet.png" },
  { name: "explosion", src: "images/explosion.png" }
];

let count = 0;
let countInLoop = 0;
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  " ": false
};

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  count = 0;
});

/* End of Selection */
const loadedImages = {};
let imagesLoadedCount = 0;
let player;
let game;
let bullets = new Array();
let tanks = new Array();
let hud;

class Bullet {
  constructor(_x, _y, _width, _height, _angle, _owner) {
    this.x = _x;
    this.y = _y;
    this.width = _width;
    this.height = _height;
    this.angle = _angle;
    this.owner = _owner;
    this.speed = 9;
    this.img = loadedImages.bullet;
    this.dmg = 10;
  }
  getDmg() {
    return this.dmg;
  }   
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
  rotateTo(radian) {
    this.angle = radian;
  }
  update() {
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}


class Game {
  constructor() {
    this.mapCanvas = generateMap(10000, 10000);
    this.bullets = [];
  }
  draw() {

  }
  hits(){
    for(let i = 0; i < bullets.length; i++){
      if(bullets[i].owner == player){
        continue;
      }
      if(bullets[i].x > player.x - player.width/2 && bullets[i].x < player.x + player.width/2 && bullets[i].y > player.y - player.height/2 && bullets[i].y < player.y + player.height/2){
        player.updateLife(bullets[i].getDmg());
        game.playSound("hit");
        bullets.splice(i, 1);
        i--;
      }
    }
  }
  playSound(type) {
    const savedSoundEffect = document.cookie.split('; ').find(row => row.startsWith('soundeffect='));
    let soundEffectValue = 100;
    const audio = new Audio();
    if (savedSoundEffect) {
      const soundEffectValue = savedSoundEffect.split('=')[1];
    }
    switch (type) {
      case "canon":
        audio.src = "sounds/canon.mp3";
        audio.volume = soundEffectValue / 100;
        audio.play().catch(err => console.warn("Error al reproducir el sonido:", err));
        break;
      case "hit":
        const randomNum = Math.floor(Math.random() * 11) + 1;
        audio.src = `sounds/impact${randomNum}.mp3`;
        audio.volume = soundEffectValue / 100;
        audio.play().catch(err => console.warn("Error al reproducir el sonido:", err));
        break;
      default:
        break;
    }

  }
  test() {
    
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 10000;
      tanks.push(new Tank(loadedImages.player, x, y, 50, 80));
    }
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 10000;
      bullets.push(new Bullet(x, y, 10, 30, Math.random() * 2 * Math.PI, null));
    }
  }
  update() {
    const timer = () => setInterval(() => {
      getCoords();
      hud.updateHud(player);
    }, 300);
    timer();
  }
}
class Hud {
  constructor() {
  }
  updateHud() {
    const render = document.getElementById("hud");
    render.innerHTML = `<div id="hud" class="fixed top-2 left-2 text-white text-2xl bg-black/50 rounded-lg text-sm">
    ❤️ <span id="life" class="mr-5">${player.getLife()}</span> 
    💥 <span id="bullet" class="mr-5">${player.getBullet()}</span>
    🚀 <span id="nitro" class="mr-5">${player.getNitro()}</span>
  </div>`;

  }
}


function playNow() {
  dataPlayer();
  ranking();
  coords();
  const render = document.getElementById("render");
  render.innerHTML = `<canvas id="gameCanvas" width="800" height="600"></canvas>`;
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  preloadImages(() => {
    game = new Game();
    player = new Tank(loadedImages.player, GAME_WIDTH / 2, GAME_HEIGHT / 2, 50, 80);
    hud = new Hud();
    mapCanvas = generateMap(10000, 10000);
    gameLoop();
  });

}
function dataPlayer() {
  const render = document.getElementById("content-game");
  render.innerHTML += `<div id="hud" class="fixed top-2 left-2 text-white text-2xl bg-black/50 rounded-lg text-sm">
    ❤️ <span id="life" class="mr-5">0</span> 
    💥 <span id="bullet" class="mr-5">0</span>
    🚀 <span id="nitro" class="mr-5">0</span>
  </div> `;
}
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
function coords() {
  const render = document.getElementById("content-game");
  render.innerHTML += `<div id="coords" class="fixed bottom-2 left-2 text-white text-lg bg-black/50 p-1 rounded-lg text-sm">
    📍 <span id="coords">X:0, Y:0</span>
  </div>`;
}
function getCoords() {
  const render = document.getElementById("coords");
  if (player) {
    render.innerHTML = `<div id="coords" class="fixed bottom-2 left-2 text-white text-lg bg-black/50 p-1 rounded-lg text-sm">
    📍 <span id="coords">X:${Math.round(player.x)}, Y:${Math.round(player.y)}</span>
    </div>`;
  }

}
class Tank {
  constructor(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.lastShotTime = 0;     // ⬅️ para el cooldown
    this.shootCooldown = 1000;  // ⬅️ 500 ms entre disparos
    this.life = 100;
    this.bullet = 30;
    this.nitro = 5;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  rotateTo(radian) {
    this.angle = radian;
  }

  isMoving() {
    return keys['ArrowUp'] || keys['ArrowDown'] || keys['ArrowLeft'] || keys['ArrowRight'];
  }
  updateLife(dmg) {
    this.life -= dmg;
  }
  getLife() {
    return this.life;
  }
  updateBullet(bullet) {
    this.bullet += bullet;
  }
  getBullet() {
    return this.bullet;
  }
  updateNitro(nitro) {
    this.nitro += nitro;
  }
  getNitro() {
    return this.nitro;
  }
  update() {
    const speed = 5;
    const now = Date.now();

    const pressed = [
      keys['ArrowUp'],
      keys['ArrowDown'],
      keys['ArrowLeft'],
      keys['ArrowRight']
    ].filter(Boolean).length;

    if (pressed > 1) return;

    // límites
    if (this.x < 200) this.x = 200;
    if (this.x > 9800) this.x = 9800;
    if (this.y < 200) this.y = 200;
    if (this.y > 9800) this.y = 9800;

    // movimiento
    switch (true) {
      case keys['ArrowUp']:
        if (count <= 0) this.rotateTo(0);
        this.y -= speed;
        count++;
        break;

      case keys['ArrowDown']:
        if (count <= 0) this.rotateTo(Math.PI);
        this.y += speed;
        count++;
        break;

      case keys['ArrowLeft']:
        if (count <= 0) this.rotateTo(-Math.PI / 2);
        this.x -= speed;
        count++;
        break;

      case keys['ArrowRight']:
        if (count <= 0) this.rotateTo(Math.PI / 2);
        this.x += speed;
        count++;
        break;

      case keys[" "]:
        // ⬇️ Dispara solo si está quieto y pasó el cooldown
        if (!this.isMoving() && now - this.lastShotTime > this.shootCooldown) {
          if (!bullets) bullets = [];
          bullets.push(new Bullet(this.x, this.y, 10, 30, this.angle, this));
          this.lastShotTime = now; // reiniciar cooldown
          if (game) {
            game.playSound("canon");
          }
        }
        break;
    }
  }
}


function resizeCanvas() {
  let windowRatio = window.innerWidth / window.innerHeight;
  let newWidth, newHeight;

  if (windowRatio > ASPECT_RATIO) {
    // la ventana es más ancha → ajustamos al alto
    newHeight = window.innerHeight;
    newWidth = newHeight * ASPECT_RATIO;
  } else {
    // la ventana es más alta → ajustamos al ancho
    newWidth = window.innerWidth;
    newHeight = newWidth / ASPECT_RATIO;
  }

  canvas.width = GAME_WIDTH;   // resolución interna
  canvas.height = GAME_HEIGHT; // resolución interna

  // escalamos el canvas visualmente
  canvas.style.width = newWidth + "px";
  canvas.style.height = newHeight + "px";
}
function preloadImages(callback) {
  imagesToLoad.forEach(imgData => {
    const img = new Image();
    img.src = imgData.src;
    img.onload = () => {
      loadedImages[imgData.name] = img; // guardar la imagen cargada
      imagesLoadedCount++;

      // si todas se cargaron, llamar al callback
      if (imagesLoadedCount === imagesToLoad.length) {
        callback();
      }
    };
    img.onerror = () => {
      console.error("Error cargando imagen:", imgData.src);
    };
  });
}

// 1. Generar un mapa gigante como canvas
function generateMap(width, height) {
  const mapCanvas = document.createElement("canvas");
  mapCanvas.width = width;
  mapCanvas.height = height;
  const ctx = mapCanvas.getContext("2d");

  // Fondo
  ctx.fillStyle = "#61614E"; // marrón claro base
  ctx.fillRect(0, 0, width, height);

  // Manchas verdes
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

  // Manchas verdes oscuras
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


  // Manchas marrón oscuro (extra)
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 30 + Math.random() * 150;

    const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    grad.addColorStop(0, "rgba(80, 50, 20, 0.8)"); // marrón oscuro
    grad.addColorStop(1, "rgba(80, 50, 20, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }


  // Manchas piedras
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 5;

    const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.8)"); // marrón oscuro
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- DIFUMINADO DE BORDES ---
  const fadeSize = 200; // píxeles de difuminado
  const fadeGrad = ctx.createLinearGradient(0, 0, 0, fadeSize);

  // Arriba
  fadeGrad.addColorStop(0, "rgba(0,0,0,1)");
  fadeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = fadeGrad;
  ctx.fillRect(0, 0, width, fadeSize);

  // Abajo
  const fadeGrad2 = ctx.createLinearGradient(0, height - fadeSize, 0, height);
  fadeGrad2.addColorStop(0, "rgba(0,0,0,0)");
  fadeGrad2.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = fadeGrad2;
  ctx.fillRect(0, height - fadeSize, width, fadeSize);

  // Izquierda
  const fadeGrad3 = ctx.createLinearGradient(0, 0, fadeSize, 0);
  fadeGrad3.addColorStop(0, "rgba(0,0,0,1)");
  fadeGrad3.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = fadeGrad3;
  ctx.fillRect(0, 0, fadeSize, height);

  // Derecha
  const fadeGrad4 = ctx.createLinearGradient(width - fadeSize, 0, width, 0);
  fadeGrad4.addColorStop(0, "rgba(0,0,0,0)");
  fadeGrad4.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = fadeGrad4;
  ctx.fillRect(width - fadeSize, 0, fadeSize, height);

  return mapCanvas;
}


function gameLoop(timestamp) {
  
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  if (delta > interval) {
    lastTime = timestamp - (delta % interval);


    player.update();

    // Actualiza la cámara primero
    mapOffsetX = player.x - GAME_WIDTH / 2;
    mapOffsetY = player.y - GAME_HEIGHT / 2;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // --- Cámara global ---
    ctx.save();
    ctx.translate(-mapOffsetX, -mapOffsetY);

    // Dibujar mapa completo
    ctx.drawImage(mapCanvas, 0, 0);

    // Dibujar jugador
    player.draw(ctx);
    game.hits();

    // Dibujar balas
    if (Array.isArray(bullets)) {
      bullets = bullets.filter(bullet =>
        bullet.x > 0 && bullet.x < 10000 &&
        bullet.y > 0 && bullet.y < 10000
      );

      bullets.forEach(bullet => {
        bullet.update();
        bullet.draw(ctx);
      });
    }
    if (Array.isArray(tanks)) {
      tanks.forEach(tank => {
        tank.draw(ctx);
      });
    }
    if(countInLoop==0) {
      game.test();
      console.log("test");
      game.update();
    }
    countInLoop++;
    ctx.restore();

  }
  requestAnimationFrame(gameLoop);
}




