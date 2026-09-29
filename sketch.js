// ==========================================
// POSTER: "OPTICAL ZAPPER // 1984 LIGHT GUN"
// Compatible with p5.js v1 & v2 (No p5.sound library needed)
// ==========================================

let birdX = 80;
let birdY = 220;
let birdSpeedX = 2.5;
let birdSpeedY = -1.8;
let isFalling = false;
let score = 0;
let screenFlashed = false;

// Standard HTML5 Audio object (works natively in p5 v2)
let customSound = new Audio("hit.mp3");

function setup() {
  createCanvas(400, 600); // Standard poster format
}

function draw() {
  // 1. Poster Outer Frame
  background(242, 238, 230);

  noFill();
  stroke(200, 195, 185);
  strokeWeight(2);
  rect(20, 20, 360, 560);

  // 2. Header
  noStroke();
  fill(25, 25, 30);
  textAlign(LEFT);
  textSize(28);
  text("OPTICAL ZAPPER", 40, 65);

  textSize(10);
  fill(235, 60, 45);
  text("OPTOELECTRONIC TARGETING & SENSOR EXHIBITION", 40, 85);

  textAlign(RIGHT);
  fill(120, 125, 135);
  text("CIRCA 1984", 360, 65);
  text("CRT SENSOR UNIT", 360, 85);

  stroke(215, 210, 200);
  strokeWeight(1);
  line(40, 100, 360, 100);

  // 3. Game Viewport
  // Screen briefly flashes dark on trigger pull
  if (screenFlashed) {
    fill(20, 20, 25);
    screenFlashed = false; // Reset flash after 1 frame
  } else {
    fill(100, 185, 240); // Sky blue
  }
  noStroke();
  rect(40, 110, 320, 320);

  // Clouds
  fill(255, 255, 255, 180);
  for (let cX = 80; cX <= 320; cX = cX + 80) {
    ellipse(cX, 150, 40, 18);
  }

  // 4. Bird Flight & Falling Physics
  if (isFalling === false) {
    birdX = birdX + birdSpeedX;
    birdY = birdY + birdSpeedY;

    // Bounce off window edges
    if (birdX > 325 || birdX < 75) {
      birdSpeedX = birdSpeedX * -1;
    }
    if (birdY < 140 || birdY > 320) {
      birdSpeedY = birdSpeedY * -1;
    }
  } else {
    // Falling straight down into grass
    birdY = birdY + 6;

    // Respawn with randomized flight vector once it lands
    if (birdY > 385) {
      birdX = random(60, 140);
      birdY = random(200, 280);
      birdSpeedX = random(2, 3.5);
      birdSpeedY = random(-2.5, -1);
      isFalling = false;
    }
  }

  // 5. Draw Bird
  if (isFalling === false) {
    fill(140, 75, 30);
    stroke(30);
    strokeWeight(1.5);
    ellipse(birdX, birdY, 24, 16); // Body

    fill(20, 140, 70);
    circle(birdX + (birdSpeedX > 0 ? 10 : -10), birdY - 5, 12); // Head

    fill(245, 180, 20);
    rect(birdX + (birdSpeedX > 0 ? 14 : -18), birdY - 6, 6, 4); // Beak
  } else {
    // Falling state
    fill(180, 80, 50);
    stroke(30);
    strokeWeight(1.5);
    ellipse(birdX, birdY, 16, 24);

    fill(255);
    circle(birdX, birdY - 4, 6);
    fill(0);
    noStroke();
    circle(birdX, birdY - 4, 2);
  }

  // 6. Ground & Grass
  fill(190, 140, 75);
  stroke(130, 95, 45);
  strokeWeight(1);
  rect(40, 395, 320, 35);

  stroke(50, 160, 40);
  strokeWeight(2);
  for (let g = 45; g <= 355; g = g + 12) {
    line(g, 395, g - 2, 384);
  }

  // Score HUD
  noStroke();
  fill(25, 25, 30);
  textSize(12);
  textAlign(LEFT);
  text("HITS: " + score, 50, 135);

  // 7. Targeting Reticle
  noFill();
  strokeWeight(1.5);
  stroke(25, 25, 30);

  circle(mouseX, mouseY, 26);
  circle(mouseX, mouseY, 4);
  line(mouseX - 18, mouseY, mouseX - 6, mouseY);
  line(mouseX + 6, mouseY, mouseX + 18, mouseY);
  line(mouseX, mouseY - 18, mouseX, mouseY - 6);
  line(mouseX, mouseY + 6, mouseX, mouseY + 18);

  // 8. Footer Section
  stroke(215, 210, 200);
  strokeWeight(1);
  line(40, 455, 360, 455);

  noStroke();
  textAlign(LEFT);
  fill(25, 25, 30);
  textSize(12);
  text("OPTOELECTRONIC TIMING & CATHODE DETECTION", 40, 480);

  fill(110, 115, 125);
  textSize(9);
  text("AIM CROSSHAIR: MOVE CURSOR ACROSS TARGET VECTOR", 40, 505);
  text("CLICK MOUSE: TRIGGER LIGHT PULSE & FIRE SENSOR", 40, 520);
  text("AUDIO FEEDBACK: REAL-TIME COLLISION CONFIRMATION", 40, 535);

  fill(230, 226, 218);
  rect(40, 545, 320, 18);
  fill(90, 95, 105);
  textAlign(CENTER);
  textSize(9);
  text("RETRO ARCHIVE UNIT // CLICK TO FIRE", 200, 558);
}

// ------------------------------------------------------------
// Single-Click Trigger Handler (Fixes multi-hit & sound issues)
// ------------------------------------------------------------
function mousePressed() {
  // Only register shots fired inside the game window
  if (mouseX > 40 && mouseX < 360 && mouseY > 110 && mouseY < 430) {
    screenFlashed = true; // Trigger CRT flash

    // Check hit on flying bird
    if (isFalling === false) {
      if (mouseX > birdX - 25 && mouseX < birdX + 25) {
        if (mouseY > birdY - 20 && mouseY < birdY + 20) {
          isFalling = true;
          score = score + 1;
          playZapperSound(); // Play audio feedback
        }
      }
    }
  }
}

// ------------------------------------------------------------
// Universal Sound Function: Works in any browser without p5.sound
// ------------------------------------------------------------
function playZapperSound() {
  // Try playing uploaded hit.mp3 first
  if (customSound) {
    customSound.currentTime = 0;
    customSound.play().catch(function() {
      // If hit.mp3 is missing or blocked, play built-in synth sound
      playSynthZap();
    });
  } else {
    playSynthZap();
  }
}

// Generates an authentic 8-bit arcade laser tone through your speakers
function playSynthZap() {
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(500, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}