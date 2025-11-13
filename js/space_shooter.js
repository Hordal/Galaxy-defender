// 🚀 GALAXY DEFENDER - v3.0 (Multi-language support) 🚀

// --- DOM 요소 & 컨텍스트 ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI Elements
const gameUI = document.getElementById('gameUI');
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');

// Game Options
const gameModeSelect = document.getElementById('gameMode');
const difficultySelect = document.getElementById('difficulty');
const languageSelect = document.getElementById('language');

// Screens
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');

// Buttons
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');

// Mobile Controls
const mobileControls = document.getElementById('mobileControls');
const touchLeft = document.getElementById('touch-left');
const touchRight = document.getElementById('touch-right');
const touchShoot = document.getElementById('touch-shoot');


// --- 언어 설정 ---
const translations = {
    en: {
        score: "Score:",
        level: "Level:",
        lives: "Lives:",
        highScore: "High Score",
        startGame: "START GAME",
        gameOver: "GAME OVER",
        yourScore: "Your Score",
        restart: "RESTART",
        paused: "PAUSED",
        resume: "RESUME",
        shoot: "SHOOT",
        howToPlay: "How to Play",
        controls: "Controls",
        move: "Move:",
        moveControls: "Arrow Keys (◀ ▶) or A/D",
        shootControls: "Spacebar",
        pause: "Pause:",
        pauseControls: "In-game '❚❚' button",
        goal: "Goal",
        goalDesc: "Survive as long as you can and get the highest score! The game gets faster and more difficult as you level up.",
        enemies: "Enemies",
        enemyNormal: "Normal UFO:",
        enemyNormalDesc: "Easy to destroy.",
        enemyStrong: "Strong Alien:",
        enemyStrongDesc: "Takes more hits.",
        enemyBomber: "Bomber:",
        enemyBomberDesc: "Moves sideways and drops bombs.",
        enemyBoss: "Boss:",
        enemyBossDesc: "Appears every 3 levels. Very tough!",
        powerups: "Power-ups",
        powerupTriple: "Triple Shot:",
        powerupTripleDesc: "Fire three bullets at once.",
        powerupShield: "Shield:",
        powerupShieldDesc: "Protects you from one enemy hit.",
        powerupNone: "None",
        gameMode: "Game Mode:",
        modeNormal: "Normal",
        modeInfinite: "Infinite",
        difficulty: "Difficulty:",
        difficultyEasy: "Easy",
        difficultyNormal: "Normal",
        difficultyHard: "Hard"
    },
    ko: {
        score: "점수:",
        level: "레벨:",
        lives: "생명:",
        highScore: "최고 점수",
        startGame: "게임 시작",
        gameOver: "게임 종료",
        yourScore: "획득 점수",
        restart: "다시 시작",
        paused: "일시정지",
        resume: "계속하기",
        shoot: "발사",
        howToPlay: "게임 방법",
        controls: "조작법",
        move: "이동:",
        moveControls: "방향키 (◀ ▶) 또는 A/D",
        shootControls: "스페이스바",
        pause: "일시정지:",
        pauseControls: "게임 내 '❚❚' 버튼",
        goal: "목표",
        goalDesc: "최대한 오래 살아남아 최고 점수를 달성하세요! 레벨이 오를수록 게임이 더 어려워집니다.",
        enemies: "적",
        enemyNormal: "일반 UFO:",
        enemyNormalDesc: "쉽게 파괴됩니다.",
        enemyStrong: "강한 외계인:",
        enemyStrongDesc: "여러 번 맞춰야 합니다.",
        enemyBomber: "폭격기:",
        enemyBomberDesc: "좌우로 움직이며 폭탄을 떨어뜨립니다.",
        enemyBoss: "보스:",
        enemyBossDesc: "3레벨마다 등장하며 매우 강력합니다!",
        powerups: "파워업",
        powerupTriple: "3연발:",
        powerupTripleDesc: "한 번에 세 발의 총알을 발사합니다.",
        powerupShield: "보호막:",
        powerupShieldDesc: "적으로부터 한 번의 공격을 막아줍니다.",
        powerupNone: "없음",
        gameMode: "게임 모드:",
        modeNormal: "일반",
        modeInfinite: "무한",
        difficulty: "난이도:",
        difficultyEasy: "쉬움",
        difficultyNormal: "보통",
        difficultyHard: "어려움"
    }
};
let currentLanguage = 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Save preference
    localStorage.setItem('galaxyDefenderLanguage', lang);
}


