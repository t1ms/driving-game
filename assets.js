/**
 * assets.js - Vector Rendering Library for "Town & Learn"
 * Custom Canvas drawing functions for bright, premium cartoon graphics.
 */

const Assets = {
  // Draw a cartoon car centered at (0, 0) facing angle
  drawCar(ctx, x, y, angle, color = '#ff477e', isHonking = false, scale = 1, accessory = null) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);

    // If honking, shake slightly and draw honk lines
    if (isHonking) {
      ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
      
      // Honk visual waves
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(35, -15, 15, -Math.PI/4, Math.PI/4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(40, -15, 25, -Math.PI/4, Math.PI/4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(35, 15, 15, -Math.PI/4, Math.PI/4, true);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(40, 15, 25, -Math.PI/4, Math.PI/4, true);
      ctx.stroke();
    }

    // 1. Wheel Shadows
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(-15, -18, 12, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(15, -18, 12, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(-15, 18, 12, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(15, 18, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Tires
    ctx.fillStyle = '#1e293b';
    const drawTire = (tx, ty) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(tx - 10, ty - 5, 20, 10, 4);
      ctx.fill();
      // Wheel rims
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.ellipse(tx, ty, 6, 3, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    };
    drawTire(-15, -16);
    drawTire(15, -16);
    drawTire(-15, 16);
    drawTire(15, 16);

    // 3. Main Car Body Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.roundRect(-27, -13, 56, 28, 12);
    ctx.fill();

    // 4. Main Car Body
    ctx.fillStyle = color;
    // Special rainbow paint handling
    if (color === 'rainbow') {
      const grad = ctx.createLinearGradient(-25, 0, 25, 0);
      grad.addColorStop(0, '#ff477e');
      grad.addColorStop(0.3, '#facc15');
      grad.addColorStop(0.6, '#4cc9f0');
      grad.addColorStop(1, '#a855f7');
      ctx.fillStyle = grad;
    }
    ctx.beginPath();
    ctx.roundRect(-25, -15, 50, 30, 10);
    ctx.fill();

    // Shiny overlay (top light reflection)
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.roundRect(-23, -13, 46, 8, 4);
    ctx.fill();

    // 5. Car Windshield/Cabin (Glass)
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-10, -10, 20, 20, 6);
    ctx.fill();
    ctx.stroke();

    // Glare on window
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(-6, -7);
    ctx.lineTo(2, 7);
    ctx.lineTo(6, 7);
    ctx.lineTo(-2, -7);
    ctx.closePath();
    ctx.fill();

    // 6. Headlights
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(24, -9, 4, 0, Math.PI * 2);
    ctx.arc(24, 9, 4, 0, Math.PI * 2);
    ctx.fill();

    // 7. Render unlocked accessories
    if (accessory === 'bunny_ears') {
      // Draw bunny ears on the hood!
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 2;
      // Left ear
      ctx.beginPath();
      ctx.ellipse(18, -6, 8, 3.5, -0.4, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      // Right ear
      ctx.beginPath();
      ctx.ellipse(18, 6, 8, 3.5, 0.4, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
    } else if (accessory === 'star_wings') {
      // Draw wings on the sides!
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      // Left wing
      ctx.beginPath();
      ctx.moveTo(-10, -15);
      ctx.lineTo(-22, -26);
      ctx.lineTo(-2, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Right wing
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(-22, 26);
      ctx.lineTo(-2, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (accessory === 'roof_siren') {
      // Flashing police siren on the roof
      const flash = Math.floor(Date.now() / 150) % 2;
      ctx.fillStyle = flash === 0 ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(-4, -6, 8, 12, 3);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, -2, 4, 4); // bulb center
    } else if (accessory === 'royal_crown') {
      // Shiny crown on the roof
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-6, 3);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-3, -1);
      ctx.lineTo(0, -6);
      ctx.lineTo(3, -1);
      ctx.lineTo(8, -4);
      ctx.lineTo(6, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Crown jewels
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -6, 1.5, 0, Math.PI*2);
      ctx.arc(-8, -4, 1.2, 0, Math.PI*2);
      ctx.arc(8, -4, 1.2, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  },

  // Draw Golden Scripture Scrolls
  drawScroll(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Floating bounce
    const float = Math.sin(Date.now() * 0.009) * 5;
    ctx.translate(0, float);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(0, 18 - float, 14, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // Gold Sparkles surrounding it
    ctx.fillStyle = '#fef08a';
    const angle = Date.now() * 0.003;
    for (let i = 0; i < 4; i++) {
      const sx = Math.sin(angle + i * Math.PI / 2) * 16;
      const sy = Math.cos(angle + i * Math.PI / 2) * 16;
      ctx.fillRect(sx, sy, 3, 3);
    }

    // Scroll base (Parchment color)
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-15, -9, 30, 18, 4);
    ctx.fill();
    ctx.stroke();

    // Scroll side rolls (thick columns)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.roundRect(-19, -12, 5, 24, 3);
    ctx.roundRect(14, -12, 5, 24, 3);
    ctx.fill();
    ctx.stroke();

    // Red tying ribbon
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-3, -9, 6, 18);

    ctx.restore();
  },

  // Draw cute walking Duck Obstacle
  drawDuck(ctx, x, y, dir = 1, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    if (dir === -1) ctx.scale(-1, 1); // Flip horizontally depending on walk direction

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // Feet (Orange)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(-4, 12, 4, 2, 0, 0, Math.PI*2);
    ctx.ellipse(4, 12, 4, 2, 0, 0, Math.PI*2);
    ctx.fill();

    // Body (Yellow)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(0, 4, 10, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(-2, 4, 6, 4, 0.2, 0, Math.PI*2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(6, -6, 6, 0, Math.PI*2);
    ctx.fill();

    // Beak (Orange)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(11, -8);
    ctx.lineTo(16, -6);
    ctx.lineTo(11, -4);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(6, -7, 1.2, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  },

  // Draw solid Roadblock obstacles
  drawRoadblock(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(-22, 10, 44, 4);

    // Support feet (Grey)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-18, 0, 6, 12);
    ctx.fillRect(12, 0, 6, 12);

    // Bar gate block
    ctx.fillStyle = '#eab308'; // Yellow base
    ctx.fillRect(-24, -14, 48, 14);

    // Black stripes on roadblock
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-18, -14); ctx.lineTo(-12, -14); ctx.lineTo(-18, 0); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, -14); ctx.lineTo(0, -14); ctx.lineTo(-6, 0); ctx.lineTo(-12, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(6, -14); ctx.lineTo(12, -14); ctx.lineTo(6, 0); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(18, -14); ctx.lineTo(24, -14); ctx.lineTo(18, 0); ctx.lineTo(12, 0); ctx.closePath(); ctx.fill();

    ctx.restore();
  },

  // Draw Chef Bunny
  drawBunny(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#f8fafc';
    const drawEar = (ex, angle) => {
      ctx.save();
      ctx.translate(ex, -18);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, -15, 6, 18, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.ellipse(0, -15, 3.5, 12, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    };
    drawEar(-7, -0.1);
    drawEar(7, 0.1);

    // Body
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chef Coat details
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-3, 2, 6, 8);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-6, 2); ctx.lineTo(0, -1); ctx.lineTo(6, 2); ctx.lineTo(0, 5);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(0, -10, 15, 0, Math.PI * 2);
    ctx.fill();

    // Cheeks
    ctx.fillStyle = '#fecdd3';
    ctx.beginPath();
    ctx.arc(-8, -8, 4, 0, Math.PI * 2);
    ctx.arc(8, -8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-5, -12, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(0, -9); ctx.lineTo(-2.5, -7); ctx.lineTo(2.5, -7);
    ctx.closePath();
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(-1.5, -6, 2, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(1.5, -6, 2, 0, Math.PI); ctx.stroke();

    // Chef Hat
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-8, -32, 16, 8, 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(-6, -34, 7, 0, Math.PI * 2);
    ctx.arc(6, -34, 7, 0, Math.PI * 2);
    ctx.arc(0, -38, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  },

  // Draw Firefighter Pup
  drawPup(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#b45309';
    const drawPupEar = (ex, angle) => {
      ctx.save();
      ctx.translate(ex, -12);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 10, 5, 14, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    };
    drawPupEar(-14, 0.2);
    drawPupEar(14, -0.2);

    // Body
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 8, 15, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Firefighter Vest
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-10, 2, 20, 14, 4);
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-10, 5, 20, 3);
    ctx.fillRect(-10, 10, 20, 3);

    // Head
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, -8, 14, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, -5, 7, 5, 0, 0, Math.PI*2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-5, -10, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -10, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -7, 2, 0, Math.PI*2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(-1.5, -4, 2, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(1.5, -4, 2, 0, Math.PI); ctx.stroke();

    // Red Helmet
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -18, 13, Math.PI, 0);
    ctx.fill();
    // Helmet Brim
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-17, -17);
    ctx.quadraticCurveTo(0, -13, 17, -17);
    ctx.stroke();
    // Shield
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(0, -26); ctx.lineTo(4, -22); ctx.lineTo(2, -17); ctx.lineTo(-2, -17); ctx.lineTo(-4, -22);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  },

  // Draw Mayor Teddy
  drawTeddy(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Teddy Ears
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(-10, -18, 6, 0, Math.PI * 2);
    ctx.arc(10, -18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(-10, -18, 3, 0, Math.PI * 2);
    ctx.arc(10, -18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mayor Suit
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-10, 2, 20, 14);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-4, 2); ctx.lineTo(4, 2); ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-4, 3); ctx.lineTo(-1, 5); ctx.lineTo(-4, 7); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, 3); ctx.lineTo(1, 5); ctx.lineTo(4, 7); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -10, 15, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.ellipse(0, -7, 6, 4.5, 0, 0, Math.PI*2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(-5, -11, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -11, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -8, 2, 0, Math.PI*2);
    ctx.fill();

    // Monocle
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(5, -11, 5, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, -11); ctx.quadraticCurveTo(15, -5, 16, 5); ctx.stroke();

    // Mayor Top Hat
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-15, -26, 30, 4);
    ctx.fillRect(-10, -42, 20, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-10, -29, 20, 3);

    ctx.restore();
  },

  // Draw Cartoon Houses
  drawHouse(ctx, x, y, color = '#3b82f6', isTarget = false, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath(); ctx.ellipse(0, 35, 55, 15, 0, 0, Math.PI*2); ctx.fill();

    if (isTarget) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.roundRect(-50, -45, 100, 90, 16); ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      const bounce = Math.sin(Date.now() * 0.007) * 8;
      ctx.moveTo(-10, -65 + bounce);
      ctx.lineTo(10, -65 + bounce);
      ctx.lineTo(0, -50 + bounce);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(-40, -20, 80, 55, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(-40, -20, 80, 55, 8); ctx.stroke();

    // Roof
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(-48, -20); ctx.lineTo(0, -48); ctx.lineTo(48, -20);
    ctx.closePath();
    ctx.fill();

    // Windows
    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    const drawWindow = (wx, wy) => {
      ctx.beginPath(); ctx.roundRect(wx - 10, wy - 10, 20, 20, 4); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wx, wy - 10); ctx.lineTo(wx, wy + 10);
      ctx.moveTo(wx - 10, wy); ctx.lineTo(wx + 10, wy);
      ctx.stroke();
    };
    drawWindow(-20, 0);
    drawWindow(20, 0);

    // Door
    ctx.fillStyle = '#78350f';
    ctx.beginPath(); ctx.roundRect(-10, 10, 20, 25, 4); ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(6, 22, 2.5, 0, Math.PI*2); ctx.fill();

    // Chimney
    ctx.fillStyle = '#475569';
    ctx.fillRect(20, -42, 10, 18);

    ctx.restore();
  },

  // Draw Cartoon Trees
  drawTree(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(0, 30, 25, 8, 0, 0, Math.PI*2); ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.beginPath(); ctx.roundRect(-6, 0, 12, 32, 4); ctx.fill();

    // Foliage
    ctx.fillStyle = '#15803d';
    ctx.beginPath(); ctx.arc(0, -6, 26, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(-8, -14, 20, 0, Math.PI * 2);
    ctx.arc(8, -14, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(0, -22, 16, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  },

  // Draw Paint Puddles
  drawPuddle(ctx, x, y, color = '#3b82f6', scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.bezierCurveTo(-25, -15, -15, -25, 0, -20);
    ctx.bezierCurveTo(15, -22, 25, -10, 20, 5);
    ctx.bezierCurveTo(22, 18, 5, 25, -8, 20);
    ctx.bezierCurveTo(-20, 22, -28, 12, -25, 0);
    ctx.closePath();
    ctx.fill();

    // Highlights
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-8, -8, 8, 4, Math.PI/6, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }
};
