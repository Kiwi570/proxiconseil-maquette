/* Effet « carte-courbes » : carte en courbes de niveau dessinée en WebGL, avec des ondes qui partent du repère.
   - Une image fixe (carte-courbes.webp) est dessous : sans WebGL, en mode calme ou en attendant, rien ne manque.
   - Densité de pixels limitée (1,25 sur ordinateur, 1 sur téléphone), 60 images par seconde au plus,
     résolution qui baisse d'elle-même si les images prennent trop de temps.
   - La boucle du socle ne tourne qu'à l'écran, onglet visible, jamais en mode calme.
   - Mesures au chargement et au redimensionnement seulement (jamais pendant le défilement). */
import { boucle, etat } from './socle/index.js?v=1';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec2 uPin; uniform float uOnde; uniform float uDefil;
vec2 h2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return -1.0 + 2.0 * fract(sin(p) * 43758.5453); }
float bruit(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(h2(i), f), dot(h2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(h2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(h2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
float relief(vec2 p){ float v = 0.0, a = 0.55; for (int i = 0; i < 4; i++) { v += a * bruit(p); p = p * 2.02 + vec2(3.1, 7.7); a *= 0.5; } return v; }
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 pin = (uPin - 0.5 * uRes) / uRes.y;
  float d = length(p - pin);
  vec2 q = p * 1.35 + vec2(0.0, uDefil * 0.35) + vec2(uT * 0.006, uT * 0.004);
  float h = relief(q) + 0.55 * exp(-d * d * 9.0);
  /* Ondes du repère : elles partent de la pointe et s'amortissent. */
  float r = uOnde * 1.6;
  h += 0.045 * sin(d * 34.0 - uOnde * 22.0) * exp(-abs(d - r) * 9.0) * (1.0 - smoothstep(0.6, 1.0, uOnde)) * step(0.001, uOnde);
  float n = 15.0;
  float v = h * n;
  float f = fract(v);
  #ifdef GL_OES_standard_derivatives
  float w = fwidth(v) * 1.2;
  #else
  float w = 0.06;
  #endif
  float ligne = 1.0 - smoothstep(0.0, w, min(f, 1.0 - f));
  float majeure = 1.0 - step(0.5, abs(mod(floor(v + 0.5), 5.0)));
  float a = ligne * (0.22 + 0.30 * majeure);
  /* Un halo très doux autour du Mans. */
  float halo = 0.06 * exp(-d * d * 18.0);
  vec3 fond = vec3(0.957, 0.945, 0.918);
  vec3 encre = vec3(0.0, 0.376, 0.424);
  vec3 col = mix(fond, encre, clamp(a + halo, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;

export function carteCourbes(canvas, zone, pose) {
  const api = { defiler() {}, onde() {} };
  if (etat.calme) return api;
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
  } catch (err) { console.warn('[carte] WebGL indisponible', err); return api; }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uT = U('uT'), uPin = U('uPin'), uOnde = U('uOnde'), uDefil = U('uDefil');

  let echelle = 1, w = 0, h = 0, pinX = 0, pinY = 0, defil = 0, onde = 0, ondeActive = false, temps = 0, dernier = 0;
  let lentes = 0;
  const dprMax = () => (window.matchMedia('(min-width: 761px)').matches ? 1.25 : 1);
  function mesurer() {
    const r = zone.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, dprMax()) * echelle;
    w = Math.max(2, Math.round(r.width * dpr)); h = Math.max(2, Math.round(r.height * dpr));
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    const s = getComputedStyle(pose);
    const px = parseFloat(s.getPropertyValue('--pose-x')) / 100 || 0.7;
    const py = parseFloat(s.getPropertyValue('--pose-y')) / 100 || 0.5;
    pinX = px * w; pinY = (1 - py) * h;
  }
  function dessiner() {
    gl.uniform2f(uRes, w, h); gl.uniform1f(uT, temps); gl.uniform2f(uPin, pinX, pinY);
    gl.uniform1f(uOnde, onde); gl.uniform1f(uDefil, defil);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  mesurer();
  dessiner();
  canvas.classList.add('gl-pret');
  let attente = 0;
  window.addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(() => { mesurer(); dessiner(); }, 120); });

  boucle(canvas, (dt, t) => {
    /* 60 images par seconde au plus, même sur un écran à 120 Hz. */
    if (t - dernier < 0.0155) return;
    const ecart = dernier ? t - dernier : 1 / 60;
    dernier = t;
    temps += Math.min(dt * 2, 0.05);
    if (ondeActive) { onde += dt / 2.2; if (onde >= 1) { onde = 0; ondeActive = false; } }
    /* Qualité qui baisse d'elle-même si les images prennent trop de temps. */
    if (ecart > 0.028) lentes++; else lentes = Math.max(0, lentes - 1);
    if (lentes > 20 && echelle > 0.55) { echelle -= 0.15; lentes = 0; mesurer(); }
    dessiner();
  }, { lourde: true });

  api.defiler = (v) => { defil = v; };
  api.onde = () => { onde = 0.001; ondeActive = true; };
  return api;
}