// --- 이미지 로드 ---
const playerImage = new Image(); playerImage.src = "images/fighter.png";
const alienImage = new Image(); alienImage.src = "images/ufo.png";
const alienImage2 = new Image(); alienImage2.src = "images/alien_enemy.png";

// --- 오디오 컨텍스트 (사운드 효과용) ---
let audioCtx;
function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}
function playSound(type, volume = 0.5, duration = 0.1) {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

    switch (type) {
        case 'shoot':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            break;
        case 'explosion':
            oscillator.type = 'noise';
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration * 2);
            break;
        case 'powerup':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
            setTimeout(() => oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1), 100);
            break;
        case 'hit':
             oscillator.type = 'sawtooth';
             oscillator.frequency.setValueAtTime(110, audioCtx.currentTime);
             gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
             break;
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration * 2);
}


// --- 게임 상태 변수 ---
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
let player, bullets, enemies, enemyBullets, items, effects, stars;
let score, highScore;
let keys = {};
let difficulty;
let gameMode; // Added gameMode global variable
let animationFrameId;
let spawnInterval, shootInterval;
let isBossActive = false;
let lastShotTime = 0; // 마지막 발사 시간

// --- 플레이어 설정 ---
const initialPlayerState = {
  x: 180, y: 550, width: 40, height: 40, speed: 5, lives: 3,
  shield: false, shieldTime: 0, powerUp: null, powerUpTime: 0,
};

// --- 난이도 설정 ---
const initialDifficulty = {
  level: 1, nextLevelScore: 50, spawnIntervalDelay: 1000,
  enemyShootChance: 0.2,
  enemySpeedMultiplier: 1, // New: Multiplier for enemy speed
  enemyHpMultiplier: 1,    // New: Multiplier for enemy HP
};

function applyDifficultySettings(selectedDifficulty) {
    difficulty = { ...initialDifficulty }; // Reset to initial
    switch (selectedDifficulty) {
        case 'easy':
            player.lives = 5;
            difficulty.enemySpeedMultiplier = 0.8;
            difficulty.enemyHpMultiplier = 0.8;
            difficulty.spawnIntervalDelay = 1200;
            difficulty.enemyShootChance = 0.1;
            break;
        case 'normal':
            player.lives = 3;
            difficulty.enemySpeedMultiplier = 1;
            difficulty.enemyHpMultiplier = 1;
            difficulty.spawnIntervalDelay = 1000;
            difficulty.enemyShootChance = 0.2;
            break;
        case 'hard':
            player.lives = 2;
            difficulty.enemySpeedMultiplier = 1.2;
            difficulty.enemyHpMultiplier = 1.2;
            difficulty.spawnIntervalDelay = 800;
            difficulty.enemyShootChance = 0.3;
            break;
    }
}


// --- 이벤트 리스너 ---
document.addEventListener("keydown", e => {
    if (gameState === 'playing') {
        if (e.key === " ") e.preventDefault();
        keys[e.key] = true;
    } else if (e.key === "Enter" && (gameState === 'start' || gameState === 'gameOver')) {
        e.preventDefault();
        initGame();
    }
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

startBtn.addEventListener('click', () => { initGame(); startBtn.blur(); });
restartBtn.addEventListener('click', () => { initGame(); restartBtn.blur(); });
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);
languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));


