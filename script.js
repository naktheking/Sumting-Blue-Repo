const arr = []; // particles
const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
const cw = (c.width = 2700);
const ch = (c.height = 2700);
const c2 = c.cloneNode(true);
c2.width = cw;
c2.height = ch;
const ctx2 = c2.getContext("2d", { willReadFrequently: true });
const txtImg = document.querySelector(".text-img");

txtImg.onload = start;
if (txtImg.complete) start();

function start() {
  const imgRatio = txtImg.width / txtImg.height;

  drawWidth = cw;
  drawHeight = cw / imgRatio;

  const drawX = 0;
  const drawY = (ch - drawHeight) / 2;

  ctx2.clearRect(0, 0, cw, ch);
  ctx2.drawImage(txtImg, drawX, drawY, drawWidth, drawHeight);

  for (let i = 0; i < 250; i++) makeFlake(i, true);

  ctx.fillStyle = "#1792e5";
  gsap.ticker.add(render);
}

function makeFlake(i, ff) {
  arr.push({ i: i, x: 0, x2: 0, y: 0, s: 0 });

  arr[i].t = gsap.timeline({ repeat: -1, repeatRefresh: true })
    .fromTo(
      arr[i],
      {
        x: () => -400 + (cw + 800) * Math.random(),
        y: -15,
        s: () => gsap.utils.random(1.8, 7, 0.1),
        x2: -500
      },
      {
        ease: "none",
        y: ch,
        x: () => "+=" + gsap.utils.random(-400, 400, 1),
        x2: 500
      }
    )
    .seek(ff ? Math.random() * 99 : 0)
    .timeScale((arr[i].s / 37)*2);
}

function render() {
  ctx.clearRect(0, 0, cw, ch);

  arr.forEach((flake) => {
    if (flake.t && flake.t.isActive()) {
      const px = Math.floor(flake.x + flake.x2);
      const py = Math.floor(flake.y);

      if (px >= 0 && px < cw && py >= 0 && py < ch) {
        const d = ctx2.getImageData(px, py, 1, 1);
        const r = d.data[0];
        const g = d.data[1];
        const b = d.data[2];
        const isWhite = r > 200 && g > 200 && b > 200;

        if (isWhite && Math.random() > 0.2) {
          flake.t.pause();
          if (arr.length < 1800) makeFlake(arr.length, false);
        }
      }
    }

    ctx.beginPath();
    ctx.arc(
      flake.x + flake.x2,
      flake.y,
      flake.s * gsap.utils.interpolate(1, 0.2, flake.y / ch),
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}