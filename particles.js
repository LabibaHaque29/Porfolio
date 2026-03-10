(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 140;
  const REPEL_R = 90;
  const ATTRACT_R = 230;
  const CONNECT_R = 130;
  const CURSOR_R = 185;
  const MAX_SPD = 2.2;

  const mouse = { x: -9999, y: -9999, active: false };

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function rand(a, b) { return a + Math.random() * (b - a); }

  function Star() {
    this.init();
  }

  Star.prototype.init = function () {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.vx = rand(-0.28, 0.28);
    this.vy = rand(-0.28, 0.28);
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    this.r = rand(0.6, 2.1);
    this.brightness = rand(0.25, 0.65);
  };

  Star.prototype.update = function () {
    var dx = mouse.x - this.x;
    var dy = mouse.y - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (mouse.active && dist < ATTRACT_R) {
      if (dist < REPEL_R && dist > 0.5) {
        // Repel — scatter away fast
        var repelForce = (REPEL_R - dist) / REPEL_R;
        this.vx -= (dx / dist) * repelForce * 5.5;
        this.vy -= (dy / dist) * repelForce * 5.5;
      } else if (dist > 0.5) {
        // Attract — gentle drift inward
        var t = (dist - REPEL_R) / (ATTRACT_R - REPEL_R);
        var attractForce = (1 - t) * 0.18;
        this.vx += (dx / dist) * attractForce;
        this.vy += (dy / dist) * attractForce;
      }
      // Brighten the closer to cursor
      this.brightness = 0.35 + (1 - dist / ATTRACT_R) * 0.65;
    } else {
      // Slowly drift back to a random natural brightness
      this.brightness += (rand(0.25, 0.65) - this.brightness) * 0.015;
    }

    // Friction + drift back toward base velocity
    this.vx = this.vx * 0.955 + this.baseVx * 0.045;
    this.vy = this.vy * 0.955 + this.baseVy * 0.045;

    // Speed cap
    var spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > MAX_SPD) {
      this.vx = (this.vx / spd) * MAX_SPD;
      this.vy = (this.vy / spd) * MAX_SPD;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < -8) this.x = W + 8;
    if (this.x > W + 8) this.x = -8;
    if (this.y < -8) this.y = H + 8;
    if (this.y > H + 8) this.y = -8;
  };

  Star.prototype.draw = function () {
    var alpha = 0.25 + this.brightness * 0.75;
    var r = this.r * (0.65 + this.brightness * 0.55);

    // Soft purple glow halo for bright stars
    if (this.brightness > 0.55) {
      var glowR = r * 5.5;
      var glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowR);
      glow.addColorStop(0, 'rgba(190, 150, 255, ' + ((this.brightness - 0.45) * 0.22) + ')');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Core star dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.4, r), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(220, 200, 255, ' + alpha + ')';
    ctx.fill();
  };

  var stars = [];
  for (var i = 0; i < COUNT; i++) {
    stars.push(new Star());
  }

  function drawLines() {
    // Star-to-star constellation lines
    ctx.lineWidth = 0.55;
    for (var i = 0; i < stars.length; i++) {
      for (var j = i + 1; j < stars.length; j++) {
        var dx = stars[i].x - stars[j].x;
        var dy = stars[i].y - stars[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_R) {
          var a = (1 - d / CONNECT_R) * 0.16;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = 'rgba(139, 92, 246, ' + a + ')';
          ctx.stroke();
        }
      }
    }

    // Cursor constellation — lines connecting cursor to nearby stars
    if (mouse.active) {
      ctx.lineWidth = 0.85;
      for (var k = 0; k < stars.length; k++) {
        var s = stars[k];
        var ddx = s.x - mouse.x;
        var ddy = s.y - mouse.y;
        var dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < CURSOR_R) {
          var ca = (1 - dd / CURSOR_R) * 0.7;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = 'rgba(167, 139, 250, ' + ca + ')';
          ctx.stroke();
        }
      }
    }
  }

  function drawAura() {
    if (!mouse.active) return;
    var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 145);
    g.addColorStop(0,   'rgba(139, 92, 246, 0.20)');
    g.addColorStop(0.35,'rgba(109, 40, 217, 0.08)');
    g.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 145, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawAura();
    drawLines();
    for (var i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }
    requestAnimationFrame(loop);
  }

  loop();
})();