// --- 모바일 컨트롤 설정 ---
function setupMobileControls() {
    if ('ontouchstart' in window) {
        mobileControls.classList.remove('hidden');

        const handleTouch = (e, isStart) => {
            e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.target === touchLeft || touch.target.parentElement === touchLeft) keys['ArrowLeft'] = isStart;
                if (touch.target === touchRight || touch.target.parentElement === touchRight) keys['ArrowRight'] = isStart;
                if (touch.target === touchShoot || touch.target.parentElement === touchShoot) keys[' '] = isStart;
            }
        };
        
        document.addEventListener('touchstart', e => handleTouch(e, true), { passive: false });
        document.addEventListener('touchend', e => handleTouch(e, false), { passive: false });
        document.addEventListener('touchcancel', e => handleTouch(e, false), { passive: false });
    }
}


// --- 게임 초기화 및 상태 관리 ---
function init() {
    const savedLang = localStorage.getItem('galaxyDefenderLanguage') || 'en';
    setLanguage(savedLang);
    languageSelect.value = savedLang;
    
    loadHighScore();
    setupMobileControls();
    createStars();
    showScreen('start');
    if (!animationFrameId) {
        gameLoop();
    }
}

function initGame() {
    initAudio();
    player = { ...initialPlayerState };
    score = 0;
    bullets = []; enemies = []; enemyBullets = []; items = []; effects = [];
    isBossActive = false;
    
    gameMode = gameModeSelect.value; // Store selected game mode
    let selectedDifficulty = difficultySelect.value; // Get selected difficulty
    applyDifficultySettings(selectedDifficulty); // Apply difficulty settings

    updateUI();
    showScreen('none');
    
    gameState = 'playing';
    
    stopGameTimers();
    startGameTimers();

    if (!animationFrameId) {
        gameLoop();
    }
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        stopGameTimers();
        showScreen('pause');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        startGameTimers();
        showScreen('none');
    }
}

function gameOver() {
    gameState = 'gameOver';
    stopGameTimers();
    updateHighScore();
    finalScoreDisplay.innerText = score;
    showScreen('gameOver');
}

function showScreen(screenName) {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    gameUI.classList.add('hidden');

    if (screenName === 'start') startScreen.classList.remove('hidden');
    else if (screenName === 'gameOver') gameOverScreen.classList.remove('hidden');
    else if (screenName === 'pause') pauseScreen.classList.remove('hidden');
    else if (screenName === 'none') gameUI.classList.remove('hidden');
}


// --- 점수 관리 ---
function loadHighScore() {
    highScore = localStorage.getItem('galaxyDefenderHighScore') || 0;
    highScoreDisplay.innerText = highScore;
}
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('galaxyDefenderHighScore', highScore);
        highScoreDisplay.innerText = highScore;
    }
}

// --- 충돌 판정 ---
function isColliding(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// --- 게임 로직 (생성) ---
function spawnEnemy() {
    if (isBossActive) return;
    const x = Math.random() * (canvas.width - 40);
    const rand = Math.random();

    if (difficulty.level >= 2 && rand < 0.2) {
        enemies.push({ x: 0, y: 50, width: 40, height: 30, speed: 2 * difficulty.enemySpeedMultiplier, hp: Math.round(2 * difficulty.enemyHpMultiplier), scoreValue: 10, image: alienImage2, type: 'bomber', moveDir: 1, shootCooldown: 60 });
    } else if (rand < 0.5) {
        enemies.push({ x: x, y: 0, width: 40, height: 40, speed: 1.5 * difficulty.enemySpeedMultiplier, hp: Math.round(3 * difficulty.enemyHpMultiplier), scoreValue: 5, image: alienImage2, type: 'strong' });
    } else {
        enemies.push({ x: x, y: 0, width: 40, height: 40, speed: 2 * difficulty.enemySpeedMultiplier, hp: Math.round(1 * difficulty.enemyHpMultiplier), scoreValue: 1, image: alienImage, type: 'normal' });
    }
}

function spawnBoss() {
    isBossActive = true;
    enemies.push({
        x: canvas.width / 2 - 50, y: -100, width: 100, height: 80,
        speed: 1, hp: Math.round(12.5 * difficulty.level * difficulty.enemyHpMultiplier), scoreValue: 200,
        type: 'boss', phase: 'entering', phaseTime: 120,
        shootCooldown: 0
    });
}

function spawnPowerUp(x, y) {
    const type = Math.random() < 0.5 ? 'tripleShot' : 'shield';
    items.push({ x, y, size: 10, speed: 2, type });
}

function shoot() {
    playSound('shoot', 0.2);
    if (player.powerUp === 'tripleShot') {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7, dx: 0 });
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7, dx: -2 });
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7, dx: 2 });
    } else {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, speed: 7, dx: 0 });
    }
}

