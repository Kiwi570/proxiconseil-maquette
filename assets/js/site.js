/* Proxiconseil Patrimoine · effets propres (direction « Le repère »).
   Le socle gère l'ouverture, le voile, l'en-tête, le menu, le mode calme, les boucles, les mesures
   et la bibliothèque d'effets (data-anime, data-fx, data-survol). Ici : l'intro du repère, et les effets
   propres de chaque page, chacun marqué data-effet="nom" (liste dans _audit/config.json). */
import { demarrer, boucle, etat, quand } from './socle/index.js?v=2';
import { horizonVivant } from './horizon.js?v=2';
import { pagesInterieures } from './pages.js?v=2';
import { ondesAuClic } from './ondes.js?v=2';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const page = document.querySelector('main')?.dataset.page || '';
const ordi = () => window.matchMedia('(min-width: 761px)').matches;
const actif = () => !etat.calme && gsap && ST;

/* Vitesse du défilement, relevée sans lecture de mise en page (pour les avis suspendus). */
let vitesse = 0, dernierY = window.scrollY, dernierT = performance.now();
window.addEventListener('scroll', () => {
  const t = performance.now(), y = window.scrollY;
  const dt = Math.max(8, t - dernierT);
  vitesse = vitesse * 0.6 + ((y - dernierY) / dt) * 1000 * 0.4;
  dernierY = y; dernierT = t;
}, { passive: true });

