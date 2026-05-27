/**
 * game.js - "Town & Learn" Core Game Engine
 * Coordinates progressive floor scaling, procedural map layout, duck dodging, and scrolling.
 * Upgraded with: Quest Compass, Nursery Melodic Synthesizer, and Day/Night cycles!
 */

window.addEventListener('load', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');

  // World parameters calculated per floor
  let WORLD_WIDTH = 1200;
  let WORLD_HEIGHT = 1200;

  // Car State
  const car = {
    x: 300,
    y: 300,
    vx: 0,
    vy: 0,
    angle: 0,
    speed: 0,
    maxSpeed: 5.5,
    accel: 0.18,
    friction: 0.08,
    turnSpeed: 0.06,
    isHonking: false,
    honkTimer: 0,
    scale: 0.9,
    speedBoostTimer: 0
  };

  // Keyboard controls
  const keys = {
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
  };

  // Joystick state
  const joystick = {
    active: false,
    startX: 0,
    startY: 0,
    curX: 0,
    curY: 0,
    dx: 0,
    dy: 0,
    maxDist: 50
  };

  // Level Entities
  let scrollItem = null;
  let npcMayor = null;
  let roads = [];
  let trees = [];
  let roadblocks = [];
  let ducks = [];
  let energyBolts = [];
  const particles = [];
  const starsSky = []; // twinkling stars for night mode

  // Camera Settings
  const camera = { x: 0, y: 0 };

  // Dialogue Overlay elements
  let activeSpeechTimer = 0;
  let floorStartTime = 0;

  // Sound Synthesizer BGM
  let audioCtx = null;
  let musicPlaying = true;
  let musicTimer = null;
  let melodyStep = 0;

  // Kid-friendly arpeggio melody (C Major Pentatonic)
  const musicMelody = [
    261.63, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, // up & down
    293.66, 349.23, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23
  ];

  // Initialize Puzzle State
  let questState = Puzzles.init();

  // Load and generate the active floor!
  function generateFloor() {
    questState = Puzzles.activeQuest;
    floorStartTime = Date.now();
    const floor = Puzzles.currentFloor;
    
    // Calculate map dimensions (increases by 200px each level)
    WORLD_WIDTH = 1000 + (floor * 200);
    WORLD_HEIGHT = 1000 + (floor * 200);

    // Reset car
    car.x = 250;
    car.y = 250;
    car.vx = 0;
    car.vy = 0;
    car.angle = 0;
    car.speed = 0;
    car.speedBoostTimer = 0;

    // Generate Street Roads grid
    roads = [];
    const roadSpacing = 300;
    // Horizontal streets
    for (let y = 250; y < WORLD_HEIGHT - 100; y += roadSpacing) {
      roads.push({ type: 'h', pos: y, start: 100, end: WORLD_WIDTH - 100 });
    }
    // Vertical streets
    for (let x = 250; x < WORLD_WIDTH - 100; x += roadSpacing) {
      roads.push({ type: 'v', pos: x, start: 100, end: WORLD_HEIGHT - 100 });
    }

    // Place Mayor Teddy
    npcMayor = { x: 250, y: 150, radius: 45 };

    // Place Golden Scripture Scroll
    const hRoad = roads[Math.floor(Math.random() * (roads.length / 2))];
    const vRoad = roads[Math.floor(roads.length / 2) + Math.floor(Math.random() * (roads.length / 2))];
    scrollItem = {
      x: vRoad.pos,
      y: hRoad.pos,
      scale: 1,
      collected: false
    };

    // Populate roadblocks (detours)
    roadblocks = [];
    if (floor > 1) {
      const roadblockCount = Math.floor(floor / 2);
      for (let i = 0; i < roadblockCount; i++) {
        const hR = roads[Math.floor(Math.random() * (roads.length / 2))];
        const randomX = 400 + Math.random() * (WORLD_WIDTH - 800);
        roadblocks.push({
          x: randomX,
          y: hR.pos
        });
      }
    }

    // Spawn walking Ducks
    ducks = [];
    const duckCount = floor;
    for (let i = 0; i < duckCount; i++) {
      const vR = roads[Math.floor(roads.length / 2) + Math.floor(Math.random() * (roads.length / 2))];
      ducks.push({
        x: vR.pos,
        y: 200 + Math.random() * (WORLD_HEIGHT - 400),
        dir: Math.random() < 0.5 ? 1 : -1,
        speed: 1.0 + Math.random() * 1.5
      });
    }

    // Energy Lightning Bolts
    energyBolts = [];
    const boltCount = Math.floor(floor / 2) + 2;
    for (let i = 0; i < boltCount; i++) {
      const hR = roads[Math.floor(Math.random() * (roads.length / 2))];
      energyBolts.push({
        x: 200 + Math.random() * (WORLD_WIDTH - 400),
        y: hR.pos,
        active: true
      });
    }

    // Sky stars for Night levels (Floor 7-9)
    starsSky.length = 0;
    for (let i = 0; i < 60; i++) {
      starsSky.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        size: 1 + Math.random() * 3,
        glow: Math.random()
      });
    }

    // Trees
    trees = [];
    const treeGridCount = Math.floor(WORLD_WIDTH / 100);
    for (let i = 0; i < treeGridCount; i++) {
      trees.push({ x: i * 100 + 50, y: 50, scale: 0.8 + Math.random() * 0.4 });
      trees.push({ x: i * 100 + 50, y: WORLD_HEIGHT - 50, scale: 0.8 + Math.random() * 0.4 });
      trees.push({ x: 50, y: i * 100 + 50, scale: 0.8 + Math.random() * 0.4 });
      trees.push({ x: WORLD_WIDTH - 50, y: i * 100 + 50, scale: 0.8 + Math.random() * 0.4 });
    }

    for (let i = 0; i < floor * 2 + 5; i++) {
      const tx = 300 + Math.random() * (WORLD_WIDTH - 600);
      const ty = 300 + Math.random() * (WORLD_HEIGHT - 600);
      
      let onRoad = false;
      roads.forEach(r => {
        if (r.type === 'h' && Math.abs(ty - r.pos) < 65) onRoad = true;
        if (r.type === 'v' && Math.abs(tx - r.pos) < 65) onRoad = true;
      });

      if (!onRoad) {
        trees.push({ x: tx, y: ty, scale: 0.9 + Math.random() * 0.3 });
      }
    }

    Puzzles.updateHUD();
    triggerSpeech("mayor", `Welcome to Floor ${Puzzles.currentFloor}! Explore the streets and find the Golden Scripture Scroll!`);
    
    // Start background sequencer safely
    initSequencer();
  }

  // Melodic background synthesizer logic
  function initSequencer() {
    if (musicTimer) return;
    musicTimer = setInterval(() => {
      if (!musicPlaying) return;
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        // Dynamic volume decay
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.type = "triangle"; // sweet flute-like sound
        const freq = musicMelody[melodyStep % musicMelody.length];
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Gentle kid tone
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);

        melodyStep++;
      } catch (e) {}
    }, 450); // Bouncy tempo
  }

  // Setup canvas sizes dynamically
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Keyboard Event Listeners
  window.addEventListener('keydown', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
    if (e.key === ' ' || e.key === 'h' || e.key === 'H') {
      triggerHonk();
    }
  });

  window.addEventListener('keyup', e => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
  });

  // Main UI Buttons binding
  const joystickContainer = document.getElementById('joystick-container');
  const joystickKnob = document.getElementById('joystick-knob');
  const honkBtn = document.getElementById('honk-btn');
  const startBtn = document.getElementById('start-btn');
  const splashScreen = document.getElementById('splash-screen');
  const garageBtn = document.getElementById('garage-btn');
  const closeGarageBtn = document.getElementById('close-garage-btn');
  const garageOverlay = document.getElementById('garage-overlay');
  const muteBtn = document.getElementById('mute-btn');

  startBtn.addEventListener('click', () => {
    splashScreen.classList.add('hidden');
    Puzzles.playRewardSound(true);
    generateFloor();
  });

  honkBtn.addEventListener('click', triggerHonk);

  // Mute audio toggling
  muteBtn.addEventListener('click', () => {
    musicPlaying = !musicPlaying;
    muteBtn.textContent = musicPlaying ? "🎵 Music: ON" : "🔇 Music: OFF";
    muteBtn.style.background = musicPlaying ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
  });

  // Garage opening/closing
  garageBtn.addEventListener('click', () => {
    garageOverlay.classList.add('active');
  });

  const closeGarageHandler = () => {
    garageOverlay.classList.remove('active');
  };
  closeGarageBtn.addEventListener('click', closeGarageHandler);
  
  const closeGarageBtnTop = document.getElementById('garage-close-btn-top');
  if (closeGarageBtnTop) {
    closeGarageBtnTop.addEventListener('click', closeGarageHandler);
  }

  // Victory screen close button binding
  const victoryCloseBtn = document.getElementById('victory-close-btn');
  if (victoryCloseBtn) {
    victoryCloseBtn.addEventListener('click', () => {
      document.getElementById('victory-overlay').classList.remove('active');
    });
  }


  // Handle Joystick Touch tracking
  joystickContainer.addEventListener('mousedown', startDrag);
  joystickContainer.addEventListener('touchstart', startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();
    joystick.active = true;
    const rect = joystickContainer.getBoundingClientRect();
    joystick.startX = rect.left + rect.width / 2;
    joystick.startY = rect.top + rect.height / 2;
    
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  }

  function drag(e) {
    if (!joystick.active) return;
    
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let dx = clientX - joystick.startX;
    let dy = clientY - joystick.startY;
    let distance = Math.hypot(dx, dy);

    if (distance > joystick.maxDist) {
      dx = (dx / distance) * joystick.maxDist;
      dy = (dy / distance) * joystick.maxDist;
      distance = joystick.maxDist;
    }

    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    
    joystick.dx = dx / joystick.maxDist;
    joystick.dy = dy / joystick.maxDist;
  }

  function endDrag() {
    joystick.active = false;
    joystickKnob.style.transform = 'translate(0px, 0px)';
    joystick.dx = 0;
    joystick.dy = 0;
    
    window.removeEventListener('mousemove', drag);
    window.removeEventListener('touchmove', drag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchend', endDrag);
  }

  // Trigger bouncy cartoon horn
  function triggerHonk() {
    if (car.isHonking) return;
    car.isHonking = true;
    car.honkTimer = 18;

    try {
      const synthCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = synthCtx.createOscillator();
      const gainNode = synthCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(synthCtx.destination);
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(329.63, synthCtx.currentTime); // E4
      osc.frequency.setValueAtTime(392.00, synthCtx.currentTime + 0.08); // G4
      gainNode.gain.setValueAtTime(0.08, synthCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, synthCtx.currentTime + 0.25);
      
      osc.start();
      osc.stop(synthCtx.currentTime + 0.25);
    } catch (e) {}
  }

  // Sparkly celebration confetti particles
  function spawnCelebrationStars(cx, cy) {
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 3,
        size: 6 + Math.random() * 8,
        color: `hsl(${Math.random() * 360}, 95%, 60%)`,
        alpha: 1,
        life: 50 + Math.random() * 30
      });
    }
  }

  // NPC dialogue overlays
  function triggerSpeech(npcId, text) {
    activeSpeechTimer = 180;

    const dialogEl = document.getElementById("dialog-overlay");
    const nameEl = document.getElementById("npc-title");
    const textEl = document.getElementById("npc-speech");
    const avatarCanvas = document.getElementById("npc-avatar-canvas");
    
    nameEl.textContent = "Mayor Teddy";
    textEl.textContent = text;
    dialogEl.classList.add("active");

    const aCtx = avatarCanvas.getContext('2d');
    aCtx.clearRect(0,0,90,90);
    Assets.drawTeddy(aCtx, 45, 55, 1.4);
  }

  // Main game update loop
  function update() {
    // 1. Speed boost cooldown
    if (car.speedBoostTimer > 0) {
      car.speedBoostTimer--;
    }

    // 2. Driving physics
    let forward = 0;
    let turn = 0;

    if (keys.w || keys.ArrowUp) forward = 1;
    if (keys.s || keys.ArrowDown) forward = -0.5;
    if (keys.a || keys.ArrowLeft) turn = -1;
    if (keys.d || keys.ArrowRight) turn = 1;

    if (joystick.active) {
      const pushForce = Math.hypot(joystick.dx, joystick.dy);
      if (pushForce > 0.15) {
        const targetAngle = Math.atan2(joystick.dy, joystick.dx);
        let angleDiff = targetAngle - car.angle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        car.angle += angleDiff * 0.18;
        forward = pushForce;
      } else {
        forward = 0;
      }
      turn = 0;
    }


    // Boosted speed calculation
    const activeMaxSpeed = car.speedBoostTimer > 0 ? car.maxSpeed * 1.5 : car.maxSpeed;

    if (forward !== 0) {
      car.speed += forward * car.accel;
      if (car.speed > activeMaxSpeed) car.speed = activeMaxSpeed;
      if (car.speed < -activeMaxSpeed / 2) car.speed = -activeMaxSpeed / 2;
    } else {
      car.speed *= (1 - car.friction);
    }

    if (Math.abs(car.speed) > 0.1) {
      const turnFactor = car.speed > 0 ? 1 : -1;
      car.angle += turn * car.turnSpeed * turnFactor * (Math.abs(car.speed) / activeMaxSpeed + 0.3);
    }

    car.vx = Math.cos(car.angle) * car.speed;
    car.vy = Math.sin(car.angle) * car.speed;

    car.x += car.vx;
    car.y += car.vy;

    // Boundary Bounces
    if (car.x < 70) { car.x = 70; car.speed *= -0.5; playBounceSound(); }
    if (car.x > WORLD_WIDTH - 70) { car.x = WORLD_WIDTH - 70; car.speed *= -0.5; playBounceSound(); }
    if (car.y < 70) { car.y = 70; car.speed *= -0.5; playBounceSound(); }
    if (car.y > WORLD_HEIGHT - 70) { car.y = WORLD_HEIGHT - 70; car.speed *= -0.5; playBounceSound(); }

    // Roadblock collisions
    roadblocks.forEach(rb => {
      if (Math.hypot(car.x - rb.x, car.y - rb.y) < 32) {
        const angle = Math.atan2(car.y - rb.y, car.x - rb.x);
        car.x = rb.x + Math.cos(angle) * 35;
        car.y = rb.y + Math.sin(angle) * 35;
        car.speed *= -0.5;
        playBounceSound();
      }
    });

    // Springy bounce sound
    function playBounceSound() {
      try {
        const bounceCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = bounceCtx.createOscillator();
        const gainNode = bounceCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(bounceCtx.destination);
        osc.frequency.setValueAtTime(140, bounceCtx.currentTime);
        osc.frequency.quadraticCurveToValueAtTime(280, bounceCtx.currentTime + 0.1, 90);
        gainNode.gain.setValueAtTime(0.04, bounceCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, bounceCtx.currentTime + 0.15);
        osc.start();
        osc.stop(bounceCtx.currentTime + 0.15);
      } catch(e) {}
    }

    // 3. Scripture scroll pickups
    if (scrollItem && !scrollItem.collected && Math.hypot(car.x - scrollItem.x, car.y - scrollItem.y) < 28) {
      scrollItem.collected = true;
      car.speed = 0;
      keys.w = keys.s = keys.a = keys.d = false; // Freeze keys
      
      Puzzles.showScriptureCard(() => {
        triggerSpeech("mayor", "Fantastic! You memorized the scripture. Now return to me at the Town Hall and complete the quest!");
      });
    }

    // 4. Energy Lightning Bolts collection
    energyBolts.forEach(eb => {
      if (eb.active && Math.hypot(car.x - eb.x, car.y - eb.y) < 25) {
        eb.active = false;
        car.speedBoostTimer = 180; // 3 seconds boost
        Puzzles.playRewardSound(true);
        spawnCelebrationStars(eb.x, eb.y);
      }
    });

    // 5. Walking ducks crossing checks
    ducks.forEach(d => {
      d.y += d.speed * d.dir;
      if (d.y < 150) { d.y = 150; d.dir = 1; }
      if (d.y > WORLD_HEIGHT - 200) { d.y = WORLD_HEIGHT - 200; d.dir = -1; }

      if (Math.hypot(car.x - d.x, car.y - d.y) < 25) {
        car.speed = -2;
        car.angle += Math.PI / 4;
        
        try {
          const duckCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = duckCtx.createOscillator();
          const gainNode = duckCtx.createGain();
          osc.connect(gainNode);
          gainNode.connect(duckCtx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(450, duckCtx.currentTime);
          osc.frequency.linearRampToValueAtTime(300, duckCtx.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.08, duckCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, duckCtx.currentTime + 0.25);
          osc.start();
          osc.stop(duckCtx.currentTime + 0.25);
        } catch(e) {}
      }
    });

    // 6. Proximity check with Mayor Teddy (at Town Hall)
    if (npcMayor) {
      const distance = Math.hypot(car.x - npcMayor.x, car.y - npcMayor.y);
      if (distance < npcMayor.radius + 20) {
        if (questState && questState.scrollCollected && questState.stage === "explore") {
          car.speed = 0;
          keys.w = keys.s = keys.a = keys.d = false;
          questState.stage = "solving";

          Puzzles.showInteractivePuzzle((success) => {
            if (success) {
              questState.stage = "ready_for_next";
              spawnCelebrationStars(npcMayor.x, npcMayor.y);
              
              setTimeout(() => {
                Puzzles.clearFloor((isVictory) => {
                  if (!isVictory) {
                    generateFloor();
                  }
                });
              }, 1200);
            }
          });
        }
      }
    }

    // Speech dialog timing
    if (activeSpeechTimer > 0) {
      activeSpeechTimer--;
      if (activeSpeechTimer === 0) {
        document.getElementById("dialog-overlay").classList.remove("active");
      }
    }

    // Engine smoke particles (blue if speed boosted)
    if (Math.abs(car.speed) > 1 && Math.random() < 0.2) {
      particles.push({
        x: car.x - Math.cos(car.angle) * 20 + (Math.random() - 0.5) * 8,
        y: car.y - Math.sin(car.angle) * 20 + (Math.random() - 0.5) * 8,
        vx: -Math.cos(car.angle) * 0.5 + (Math.random() - 0.5) * 0.5,
        vy: -Math.sin(car.angle) * 0.5 + (Math.random() - 0.5) * 0.5,
        size: 3 + Math.random() * 5,
        color: car.speedBoostTimer > 0 ? '#60a5fa' : '#e2e8f0',
        alpha: 0.6,
        life: 25
      });
    }

    // Dynamic lightning trail particles
    if (Puzzles.carAccessory === 'lightning_boost' && Math.abs(car.speed) > 2) {
      particles.push({
        x: car.x - Math.cos(car.angle) * 15 + (Math.random() - 0.5) * 6,
        y: car.y - Math.sin(car.angle) * 15 + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 4,
        color: '#fbbf24', // golden lightning sparks
        alpha: 0.8,
        life: 15
      });
    }

    // Honking wiggles
    if (car.isHonking) {
      car.honkTimer--;
      if (car.honkTimer <= 0) car.isHonking = false;
    }

    // Camera offset
    camera.x = car.x - canvas.width / 2;
    camera.y = car.y - canvas.height / 2;
    camera.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, camera.y));
  }

  // Draw Game Scene
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // --- DAY/NIGHT ENVIRONMENT PALETTES ---
    const floor = Puzzles.currentFloor;
    let grassColor = '#bbf7d0'; // Day (default)
    let specColor = '#86efac';
    let roadColor = '#e2e8f0';
    let lineColor = '#fef08a';
    let isNight = false;

    if (floor >= 4 && floor <= 6) {
      // Golden Sunset
      grassColor = '#fed7aa';
      specColor = '#fdba74';
      roadColor = '#cbd5e1';
      lineColor = '#eab308';
    } else if (floor >= 7 && floor <= 9) {
      // Starry Night
      grassColor = '#1e1b4b';
      specColor = '#312e81';
      roadColor = '#475569';
      lineColor = '#94a3b8';
      isNight = true;
    } else if (floor === 10) {
      // Rainbow Dreamland
      grassColor = `hsl(${(Date.now() / 45) % 360}, 55%, 82%)`;
      specColor = `hsl(${(Date.now() / 45 + 20) % 360}, 55%, 72%)`;
      roadColor = '#f8fafc';
      lineColor = '#fb7185';
    }

    // Draw Grass base
    ctx.fillStyle = grassColor;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Twinkling stars in night mode
    if (isNight) {
      ctx.fillStyle = '#ffffff';
      starsSky.forEach(s => {
        const twinkle = Math.sin(Date.now() * 0.005 + s.x) * 0.35 + 0.65;
        ctx.save();
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
    } else {
      // Dirt grass specs
      ctx.fillStyle = specColor;
      for (let x = 70; x < WORLD_WIDTH; x += 150) {
        for (let y = 70; y < WORLD_HEIGHT; y += 150) {
          ctx.beginPath();
          ctx.arc(x + Math.sin(y)*10, y + Math.cos(x)*10, 4.5, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }

    // --- ROADS ---
    ctx.lineWidth = 85;
    ctx.strokeStyle = roadColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    roads.forEach(r => {
      ctx.beginPath();
      if (r.type === 'h') {
        ctx.moveTo(r.start, r.pos);
        ctx.lineTo(r.end, r.pos);
      } else {
        ctx.moveTo(r.pos, r.start);
        ctx.lineTo(r.pos, r.end);
      }
      ctx.stroke();
    });

    // Yellow Dashes
    ctx.lineWidth = 3;
    ctx.strokeStyle = lineColor;
    ctx.setLineDash([14, 12]);
    roads.forEach(r => {
      ctx.beginPath();
      if (r.type === 'h') {
        ctx.moveTo(r.start, r.pos);
        ctx.lineTo(r.end, r.pos);
      } else {
        ctx.moveTo(r.pos, r.start);
        ctx.lineTo(r.pos, r.end);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // --- ENTITIES ---

    // Draw Energy Bolts
    energyBolts.forEach(eb => {
      if (eb.active) {
        Assets.drawPuddle(ctx, eb.x, eb.y, '#fbbf24', 0.6);
      }
    });

    // Draw Roadblocks
    roadblocks.forEach(rb => {
      Assets.drawRoadblock(ctx, rb.x, rb.y);
    });

    // Draw Scripture Scroll
    if (scrollItem && !scrollItem.collected) {
      Assets.drawScroll(ctx, scrollItem.x, scrollItem.y);
    }

    // Draw Ducks
    ducks.forEach(d => {
      Assets.drawDuck(ctx, d.x, d.y, d.dir);
    });

    // Draw Mayor Teddy
    if (npcMayor) {
      const showPrompt = questState && questState.scrollCollected && questState.stage === "explore";
      const scale = 1.0 + (showPrompt ? Math.sin(Date.now() * 0.008) * 0.05 : 0);
      Assets.drawTeddy(ctx, npcMayor.x, npcMayor.y, scale);

      if (showPrompt) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const bubbleY = npcMayor.y - 45 + Math.sin(Date.now() * 0.007) * 4;
        ctx.roundRect(npcMayor.x - 30, bubbleY - 20, 60, 20, 6);
        ctx.fill();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = "bold 11px Fredoka";
        ctx.textAlign = 'center';
        ctx.fillText("RESOLVE!", npcMayor.x, bubbleY - 6);
      }
    }

    // Draw Margins Trees
    trees.forEach(t => {
      Assets.drawTree(ctx, t.x, t.y, t.scale);
    });

    // Night Mode Headlight Beam overlay in front of car
    if (isNight) {
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);
      
      // Cones of light
      const gradHead = ctx.createRadialGradient(25, 0, 5, 80, 0, 50);
      gradHead.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
      gradHead.addColorStop(1, 'rgba(254, 240, 138, 0)');
      
      ctx.fillStyle = gradHead;
      ctx.beginPath();
      ctx.moveTo(25, -6);
      ctx.lineTo(100, -45);
      ctx.lineTo(100, 45);
      ctx.lineTo(25, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw Player's car
    const activeColor = Puzzles.carPaint;
    const activeAccessory = Puzzles.carAccessory;
    Assets.drawCar(ctx, car.x, car.y, car.angle, activeColor, car.isHonking, car.scale, activeAccessory);

    // --- 🧭 NAVIGATION QUEST COMPASS (Floating arrow near the car pointing to objectives) ---
    if (questState && questState.stage === "explore") {
      let targetX = 0;
      let targetY = 0;
      let label = "";
      let showCompass = true;

      if (!questState.scrollCollected && scrollItem) {
        // Hide scroll compass for the first 60 seconds
        if (Date.now() - floorStartTime < 60000) {
          showCompass = false;
        }
        targetX = scrollItem.x;
        targetY = scrollItem.y;
        label = "Scroll";
      } else if (npcMayor) {
        targetX = npcMayor.x;
        targetY = npcMayor.y;
        label = "Mayor";
      }

      // Check distance to see if it's off-screen
      const dist = Math.hypot(car.x - targetX, car.y - targetY);
      if (showCompass && dist > 280) { // Only draw if target is far away
        const angleToTarget = Math.atan2(targetY - car.y, targetX - car.x);
        
        ctx.save();
        ctx.translate(car.x, car.y);
        ctx.rotate(angleToTarget);

        // Bouncy floating pointer
        const floatArrow = 62 + Math.sin(Date.now() * 0.01) * 4;
        ctx.translate(floatArrow, 0);

        // Draw cute arrow head
        ctx.fillStyle = '#a78bfa';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-4, -8);
        ctx.lineTo(-1, -3);
        ctx.lineTo(-10, -3);
        ctx.lineTo(-10, 3);
        ctx.lineTo(-1, 3);
        ctx.lineTo(-4, 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Draw HUD label near the car
        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.font = "bold 10px Fredoka";
        ctx.textAlign = 'center';
        // Position slightly above the car
        ctx.beginPath();
        ctx.roundRect(car.x - 28, car.y - 48, 56, 15, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.fillText(`${label} ${Math.floor(dist/10)}m`, car.x, car.y - 37);
        ctx.restore();
      }
    }

    // --- CELEBRATION PARTICLES ---
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life--;
      p.alpha = Math.max(0, p.life / 60);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      if (p.life <= 0) particles.splice(i, 1);
    }

    ctx.restore();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
});
