/* Bande à faire glisser : défilement horizontal natif (doigt, pavé, clavier), glisser à la souris avec élan,
   flèches précédent / suivant, barre de progression (part visible de la bande) ; renvoie la vitesse pour les effets
   (inclinaison des cartes, balancement des avis). Mesures au chargement et au redimensionnement seulement. */
export function bande(piste, { precedent, suivant, barre, auVitesse, calme = () => false } = {}) {
  if (!piste) return null;
  let max = 0, pas = 300;
  const maj = () => {
    const x = piste.scrollLeft;
    if (barre) barre.style.setProperty('--progres', String(Math.min(1, (x + piste.clientWidth) / Math.max(1, piste.scrollWidth)).toFixed(3)));
    if (precedent) precedent.disabled = x <= 2;
    if (suivant) suivant.disabled = x >= max - 2;
  };
  const mesurer = () => {
    max = Math.max(0, piste.scrollWidth - piste.clientWidth);
    const a = piste.children[0], b = piste.children[1];
    pas = a && b ? b.offsetLeft - a.offsetLeft : (a ? a.offsetWidth : 300);
    maj();
  };
  mesurer();
  let attente = 0;
  window.addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(mesurer, 150); });
  window.addEventListener('load', mesurer, { once: true });

  let dernierX = piste.scrollLeft, dernierT = performance.now(), vitesse = 0;
  piste.addEventListener('scroll', () => {
    const t = performance.now(), x = piste.scrollLeft, dt = Math.max(8, t - dernierT);
    vitesse = vitesse * 0.5 + ((x - dernierX) / dt) * 1000 * 0.5;
    dernierX = x; dernierT = t;
    maj();
    if (auVitesse) auVitesse(vitesse);
  }, { passive: true });

  const aller = (sens) => piste.scrollBy({ left: sens * pas, behavior: calme() ? 'auto' : 'smooth' });
  if (precedent) precedent.addEventListener('click', () => aller(-1));
  if (suivant) suivant.addEventListener('click', () => aller(1));

  /* Souris : on attrape la bande, on la lance ; elle se cale ensuite sur la carte la plus proche. */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let tient = false, bouge = false, x0 = 0, s0 = 0, vx = 0, lx = 0, lt = 0, raf = 0;
    const caler = () => {
      const cible = Math.min(max, Math.max(0, Math.round(piste.scrollLeft / pas) * pas));
      piste.scrollTo({ left: cible, behavior: calme() ? 'auto' : 'smooth' });
      setTimeout(() => piste.classList.remove('glisse'), calme() ? 0 : 420);
    };
    piste.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      cancelAnimationFrame(raf);
      tient = true; bouge = false; x0 = lx = e.clientX; s0 = piste.scrollLeft; lt = performance.now(); vx = 0;
    });
    window.addEventListener('pointermove', (e) => {
      if (!tient) return;
      const dx = e.clientX - x0;
      if (!bouge && Math.abs(dx) > 5) { bouge = true; piste.classList.add('glisse'); }
      if (!bouge) return;
      const t = performance.now();
      vx = vx * 0.4 + ((e.clientX - lx) / Math.max(8, t - lt)) * 1000 * 0.6;
      lx = e.clientX; lt = t;
      piste.scrollLeft = s0 - dx;
    });
    const lacher = () => {
      if (!tient) return;
      tient = false;
      if (!bouge) return;
      if (calme()) { caler(); return; }
      let v = -vx, tp = performance.now();
      const elan = (t) => {
        const dt = Math.min(0.05, (t - tp) / 1000); tp = t;
        v *= Math.pow(0.03, dt);
        piste.scrollLeft += v * dt;
        if (Math.abs(v) > 60 && piste.scrollLeft > 0 && piste.scrollLeft < max) raf = requestAnimationFrame(elan); else caler();
      };
      raf = requestAnimationFrame(elan);
    };
    window.addEventListener('pointerup', lacher);
    window.addEventListener('pointercancel', lacher);
    /* Un glissé n'est pas un clic. */
    piste.addEventListener('click', (e) => { if (bouge) { e.preventDefault(); e.stopPropagation(); bouge = false; } }, true);
    piste.addEventListener('dragstart', (e) => e.preventDefault());
  }
  return { mesurer };
}
