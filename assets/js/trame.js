/* Effet « portrait-trame » : le portrait naît d'une trame d'impression (points d'encre pétrole sur papier sable),
   puis la photo nette apparaît ; au défilement, la trame revient en partie.
   - Dessin à la demande (seulement quand le mélange change), jamais de boucle permanente.
   - La photo d'origine reste dessous : sans WebGL, en mode calme ou en cas d'erreur, elle s'affiche seule.
   - Calage identique à l'image : object-fit cover et object-position du cadrage. */
const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FRAG = `precision highp float;
uniform sampler2D uTex; uniform vec2 uRes; uniform vec2 uImg; uniform vec2 uPos; uniform float uMix; uniform float uCell;
vec2 couvre(vec2 uv){ float ra = uRes.x / uRes.y, ri = uImg.x / uImg.y; vec2 s = ra > ri ? vec2(1.0, ri / ra) : vec2(ra / ri, 1.0); return (1.0 - s) * uPos + uv * s; }
void main(){
  vec2 px = gl_FragCoord.xy;
  vec2 uv = vec2(px.x / uRes.x, 1.0 - px.y / uRes.y);
  vec3 photo = texture2D(uTex, couvre(uv)).rgb;
  mat2 r = mat2(0.7071, 0.7071, -0.7071, 0.7071);
  mat2 ri = mat2(0.7071, -0.7071, 0.7071, 0.7071);
  vec2 g = r * px;
  vec2 cg = (floor(g / uCell) + 0.5) * uCell;
  vec2 c = ri * cg;
  vec2 uvc = vec2(c.x / uRes.x, 1.0 - c.y / uRes.y);
  float lum = dot(texture2D(uTex, couvre(clamp(uvc, 0.0, 1.0))).rgb, vec3(0.299, 0.587, 0.114));
  float rayon = (1.0 - lum) * uCell * 0.66;
  float d = length(g - cg);
  float pt = 1.0 - smoothstep(rayon - 0.9, rayon + 0.9, d);
  vec3 trame = mix(vec3(0.91, 0.882, 0.827), vec3(0.055, 0.165, 0.188), pt);
  gl_FragColor = vec4(mix(trame, photo, uMix), 1.0);
}`;

export function trameApi(canvas, img, zone) {
  const api = { etat: { m: 0 }, melange() {}, pret: Promise.resolve() };
  let gl = null;
  try { gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false }); } catch {}
  if (!gl) return api;
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('lien');
  } catch (err) { console.warn('[trame] WebGL indisponible', err); return api; }
  gl.useProgram(prog);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const l = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const tex = gl.createTexture();
  let pret = false, w = 0, h = 0, m = 0, pos = [0.5, 0.3];

  function mesurer() {
    const r = zone.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, window.matchMedia('(min-width: 761px)').matches ? 1.25 : 1);
    w = Math.max(2, Math.round(r.width * dpr)); h = Math.max(2, Math.round(r.height * dpr));
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    const p = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    if (p.length === 2 && p.every((v) => !Number.isNaN(v))) pos = p;
  }
  function dessiner() {
    if (!pret) return;
    gl.uniform2f(U('uRes'), w, h); gl.uniform2f(U('uImg'), img.naturalWidth, img.naturalHeight);
    gl.uniform2f(U('uPos'), pos[0], pos[1]); gl.uniform1f(U('uMix'), m);
    gl.uniform1f(U('uCell'), Math.max(5, Math.round(w / 110)));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  api.pret = (img.decode ? img.decode() : Promise.resolve()).then(() => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    pret = true; mesurer(); dessiner(); canvas.classList.add('gl-pret');
  }).catch((err) => console.warn('[trame] image', err));
  let attente = 0;
  window.addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(() => { mesurer(); dessiner(); }, 120); });
  api.melange = (v) => { m = Math.max(0, Math.min(1, v)); api.etat.m = m; dessiner(); };
  return api;
}