/* ---------- Intro commune : le repère tombe sur son anneau, trois ondes, la dernière ouvre la page ---------- */
function intro(tl) {
  const panneau = $('.ouverture-panneau');
  const scene = $('.ouverture-scene');
  if (!panneau || !scene) return 1.3;
  /* Centre du trou : la pointe du repère (mesuré une fois, avant que rien ne bouge). */
  const r = scene.getBoundingClientRect();
  panneau.style.setProperty('--trou-y', `${Math.round(r.top + r.height * 0.92)}px`);
  const corps = $('.ouverture-repere .repere-corps');
  const ombre = $('.ouverture-repere .repere-ombre');
  const ondes = $$('.ouverture-onde');
  const maxi = Math.hypot(window.innerWidth, window.innerHeight);
  tl.fromTo(corps, { y: -70, scaleX: 1, scaleY: 1 }, { y: 0, duration: 0.42, ease: 'power2.in' }, 0)
    .fromTo(ombre, { scaleX: 0.45, scaleY: 0.45, opacity: 0.35 }, { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.42, ease: 'power2.in' }, 0)
    .to(corps, { scaleY: 0.93, scaleX: 1.04, duration: 0.09, ease: 'power1.out' }, 0.42)
    .to(corps, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }, 0.51)
    .fromTo(ondes, { scale: 0.6, opacity: 0.9 }, { scale: 4.2, opacity: 0, duration: 1.1, stagger: 0.16, ease: 'power2.out' }, 0.44)
    .fromTo('.ouverture-nom', { y: 14, opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out' }, 0.36)
    .call(() => panneau.classList.add('ouverture-trou'), null, 1.03)
    .fromTo(panneau, { '--trou': '0px' }, { '--trou': `${Math.ceil(maxi)}px`, duration: 0.8, ease: 'power3.in' }, 1.05);
  return 1.3; /* moment où la page apparaît sous le panneau */
}

/* ---------- Accueil ---------- */
const accueil = {
  preparer() {
    /* Lever de soleil (WebGL) sur son image ; le repère est posé sur le soleil quel que soit le cadrage. */
    const hero = $('.hero');
    this.horizon = horizonVivant($('.hero-scene'), hero);
    this.soleil = { v: 0 };
    quand('pret', () => this.horizon.qualite(1));

    /* En-tête nuit pétrole tant qu'il est posé sur le hero. Simple écoute du défilement (pas de ScrollTrigger :
       en mode calme, ScrollTrigger est arrêté s'il n'a rien à suivre). Mesure au chargement et au redimensionnement. */
    if (hero) {
      let limite = 0;
      const mesurer = () => { limite = hero.offsetHeight - ($('[data-entete]')?.offsetHeight || 64); };
      const poser = () => document.documentElement.classList.toggle('entete-sur-hero', window.scrollY < limite);
      mesurer(); poser();
      window.addEventListener('resize', () => { mesurer(); poser(); });
      window.addEventListener('scroll', poser, { passive: true });
    }
    if (!actif()) { this.horizon.lever(1); return; }

    /* Au défilement : travelling vers le soleil dans l'image (le texte reste sur son voile). */
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: (s) => this.horizon.defiler(s.progress) } })
      .fromTo('.hero-defiler', { autoAlpha: 1 }, { autoAlpha: 0, ease: 'none', duration: 0.25 }, 0)
      .set({}, {}, 1);

    /* Raisons : les mots s'allument au fil de la lecture. */
    $$('.manifeste').forEach((p) => {
      if (!window.SplitText) return;
      const d = new window.SplitText(p, { type: 'words', wordsClass: 'mm' });
      gsap.fromTo(d.words, { color: '#4f6569', backgroundSize: '0% 100%' }, { color: '#0e2a30', backgroundSize: '100% 100%', stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 50%', scrub: true } });
    });

    /* Six objectifs : section épinglée, un anneau et une image par pas de défilement. */
    const section = $('[data-objectifs]');
    const anneaux = $$('.objectifs .anneau');
    const cartes = $$('.objectifs .objectif');
    const allumer = (i) => anneaux.forEach((a, k) => { a.classList.toggle('actif', k === i); a.classList.toggle('vu', k < i); });
    allumer(0);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: `+=${cartes.length * 70}%`, pin: true, scrub: 0.6, refreshPriority: 10,
        invalidateOnRefresh: true, snap: { snapTo: 1 / (cartes.length - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut' } },
        onUpdate: () => allumer(Math.min(cartes.length - 1, Math.round(tl.progress() * (cartes.length - 1)))) });
      tl.fromTo('.objectifs .anneaux-deco', { rotate: 0 }, { rotate: 120, ease: 'none', duration: cartes.length - 1, transformOrigin: '50% 50%' }, 0)
        .fromTo('.objectifs .anneaux-repere', { y: 0 }, { y: -8, ease: 'sine.inOut', duration: (cartes.length - 1) / 2, yoyo: true, repeat: 1 }, 0);
      cartes.slice(1).forEach((c, k) => {
        tl.fromTo(c, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, k)
          .fromTo($('img', c), { scale: 1.18 }, { scale: 1, ease: 'power2.out', duration: 1 }, k);
      });
      return () => allumer(0);
    });
    mm.add('(max-width: 760px)', () => {
      ST.create({ trigger: '.objectifs-schema', start: 'top 80%', end: 'bottom 30%', scrub: true,
        onUpdate: (s) => allumer(Math.min(anneaux.length - 1, Math.floor(s.progress * anneaux.length))) });
      gsap.fromTo('.objectifs .anneaux-deco', { rotate: -60 }, { rotate: 60, ease: 'none', transformOrigin: '50% 50%',
        scrollTrigger: { trigger: '.objectifs-schema', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Déroulé : l'itinéraire se trace, chaque repère se pose quand le chemin l'atteint. */
    const chemin = $('.itineraire-chemin');
    if (chemin) {
      const L = chemin.getTotalLength();
      gsap.fromTo(chemin, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: '.itineraire', start: 'top 70%', end: 'bottom 65%', scrub: true } });
      $$('.etape').forEach((e) => {
        gsap.fromTo($('.etape-pin', e), { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(2.4)',
          scrollTrigger: { trigger: e, start: 'top 72%', once: true } });
        gsap.fromTo($('.etape-carte', e), { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: e, start: 'top 74%', once: true } });
      });
    }

    /* Citation : « On subit l'avenir » se fait barrer, puis la vraie phrase s'écrit (une fois). */
    const fig = $('.citation-texte');
    if (fig && window.SplitText) {
      const mots = new window.SplitText($('.citation-vrai p'), { type: 'words' }).words;
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.citation-rature path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
        .to('.citation-faux', { opacity: 0.45, duration: 0.4 }, '>-0.1')
        .set('.citation-vrai', { opacity: 1 }, '<')
        .fromTo(mots, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, '<')
        .fromTo('.citation-auteur', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '>-0.2');
      ST.create({ trigger: fig, start: 'top 68%', once: true, onEnter: () => tl.play() });
    }

    /* Avis : les cartes suspendues à leur repère se balancent selon la vitesse du défilement, puis se posent. */
    const liste = $('.avis-liste');
    if (liste) {
      const cartesAvis = $$('.avis-carte', liste).map((el, i) => ({ el, a: 0, v: 0, sens: i % 2 ? 1 : -1, poids: 0.7 + (i % 3) * 0.2 }));
      boucle(liste, (dt) => {
        const cible = Math.max(-3.5, Math.min(3.5, vitesse * 0.004));
        vitesse *= Math.pow(0.02, dt);
        cartesAvis.forEach((c) => {
          const f = (cible * c.sens * c.poids - c.a) * 38 - c.v * 7;
          c.v += f * dt; c.a += c.v * dt;
          if (Math.abs(c.a) < 0.01 && Math.abs(c.v) < 0.01) { c.a = 0; c.v = 0; }
          c.el.style.transform = `rotate(${c.a.toFixed(3)}deg)`;
        });
      });
    }

    /* Appel : les ondes du repère s'élargissent au défilement. */
    gsap.timeline({ scrollTrigger: { trigger: '.appel', start: 'top bottom', end: 'bottom top', scrub: true } })
      .fromTo('.appel-ondes span', { scale: 0.1, opacity: 0 }, { scale: 1.6, opacity: 0.85, stagger: 0.12, ease: 'none', duration: 0.5 }, 0)
      .to('.appel-ondes span', { opacity: 0, stagger: 0.12, ease: 'none', duration: 0.4 }, 0.45);

    /* La section épinglée des objectifs est créée après la galerie de la bibliothèque : on remet les déclencheurs
       dans l'ordre de la page, sinon la galerie s'épinglerait trop tôt. */
    ST.sort();
    ST.refresh();
  },

  /* Partie de l'accueil dans l'intro : le paysage se pose, le titre monte, le repère tombe sur le soleil qui se lève. */
  entree(tl, t0) {
    /* Le paysage se pose sur sa propre durée (hors de l'intro : un clic qui l'accélère ne le brusque pas). */
    tl.set('.hero-scene', { scale: 1.14 }, 0)
      .call(() => { if (!etat.calme) gsap.to('.hero-scene', { scale: 1, duration: 2.6, ease: 'expo.out' }); else gsap.set('.hero-scene', { scale: 1 }); }, null, Math.max(0, t0 - 0.5));
    tl.fromTo('.hero-ligne', { yPercent: 135, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, t0 - 0.1)
      .fromTo('.hero .surtitre, .hero-intro, .hero-actions, .hero-defiler', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, t0 + 0.1);
    this.chute(tl, t0 + 0.1);
  },
  chute(tl, t0) {
    const corps = $('.hero-repere .repere-corps'), ombre = $('.hero-repere .repere-ombre');
    if (!corps) return;
    const soleil = this.soleil;
    tl.fromTo(corps, { y: -window.innerHeight * 0.55, scaleY: 1.12, scaleX: 0.94 }, { y: 0, scaleY: 1, scaleX: 1, duration: 0.55, ease: 'power3.in' }, t0 - 0.35)
      .fromTo(ombre, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.in' }, t0 - 0.35)
      .to(corps, { scaleY: 0.92, scaleX: 1.05, duration: 0.08 }, t0 + 0.2)
      .to(corps, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, t0 + 0.28)
      .call(() => {
        if (etat.calme) return;
        gsap.fromTo('.hero-onde', { scale: 0.4, opacity: 0.95 }, { scale: 6, opacity: 0, duration: 1.6, stagger: 0.22, ease: 'power2.out' });
        this.horizon.onde();
        gsap.fromTo(soleil, { v: 0 }, { v: 1, duration: 1.8, ease: 'power2.out', onUpdate: () => this.horizon.lever(soleil.v) });
      }, null, t0 + 0.2);
  },
  arrivee() {
    const tl = gsap.timeline({ delay: 0.15 });
    this.entree(tl, 0.35);
  },
  etatFinal() {
    gsap.set('.hero-scene', { scale: 1 });
    gsap.set('.hero-ligne, .hero .surtitre, .hero-intro, .hero-actions, .hero-defiler', { clearProps: 'transform,opacity' });
    gsap.set('.hero-repere .repere-corps, .hero-repere .repere-ombre', { clearProps: 'transform,opacity' });
    this.soleil.v = 1; this.horizon && this.horizon.lever(1);
    gsap.set('.citation-vrai, .citation-auteur', { opacity: 1 });
    gsap.set('.citation-rature path', { strokeDashoffset: 0 });
  },
};

const pages = { accueil, ...pagesInterieures({ gsap, ST, $, $$, boucle, etat, actif, ordi }) };
const courante = pages[page] || {};

demarrer({
  preparer() { try { courante.preparer && courante.preparer(); } catch (err) { console.error('[site] preparer', err); } },
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const t0 = intro(tl);
    try { courante.entree && courante.entree(tl, t0); } catch (err) { console.error('[site] entree', err); }
    return tl;
  },
  etatFinal() {
    if (!gsap) return;
    gsap.set('.ouverture-panneau', { clearProps: '--trou' });
    document.querySelector('.ouverture-panneau')?.classList.remove('ouverture-trou');
    try { courante.etatFinal && courante.etatFinal(); } catch (err) { console.error('[site] etatFinal', err); }
  },
  arrivee() { if (gsap && !etat.calme) try { courante.arrivee && courante.arrivee(); } catch (err) { console.error('[site] arrivee', err); } },
  pret: [courante.pret ? courante.pret() : null].filter(Boolean),
});

quand('retour', () => courante.etatFinal && courante.etatFinal());
ondesAuClic();