function enemyShoot(enemy) {
    if (enemy.type === 'bomber') {
        enemyBullets.push({ x: enemy.x + enemy.width / 2 - 3, y: enemy.y + enemy.height, width: 6, height: 6, speed: 3, type: 'bomb' });
    } else {
        enemyBullets.push({ x: enemy.x + enemy.width / 2 - 2, y: enemy.y + enemy.height, width: 4, height: 10, speed: 5 });
    }
}

function bossAttack(boss) {
    boss.shootCooldown--;
    if (boss.shootCooldown > 0) return;

    const attackType = Math.random();
    if (attackType < 0.5) {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            enemyBullets.push({
                x: boss.x + boss.width / 2, y: boss.y + boss.height / 2,
                width: 5, height: 5, speed: 0,
                dx: Math.cos(angle) * 3, dy: Math.sin(angle) * 3
            });
        }
        boss.shootCooldown = 60;
    } else {
        const angle = Math.atan2(player.y - (boss.y + boss.height / 2), player.x - (boss.x + boss.width / 2));
        for (let i = -1; i <= 1; i++) {
            enemyBullets.push({
                x: boss.x + boss.width / 2, y: boss.y + boss.height / 2,
                width: 4, height: 12, speed: 0,
                dx: Math.cos(angle + i * 0.2) * 4, dy: Math.sin(angle + i * 0.2) * 4
            });
        }
        boss.shootCooldown = 40;
    }
}

function createExplosion(x, y, size = 1) {
    playSound('explosion', 0.5);
    for (let i = 0; i < 20 * size; i++) {
        effects.push({ x, y, size: Math.random() * 3 + 1, speedX: (Math.random() - 0.5) * 4, speedY: (Math.random() - 0.5) * 4, life: 30 });
    }
}

function handlePlayerHit() {
    if (player.shield) {
        player.shield = false;
        playSound('hit', 0.8);
        return;
    }
    if (player.lives > 0) {
        createExplosion(player.x + player.width / 2, player.y + player.height / 2);
        player.lives--;
        player.powerUp = null;
        player.powerUpTime = 0;
        updateUI();
        if (player.lives <= 0) {
            gameOver();
        } else {
            player.x = initialPlayerState.x;
            player.y = initialPlayerState.y;
        }
    }
}


// --- 게임 로직 (업데이트) ---
function update() {
    updatePlayer();
    updateMovement();
    checkCollisions();
    cleanupEntities();
    updateStars();
    updateEffects();
    updateDifficulty();
}

function updatePlayer() {
    if ((keys["ArrowLeft"] || keys["a"]) && player.x > 0) player.x -= player.speed;
    if ((keys["ArrowRight"] || keys["d"]) && player.x + player.width < canvas.width) player.x += player.speed;
    
    // Shoot with cooldown
    if (keys[" "]) {
        const now = Date.now();
        if (now - lastShotTime > 500) { // 500ms = 0.5 seconds
            shoot();
            lastShotTime = now;
        }
    }

    if (player.powerUpTime > 0) { player.powerUpTime--; if (player.powerUpTime === 0) player.powerUp = null; }
    if (player.shieldTime > 0) { player.shieldTime--; if (player.shieldTime === 0) player.shield = false; }
}

