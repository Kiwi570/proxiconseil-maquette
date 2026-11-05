/* Ondes au clic, sur tout le site : chaque clic lâche, au point cliqué, deux ondes aplaties comme l'ombre du repère.
   Claires sur les sections sombres, pétrole ailleurs. Le curseur (socle) prend la même teinte et se pose au clic.
   Rien en mode calme ; le calque est fixe, transparent aux clics et ignoré par l'audit. */
import { etat } from './socle/index.js?v=6';

const SOMBRES = '.hero, .deroule, .appel, .acc-tete, .qsj-tete, .imm-tete, .feuillets, .charte, .fin-page--nuit, .rdv-recap, .pied, [data-menu], [data-voile]';

export function ondesAuClic() {
  const gsap = window.gsap;
  if (!gsap) return;
  const calque = document.createElement('div');
  calque.className = 'ondes-clic';
  calque.setAttribute('aria-hidden', 'true');
  calque.setAttribute('data-audit-ignorer', '');
  document.body.appendChild(calque);
  const racine = document.documentElement;
  const sombre = (el) => !!(el && el.closest && (el.closest(SOMBRES) || (el.closest('[data-entete]') && (racine.classList.contains('entete-sur-hero') || racine.classList.contains('menu-ouvert')))));

  window.addEventListener('pointerdown', (e) => {
    if (etat.calme || e.button > 0) return;
    const clair = sombre(e.target);
    for (let i = 0; i < 2; i++) {
      const o = document.createElement('span');
      o.className = clair ? 'onde-clic onde-clic--clair' : 'onde-clic';
      o.style.left = `${e.clientX}px`;
      o.style.top = `${e.clientY}px`;
      calque.appendChild(o);
      gsap.fromTo(o, { scale: 0.2, opacity: 0.95 }, { scale: 1.5 + i * 0.9, opacity: 0, duration: 0.85 + i * 0.3, delay: i * 0.09, ease: 'power2.out', onComplete: () => o.remove() });
    }
    const c = document.querySelector('.curseur');
    if (c) { c.classList.remove('curseur-pose'); void c.offsetWidth; c.classList.add('curseur-pose'); }
  }, { passive: true });

  /* Teinte du curseur selon la section survolée (souris seulement). */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const c = document.querySelector('.curseur');
      if (!c) return;
      c.classList.toggle('curseur--clair', sombre(e.target));
      /* Libellé près du curseur sur les zones qui en demandent un (bande à faire glisser). */
      const z = e.target.closest && e.target.closest('[data-curseur-libelle]');
      const libelle = z ? z.dataset.curseurLibelle : '';
      if ((c.dataset.libelle || '') !== libelle) c.dataset.libelle = libelle;
    }, { passive: true });
  }
}
