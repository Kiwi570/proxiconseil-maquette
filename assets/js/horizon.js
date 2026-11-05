/* Effet « horizon-vivant » : le hero de l'accueil, un lever de soleil rendu en WebGL par-dessus son image.
   - L'image (balise img, même cadrage) reste dessous : sans WebGL, en mode calme ou en attendant, rien ne manque.
   - Profondeur déduite de la ligne d'horizon (ciel lointain, premier plan proche) : la souris décale le premier plan
     plus que le lointain (parallaxe) ; au défilement, travelling vers le soleil, le premier plan grossit plus vite.
   - Sous la souris, les courbes de niveau de la lumière apparaissent (loupe de cartographe) ; au clic, l'image ondule.
   - Souris immobile sur l'image : le temps de l'image s'arrête, plus rien ne dérive.
   - 60 images par seconde au plus, densité limitée, qualité qui baisse d'elle-même si les images tardent ;
     mesures au chargement et au redimensionnement seulement (jamais pendant le défilement). */
import { boucle, etat } from './socle/index.js?v=5';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform sampler2D uImg; uniform sampler2D uFlou;
uniform vec2 uRes; uniform vec4 uCadre; uniform vec3 uOrig;
uniform vec2 uSoleil; uniform float uHorizon;
uniform vec2 uSouris; uniform float uForce; uniform vec2 uPara;
uniform float uT; uniform float uGrain; uniform float uDolly; uniform float uLever;
uniform vec2 uClic; uniform float uClicT;
float lum(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
float hasard(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec2 h2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1.0 + 2.0 * fract(sin(p) * 43758.5453); }
float bruit(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(h2(i), f), dot(h2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(h2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(h2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
float relief(vec2 p){ float v = 0.0, a = 0.55; for (int i = 0; i < 3; i++) { v += a * bruit(p); p = p * 2.03 + vec2(3.1, 7.7); a *= 0.5; } return v; }
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  /* Onde du clic : l'image ondule autour du point cliqué, puis se calme. */
  vec2 dc = p - uClic; float lc = length(dc) / uRes.y; float rc = uClicT * 0.75;
  float env = exp(-abs(lc - rc) * 16.0) * (1.0 - uClicT) * step(0.0001, uClicT);
  p += (dc / max(length(dc), 1.0)) * sin((lc - rc) * 70.0) * env * uRes.y * 0.006;
  /* Même cadrage que l'image : cover, point d'ancrage, zoom. */
  vec2 q = uOrig.xy + (p - uOrig.xy) / uOrig.z;
  vec2 uv = (q - uCadre.xy) / uCadre.zw;
  float prof = clamp((uv.y - uHorizon) / (1.0 - uHorizon), 0.0, 1.0);
  float pr = pow(prof, 0.85);
  vec2 derive = vec2(sin(uT * 0.21), cos(uT * 0.17)) * 0.0035;
  uv -= (uPara * 0.014 + derive) * pr;
  float ciel = 1.0 - smoothstep(uHorizon - 0.02, uHorizon, uv.y);
  uv += uPara * 0.003 * ciel * vec2(1.0, 0.3);
  /* Travelling vers le soleil. */
  uv = uSoleil + (uv - uSoleil) / (1.0 + uDolly * (0.22 + 0.9 * pr));
  uv = clamp(uv, vec2(0.001), vec2(0.999));
  vec3 col = texture2D(uImg, uv).rgb;
  /* Lever : halo chaud autour du soleil. */
  vec2 ds = (uv - uSoleil) * vec2(uCadre.z / uCadre.w, 1.0);
  float g = exp(-dot(ds, ds) * 26.0), g2 = exp(-dot(ds, ds) * 220.0);
  col += vec3(1.0, 0.66, 0.34) * (g * 0.09 + g2 * 0.22) * uLever * (0.9 + 0.1 * sin(uT * 0.8));
  /* Loupe de cartographe : sous la souris, le paysage révèle ses courbes de niveau (lumière + relief),
     et le terrain se soulève autour du curseur. Calculée seulement quand la souris est là (branche uniforme). */
  if (uForce > 0.001) {
    vec2 dm = (p - uSouris) / uRes.y;
    float dl = length(dm);
    float L = lum(texture2D(uFlou, uv).rgb);
    vec2 a = vec2(uv.x * uCadre.z / uCadre.w, uv.y);
    float hauteur = L * 0.9 + pr * 0.7 + relief(a * 3.2 + vec2(0.0, uT * 0.01)) * 0.32 + uForce * 0.3 * exp(-dl * dl * 26.0);
    float v = hauteur * 26.0;
    float f = fract(v);
    #ifdef GL_OES_standard_derivatives
    float w = fwidth(v) * 1.1;
    #else
    float w = 0.08;
    #endif
    float m = smoothstep(0.24, 0.17, dl) * uForce;
    float ligne = 1.0 - smoothstep(0.0, w, min(f, 1.0 - f));
    float majeure = 1.0 - step(0.5, abs(mod(floor(v + 0.5), 5.0)));
    vec3 trait = mix(vec3(0.957, 0.945, 0.918), vec3(0.0, 0.33, 0.37), step(0.58, L));
    col = mix(col, col * 1.05 + 0.025, m * 0.6);
    col = mix(col, trait, ligne * (0.32 + 0.38 * majeure) * m);
    float bord = exp(-pow((dl - 0.24) / 0.0035, 2.0)) * uForce;
    col = mix(col, trait, bord * 0.4);
  }
  /* Grain de film léger (fixe sous la souris immobile). */
  col += (hasard(gl_FragCoord.xy + uGrain) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;

const nombres = (s, defaut) => { const t = String(s || '').trim().split(/\s+/).map(Number); return t.length === 2 && t.every(Number.isFinite) ? t : defaut; };

export function horizonVivant(scene, zone) {
  const api = { defiler() {}, lever() {}, onde() {}, cadrer() {}, qualite() {} };
  if (!scene) return api;
  const img = scene.querySelector('img');
  const canvas = scene.querySelector('canvas');
  const pose = scene.querySelector('.hero-pose');
  const horizon = parseFloat(scene.dataset.horizon) || 0.55;

  /* Cadrage partagé : cover, object-position et zoom de l'image (variables CSS --cadre-*), en pixels CSS. */
  let cadre = null;
  function cadrer() {
    const W = scene.clientWidth, H = scene.clientHeight;
    const iw = img.naturalWidth || +img.getAttribute('width') || 16, ih = img.naturalHeight || +img.getAttribute('height') || 9;
    const cs = getComputedStyle(scene);
    const z = parseFloat(cs.getPropertyValue('--cadre-zoom')) || 1;
    const px = parseFloat(cs.getPropertyValue('--cadre-x')) || 0, py = parseFloat(cs.getPropertyValue('--cadre-y')) || 0;
    const s0 = Math.max(W / iw, H / ih), Dx = iw * s0, Dy = ih * s0;
    const mobile = /-mobile-/.test(img.currentSrc || '');
    const [u, v] = nombres(mobile ? scene.dataset.soleilMobile : scene.dataset.soleil, [0.5, horizon]);
    cadre = { W, H, z, Ox: (W - Dx) * px, Oy: (H - Dy) * py, Dx, Dy, ox: W * px, oy: H * py, u, v };
    const sx = cadre.ox + (cadre.Ox + u * Dx - cadre.ox) * z, sy = cadre.oy + (cadre.Oy + v * Dy - cadre.oy) * z;
    if (pose) { pose.style.setProperty('--pose-x', `${sx.toFixed(1)}px`); pose.style.setProperty('--pose-y', `${sy.toFixed(1)}px`); }
    return cadre;
  }
  api.cadrer = cadrer;
  cadrer();
  img.addEventListener('load', cadrer);
  let attenteCadre = 0;
  window.addEventListener('resize', () => { clearTimeout(attenteCadre); attenteCadre = setTimeout(cadrer, 120); });

  if (etat.calme || !canvas) return api;
  let gl = null;
  try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false }); } catch {}
  if (!gl) return api;
  gl.getExtension('OES_standard_derivatives');
  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (err) { console.warn('[horizon] WebGL indisponible', err); return api; }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const u = Object.fromEntries(['uImg', 'uFlou', 'uRes', 'uCadre', 'uOrig', 'uSoleil', 'uHorizon', 'uSouris', 'uForce', 'uPara', 'uT', 'uGrain', 'uDolly', 'uLever', 'uClic', 'uClicT'].map((n) => [n, U(n)]));
  const texture = (unite) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unite);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  const texImage = texture(0), texFlou = texture(1);
  gl.uniform1i(u.uImg, 0); gl.uniform1i(u.uFlou, 1);
  let pret = false;
  function charger() {
    if (!img.complete || !img.naturalWidth) return;
    try {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texImage);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      /* Version très floue pour les courbes de niveau (formes larges, pas de détails). */
      const fw = 128, fh = Math.max(8, Math.round(128 * img.naturalHeight / img.naturalWidth));
      const c2 = document.createElement('canvas'); c2.width = fw; c2.height = fh;
      const x = c2.getContext('2d');
      if ('filter' in x) x.filter = 'blur(3px)';
      x.drawImage(img, 0, 0, fw, fh);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texFlou);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c2);
      pret = true;
      mesurer();
      dessiner();
      if (!enAttente) canvas.classList.add('gl-pret');
    } catch (err) { console.warn('[horizon] texture', err); }
  }

  /* Pendant l'intro, l'image seule (le WebGL attend, invisible) : l'intro reste fluide ; à la fin (api.qualite),
     le WebGL prend le relais en fondu, au même cadrage. */
  let enAttente = etat.arrivee === 'intro';
  let echelle = 1, w = 2, h = 2, dpr = 1, temps = 0, dernier = 0, lentes = 0, grain = 0;
  let defil = 0, lever = 0, decalage = 0;
  /* Souris : cible et position suivie (pixels CSS de la scène), parallaxe, présence. */
  let mx = 0, my = 0, sx = 0, sy = 0, cpx = 0, cpy = 0, tpx = 0, tpy = 0, force = 0, dedans = false, clicX = -9999, clicY = -9999, clicT = 0;
  /* Densité 1 : l'image source est déjà plus douce que l'écran, inutile de calculer plus de pixels. */
  const dprMax = () => 1;
  function mesurer() {
    cadrer();
    dpr = Math.min(window.devicePixelRatio || 1, dprMax()) * echelle;
    w = Math.max(2, Math.round(cadre.W * dpr)); h = Math.max(2, Math.round(cadre.H * dpr));
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
  function dessiner() {
    if (!pret) return;
    const k = cadre, d = dpr;
    gl.uniform2f(u.uRes, w, h);
    gl.uniform4f(u.uCadre, k.Ox * d, k.Oy * d, k.Dx * d, k.Dy * d);
    gl.uniform3f(u.uOrig, k.ox * d, k.oy * d, k.z);
    gl.uniform2f(u.uSoleil, k.u, k.v); gl.uniform1f(u.uHorizon, horizon);
    gl.uniform2f(u.uSouris, sx * d, sy * d); gl.uniform1f(u.uForce, force); gl.uniform2f(u.uPara, cpx, cpy);
    gl.uniform1f(u.uT, temps); gl.uniform1f(u.uGrain, grain); gl.uniform1f(u.uDolly, defil); gl.uniform1f(u.uLever, lever);
    gl.uniform2f(u.uClic, clicX * d, clicY * d); gl.uniform1f(u.uClicT, clicT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  mesurer();
  if (img.complete && img.naturalWidth) charger();
  img.addEventListener('load', charger);
  let attente = 0;
  window.addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(() => { mesurer(); dessiner(); }, 140); });

  boucle(canvas, (dt, t) => {
    if (!pret || enAttente) return;
    if (t - dernier < 0.0155) return;
    const ecart = dernier ? t - dernier : 1 / 60;
    dernier = t;
    /* Sous la souris immobile, le temps de l'image s'arrête. */
    temps += Math.min(dt, 0.05) * (1 - force);
    if (force < 0.5) grain = (grain + 17.31) % 1000;
    const k = 1 - Math.exp(-dt * 10), kp = 1 - Math.exp(-dt * 5);
    sx += (mx - sx) * k; sy += (my - sy) * k;
    if (Math.abs(mx - sx) < 0.2 && Math.abs(my - sy) < 0.2) { sx = mx; sy = my; }
    cpx += (tpx - cpx) * kp; cpy += (tpy - cpy) * kp;
    if (Math.abs(tpx - cpx) < 0.001 && Math.abs(tpy - cpy) < 0.001) { cpx = tpx; cpy = tpy; }
    force += ((dedans ? 1 : 0) - force) * (1 - Math.exp(-dt * 4));
    if (force > 0.995) force = 1; else if (force < 0.005) force = 0;
    if (clicT > 0) { clicT += dt / 1.6; if (clicT >= 1) clicT = 0; }
    if (ecart > 0.028) lentes++; else lentes = Math.max(0, lentes - 1);
    if (lentes > 20 && echelle > 0.55) { echelle -= 0.15; lentes = 0; mesurer(); }
    dessiner();
  }, { lourde: true });

  /* Position dans la scène : le hero est en haut de page ; seul le décalage du défilement (connu) est retiré. */
  const pos = (e) => [e.clientX, e.clientY + window.scrollY - decalage];
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !cadre) return;
      [mx, my] = pos(e);
      if (!dedans) { sx = mx; sy = my; }
      dedans = true;
      tpx = (mx / cadre.W - 0.5) * 2; tpy = (my / cadre.H - 0.5) * 2;
    }, { passive: true });
    zone.addEventListener('pointerleave', () => { dedans = false; tpx = 0; tpy = 0; });
  }
  zone.addEventListener('pointerdown', (e) => { [clicX, clicY] = pos(e); clicT = 0.001; });
  api.defiler = (v, px = 0) => { defil = v; decalage = px; };
  api.lever = (v) => { lever = v; };
  api.qualite = () => { if (!enAttente) return; enAttente = false; lentes = 0; mesurer(); dessiner(); if (pret) canvas.classList.add('gl-pret'); };
  /* Onde partie du soleil, quand le repère s'y pose. */
  api.onde = () => {
    if (!cadre) return;
    const k = cadre;
    clicX = k.ox + (k.Ox + k.u * k.Dx - k.ox) * k.z; clicY = k.oy + (k.Oy + k.v * k.Dy - k.oy) * k.z; clicT = 0.001;
  };
  return api;
}