function updateMovement() {
    bullets.forEach(b => { b.y -= b.speed; b.x += b.dx; });
    enemyBullets.forEach(eb => {
        if (eb.speed > 0) eb.y += eb.speed;
        if (eb.dx) eb.x += eb.dx;
        if (eb.dy) eb.y += eb.dy;
    });
    items.forEach(item => { item.y += item.speed; });
    enemies.forEach(e => {
        if (e.type === 'boss') {
            if (e.phase === 'entering') {
                e.y += e.speed;
                if (e.y >= 50) { e.phase = 'active'; }
            } else {
                bossAttack(e);
            }
        } else if (e.type === 'bomber') {
            e.x += e.speed * e.moveDir;
            if (e.x <= 0 || e.x + e.width >= canvas.width) e.moveDir *= -1;
            e.shootCooldown--;
            if (e.shootCooldown <= 0 && Math.random() < 0.1) {
                enemyShoot(e);
                e.shootCooldown = 120;
            }
        } else {
            e.y += e.speed;
        }
    });
}

function checkCollisions() {
    const bulletsToRemove = new Set();
    const enemiesThatDied = new Set();

    bullets.forEach(b => {
        enemies.forEach(e => {
            if (enemiesThatDied.has(e) || bulletsToRemove.has(b)) return;
            if (isColliding(b, e)) {
                e.hp--;
                bulletsToRemove.add(b);
                if (e.hp <= 0) enemiesThatDied.add(e);
            }
        });
    });

    if (enemiesThatDied.size > 0) {
        enemiesThatDied.forEach(e => {
            createExplosion(e.x + e.width / 2, e.y + e.height / 2, e.type === 'boss' ? 3 : 1);
            score += e.scoreValue;
            if (e.type === 'boss') isBossActive = false;
            else if (Math.random() < 0.15) spawnPowerUp(e.x + e.width / 2, e.y + e.height / 2);
        });
        updateUI();
    }

    const enemyBulletsToRemove = new Set();
    enemyBullets.forEach(eb => {
        if (isColliding(eb, player)) {
            handlePlayerHit();
            enemyBulletsToRemove.add(eb);
        }
    });

    enemies.forEach(e => {
        if (enemiesThatDied.has(e)) return;
        if (isColliding(e, player)) {
            handlePlayerHit();
            enemiesThatDied.add(e);
            createExplosion(e.x + e.width / 2, e.y + e.height / 2);
        }
    });

    const itemsToRemove = new Set();
    items.forEach(item => {
        const itemHitbox = {
            x: item.x - item.size,
            y: item.y - item.size,
            width: item.size * 2,
            height: item.size * 2
        };
        if (isColliding(itemHitbox, player)) {
            playSound('powerup');
            if (item.type === 'shield') {
                player.shield = true;
                player.shieldTime = 600;
            } else {
                player.powerUp = item.type;
                player.powerUpTime = 300;
            }
            itemsToRemove.add(item);
        }
    });

    if (bulletsToRemove.size > 0) bullets = bullets.filter(b => !bulletsToRemove.has(b));
    if (enemiesThatDied.size > 0) enemies = enemies.filter(e => !enemiesThatDied.has(e));
    if (enemyBulletsToRemove.size > 0) enemyBullets = enemyBullets.filter(eb => !enemyBulletsToRemove.has(eb));
    if (itemsToRemove.size > 0) items = items.filter(item => !itemsToRemove.has(item));
}

function cleanupEntities() {
    bullets = bullets.filter(b => b.y > -b.height);
    enemyBullets = enemyBullets.filter(eb => eb.y < canvas.height && eb.y > -eb.height && eb.x > -eb.width && eb.x < canvas.width);
    items = items.filter(item => item.y < canvas.height);
    enemies = enemies.filter(e => e.y < canvas.height);
}

function updateDifficulty() {
    if (gameMode === 'infinite') {
        // Infinite mode: continuously increase difficulty
        if (!isBossActive && score >= difficulty.nextLevelScore) {
            difficulty.level++;
            difficulty.spawnIntervalDelay = Math.max(100, difficulty.spawnIntervalDelay - 20); // Faster spawning
            difficulty.enemyShootChance = Math.min(0.9, difficulty.enemyShootChance + 0.02); // More enemy bullets
            difficulty.nextLevelScore += 100 + (difficulty.level * 10); // Score needed for next "level" increases
            updateUI();

            if (difficulty.level % 5 === 0) { // Boss every 5 "levels" in infinite mode
                spawnBoss();
            }
            stopGameTimers();
            startGameTimers();
        }
    } else {
        // Normal mode: original level progression
        if (!isBossActive && score >= difficulty.nextLevelScore) {
            difficulty.level++;
            difficulty.spawnIntervalDelay = Math.max(200, difficulty.spawnIntervalDelay - 100);
            difficulty.enemyShootChance = Math.min(0.8, difficulty.enemyShootChance + 0.05);
            difficulty.nextLevelScore += 50;
            updateUI();

            if (difficulty.level % 3 === 0) {
                spawnBoss();
            }
            
            stopGameTimers();
            startGameTimers();
        }
    }
}

function updateStars() { stars.forEach(s => { s.y += s.speed; if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; } }); }
function updateEffects() { effects.forEach(p => { p.x += p.speedX; p.y += p.speedY; p.life--; }); effects = effects.filter(p => p.life > 0); }


// --- 그리기 함수 ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawEffects();
    drawItems();
    enemies.forEach(e => {
        if (e.type === 'boss') {
            ctx.fillStyle = 'purple';
            ctx.fillRect(e.x, e.y, e.width, e.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(e.x, e.y - 15, e.width, 10);
            ctx.fillStyle = 'green';
            ctx.fillRect(e.x, e.y - 15, e.width * (e.hp / (50 * difficulty.level)), 10);
        } else {
            ctx.drawImage(e.image, e.x, e.y, e.width, e.height);
        }
    });
    bullets.forEach(b => { ctx.fillStyle = "yellow"; ctx.fillRect(b.x, b.y, b.width, b.height); });
    enemyBullets.forEach(eb => { ctx.fillStyle = eb.type === 'bomb' ? "orange" : "red"; ctx.fillRect(eb.x, eb.y, eb.width, eb.height); });
    
    if (player.lives > 0) {
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
        if (player.shield) {
            ctx.beginPath();
            ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width / 2 + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 170, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

function drawStars() { ctx.fillStyle = "white"; for (let s of stars) { ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); } }
function drawEffects() { ctx.fillStyle = "orange"; effects.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }); }
function drawItems() {
    items.forEach(item => {
        ctx.fillStyle = item.type === 'shield' ? "cyan" : "lime";
        ctx.beginPath(); ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 10px Arial"; ctx.textAlign = "center";
        ctx.fillText(item.type === 'shield' ? "S" : "P", item.x, item.y + 4);
        ctx.textAlign = "left";
    });
}

function updateUI() {
    scoreDisplay.innerText = score;
    levelDisplay.innerText = difficulty.level;
    livesDisplay.innerText = player.lives;
}


// --- 타이머 및 메인 루프 ---
function stopGameTimers() {
    clearInterval(spawnInterval);
    clearInterval(shootInterval);
}

function startGameTimers() {
    spawnInterval = setInterval(spawnEnemy, difficulty.spawnIntervalDelay);
    shootInterval = setInterval(() => {
        enemies.forEach(e => {
            if (e.type !== 'boss' && e.type !== 'bomber' && Math.random() < difficulty.enemyShootChance) {
                enemyShoot(e);
            }
        });
    }, 500);
}

function createStars() {
    stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, speed: Math.random() * 1 + 0.5
    }));
}

function gameLoop() {
    if (gameState === 'playing') {
        update();
        draw();
    }
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- 게임 시작 ---
init();