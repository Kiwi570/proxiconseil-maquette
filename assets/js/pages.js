/* Effets propres des pages intérieures (accompagnement, qui suis-je, immobilier, contact, 404).
   Chaque page : preparer() (déclencheurs au défilement, états de départ), entree(tl, t0) (sa part de l'intro),
   arrivee() (après le voile), etatFinal() (retour, calme, secours). Chaque effet porte data-effet="nom". */
import { carteCourbes } from './carte.js?v=6';

export function pagesInterieures({ gsap, ST, $, $$, boucle, etat, actif }) {
  /* En-tête nuit pétrole tant qu'il est posé sur une ouverture sombre [data-entete-nuit] (épinglage compris).
     Simple écoute du défilement ; mesure au chargement, au redimensionnement et après chaque recalcul des épinglages. */
  const enteteNuit = () => {
    const s = $('[data-entete-nuit]');
    if (!s) return;
    let limite = 0;
    const mesurer = () => {
      const bloc = s.parentElement && s.parentElement.classList.contains('pin-spacer') ? s.parentElement : s;
      limite = bloc.offsetTop + bloc.offsetHeight - ($('[data-entete]')?.offsetHeight || 64);
    };
    const poser = () => document.documentElement.classList.toggle('entete-sur-hero', window.scrollY < limite);
    mesurer(); poser();
    window.addEventListener('resize', () => { mesurer(); poser(); });
    window.addEventListener('scroll', poser, { passive: true });
    if (ST) ST.addEventListener('refresh', () => { mesurer(); poser(); });
  };
  /* Ondes du repère en fin de page, au défilement. */
  const ondesFin = () => {
    if (!$('.fin-page-repere')) return;
    gsap.timeline({ scrollTrigger: { trigger: '.fin-page', start: 'top bottom', end: 'bottom top', scrub: true } })
      .fromTo('.fin-page-repere span', { scale: 0.3, opacity: 0 }, { scale: 2.2, opacity: 0.8, stagger: 0.15, ease: 'none', duration: 0.5 }, 0)
      .to('.fin-page-repere span', { opacity: 0, stagger: 0.15, ease: 'none', duration: 0.35 }, 0.5)
      .fromTo('.fin-page-repere .fin-repere', { yPercent: -40 }, { yPercent: 0, ease: 'none', duration: 0.9 }, 0);
  };
  /* Mots qui s'allument à la lecture. */
  const manifeste = () => $$('.manifeste').forEach((p) => {
    if (!window.SplitText) return;
    const d = new window.SplitText(p, { type: 'words', wordsClass: 'mm' });
    gsap.fromTo(d.words, { color: '#4f6569', backgroundSize: '0% 100%' }, { color: '#0e2a30', backgroundSize: '100% 100%', stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 85%', end: 'bottom 50%', scrub: true } });
  });
  /* Lignes du titre et textes du premier écran. */
  const premierEcran = (tl, t0, lignes, autres) => {
    tl.fromTo(lignes, { yPercent: 135, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' }, t0 - 0.15)
      .fromTo(autres, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, t0 + 0.05);
  };
  const remettre = (sel) => gsap.set(sel, { clearProps: 'transform,opacity' });
  const arriver = (page) => () => { const tl = gsap.timeline({ delay: 0.15 }); page.entree(tl, 0.35); };

  /* ---------- Mon accompagnement ---------- */
  const accompagnement = {
    preparer() {
      enteteNuit();
      this.volets();
      this.boussole();
      if (!actif()) return;
      /* Au défilement, les images glissent dans leurs volets, chacune à sa vitesse, une sur deux en sens inverse
         (les volets et leurs noms restent en place). */
      const decalages = [-5, 4, -3, 5, -4, 3];
      gsap.fromTo('.volet-media img', { yPercent: 0 }, { yPercent: (i) => decalages[i % 6], ease: 'none',
        scrollTrigger: { trigger: '.acc-tete', start: 'top top', end: 'bottom top', scrub: true } });
      const planches = $$('.planche');
      const mm = gsap.matchMedia();
      mm.add('(min-width: 761px)', () => {
        planches.slice(0, -1).forEach((p, i) => {
          gsap.timeline({ scrollTrigger: { trigger: planches[i + 1], start: 'top 92%', end: 'top 30%', scrub: true } })
            .fromTo(p, { scale: 1 }, { scale: 0.94, ease: 'none' }, 0)
            .fromTo($('.planche-voile', p), { opacity: 0 }, { opacity: 0.32, ease: 'none' }, 0);
        });
        gsap.fromTo(planches.at(-1), { scale: 0.96 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: planches.at(-1), start: 'top bottom', end: 'top 40%', scrub: true } });
      });
      mm.add('(max-width: 760px)', () => {
        planches.forEach((p) => gsap.fromTo($('img', p), { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom 40%', scrub: true } }));
      });
      /* Feuillets : le paquet se distribue une fois, à l'arrivée ; ensuite ils restent étalés. */
      mm.add('(min-width: 1001px)', () => {
        const donne = gsap.fromTo('.feuillet', { xPercent: (i) => (1.5 - i) * 104, rotate: (i) => (i - 1.5) * 7, y: (i) => Math.abs(i - 1.5) * 12 },
          { xPercent: 0, rotate: 0, y: 0, ease: 'power3.out', duration: 1, stagger: 0.08, paused: true });
        ST.create({ trigger: '.feuillets-liste', start: 'top 72%', once: true, onEnter: () => donne.play() });
      });
      mm.add('(max-width: 1000px)', () => {
        const donne = gsap.fromTo('.feuillet', { y: 50, rotate: (i) => (i % 2 ? 3 : -3), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, ease: 'power3.out', duration: 0.8, stagger: 0.12, paused: true });
        ST.create({ trigger: '.feuillets-liste', start: 'top 80%', once: true, onEnter: () => donne.play() });
      });
      gsap.fromTo('.feuillet-lignes', { scaleX: 0.3 }, { scaleX: 1, transformOrigin: '0 50%', ease: 'none', scrollTrigger: { trigger: '.feuillets', start: 'top bottom', end: 'bottom 40%', scrub: true } });
      const tampon = gsap.fromTo('.tampon', { scale: 1.7, rotate: -34, opacity: 0 }, { scale: 1, rotate: -12, opacity: 1, duration: 0.55, ease: 'back.out(2)', paused: true });
      ST.create({ trigger: '.tampon', start: 'top 80%', once: true, onEnter: () => tampon.play() });
      gsap.fromTo('.tampon svg', { rotate: -8 }, { rotate: 8, ease: 'none', scrollTrigger: { trigger: '.statuts', start: 'top bottom', end: 'bottom top', scrub: true } });
      ondesFin();
      ST.sort(); ST.refresh();
    },
    /* Volets : survol (souris), focus (clavier) ou toucher choisit le volet ; sans geste, le suivant s'ouvre toutes
       les 4,5 s tant que l'ouverture est à l'écran. Au toucher, un volet fermé s'ouvre d'abord ; ouvert, il mène
       à sa fiche plus bas. Rien ne défile seul en mode calme. */
    volets() {
      const zone = $('.volets');
      if (!zone) return;
      const volets = $$('.volet', zone);
      let n = 0, survol = false, visible = true, minuteur = 0;
      const choisir = (k) => { n = k; volets.forEach((v, j) => v.classList.toggle('actif', j === k)); };
      const relancer = () => {
        clearTimeout(minuteur);
        if (etat.calme) return;
        minuteur = setTimeout(() => { if (!survol && visible && !document.hidden) choisir((n + 1) % volets.length); relancer(); }, 4500);
      };
      volets.forEach((v, k) => {
        v.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { survol = true; choisir(k); } });
        v.addEventListener('focus', () => { choisir(k); relancer(); });
        v.addEventListener('click', (e) => { if (!v.classList.contains('actif')) { e.preventDefault(); choisir(k); relancer(); } });
      });
      /* La souris dans l'ouverture (volets, titre ou bouton) arrête le défilement automatique. */
      const tete = zone.closest('.acc-tete') || zone;
      tete.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') survol = true; }, { passive: true });
      tete.addEventListener('pointerleave', () => { survol = false; relancer(); });
      /* Sécurité : un volet que l'ouverture n'a pas fait monter ne reste pas caché. */
      setTimeout(() => volets.forEach((v) => { if (!v.style.opacity) v.classList.add('vu'); }), 3500);
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(zone);
      relancer();
    },
    /* Boussole : la situation choisie allume ses objectifs et prépare le lien vers le formulaire. */
    boussole() {
      const zone = $('[data-boussole]');
      if (!zone) return;
      const noms = JSON.parse($('[data-boussole-json]', zone)?.textContent || '{}');
      const lien = $('[data-boussole-lien]', zone);
      const appliquer = () => {
        const r = $('input[name="situation"]:checked', zone);
        if (!r) return;
        const cles = r.dataset.objectifs.split(' ');
        $$('.anneaux--boussole .anneau', zone).forEach((a) => a.classList.toggle('allume', cles.includes(a.dataset.cle)));
        $('[data-boussole-noms]', zone).textContent = cles.map((k) => noms[k]).join(', ');
        if (lien) { const u = new URL(lien.href, location.href); u.searchParams.set('sujet', cles[0]); lien.href = u.pathname + u.search + u.hash; }
        if (actif()) gsap.fromTo('.anneaux--boussole .anneau.allume .anneau-cercle', { scale: 0.94 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', transformOrigin: '50% 50%' });
      };
      zone.addEventListener('change', appliquer);
      appliquer();
    },
    entree(tl, t0) {
      /* Les six volets montent un à un depuis le bas, leurs images se posent, puis les noms apparaissent. */
      tl.fromTo('.volet', { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 }, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.05, stagger: 0.07, ease: 'power4.out' }, t0 - 0.5)
        .fromTo('.volet-media img', { scale: 1.28 }, { scale: 1, duration: 1.5, stagger: 0.07, ease: 'power3.out' }, t0 - 0.5)
        .fromTo('.volet-texte', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 }, t0 + 0.25);
      premierEcran(tl, t0 + 0.1, '.acc-ligne', '.acc-tete .surtitre, .acc-intro, .acc-actions');
    },
    etatFinal() { remettre('.acc-ligne, .acc-tete .surtitre, .acc-intro, .acc-actions, .volet, .volet-media img, .volet-texte, .tampon, .feuillet'); gsap.set('.volet', { clearProps: 'clipPath' }); },
  };
  accompagnement.arrivee = arriver(accompagnement);

  /* ---------- Qui suis-je ---------- */
  /* Fenêtre en forme de repère : masque, photo et contour posés en pixels. o = ouverture (0 fermée, 1 ouverte),
     p = défilement (0 fenêtre à droite, 1 portrait plein écran). Mesures au chargement et au redimensionnement. */
  const fenetreRepere = () => {
    const zone = $('.qsj-tete'), fen = $('.qsj-fenetre'), img = $('.qsj-photo'), contour = $('.qsj-contour');
    if (!zone || !fen || !img) return null;
    const R = 1600 / 1508, FX = 0.52, FY = 0.3, TETE = 62.5 / 128, HAUT = 181 / 128, TOTAL = 236 / 128;
    const etatF = { o: 1, p: 0 };
    let g = null;
    const lisse = (x) => x * x * (3 - 2 * x);
    const mesurer = () => {
      const vw = document.documentElement.clientWidth, vh = window.innerHeight;
      const eh = $('[data-entete]')?.offsetHeight || 64;
      const s = zone.getBoundingClientRect();
      let W0, cx0, top0;
      if (vw <= 760) {
        const haut = $('.qsj-haut').getBoundingClientRect().bottom - s.top, bas = $('.qsj-bas').getBoundingClientRect().top - s.top;
        top0 = haut + 14;
        W0 = Math.max(150, Math.min(bas + 28 - top0, vw * 1.2)) / HAUT;
        cx0 = vw / 2;
      } else {
        const gouttiere = Math.max(24, (vw - 1280) / 2);
        W0 = Math.min(vh - eh - 56, 860) / TOTAL;
        top0 = eh + (vh - eh - TOTAL * W0) / 2;
        cx0 = Math.min(vw * 0.69, vw - gouttiere - W0 / 2);
      }
      const cy0 = top0 + TETE * W0;
      /* Fin (ordinateur) : la fenêtre couvre l'écran, le portrait se cale à droite, à hauteur d'écran, son bord
         gauche fondu dans la nuit ; le texte reste sur le fond sombre à gauche. */
      const cxf = vw * 0.68, cyf = vh * 0.42;
      const Wf = 1.08 * Math.hypot(Math.max(cxf, vw - cxf), Math.max(cyf, vh - cyf)) / TETE;
      const Wi0 = W0 * 1.7, Wif = Math.max(vh * R, vw * 0.6);
      const borne = (v, a, b) => Math.min(b, Math.max(a, v));
      g = { W0, cx0, cy0, Wf, cxf, cyf, Wi0, Wif,
        xi0: cx0 - FX * Wi0, yi0: cy0 - FY * Wi0 / R,
        xif: Math.min(cxf - FX * Wif, vw - Wif), yif: borne(cyf - FY * Wif / R, vh - Wif / R, 0) };
      img.style.translate = 'none'; img.style.width = `${Wif}px`;
      if (contour) { contour.style.translate = 'none'; contour.style.width = `${W0}px`; }
      maj();
    };
    const maj = () => {
      if (!g) return;
      const e = lisse(Math.min(1, Math.max(0, etatF.p))), o = etatF.o;
      const W = (g.W0 + (g.Wf - g.W0) * e) * (0.04 + 0.96 * o);
      const cx = g.cx0 + (g.cxf - g.cx0) * e, cy = g.cy0 + (g.cyf - g.cy0) * e;
      const taille = `${W.toFixed(1)}px ${(W * HAUT).toFixed(1)}px`, pos = `${(cx - W / 2).toFixed(1)}px ${(cy - TETE * W).toFixed(1)}px`;
      fen.style.webkitMaskSize = taille; fen.style.maskSize = taille;
      fen.style.webkitMaskPosition = pos; fen.style.maskPosition = pos;
      /* La photo suit la fenêtre, avec un léger zoom qui se pose à l'ouverture. */
      const z = 1 + 0.14 * (1 - o);
      const Wi = (g.Wi0 + (g.Wif - g.Wi0) * e) * z;
      const xi = cx - (cx - (g.xi0 + (g.xif - g.xi0) * e)) * z, yi = cy - (cy - (g.yi0 + (g.yif - g.yi0) * e)) * z;
      img.style.transform = `translate(${xi.toFixed(1)}px, ${yi.toFixed(1)}px) scale(${(Wi / g.Wif).toFixed(4)})`;
      if (contour) {
        contour.style.transform = `translate(${(cx - W / 2).toFixed(1)}px, ${(cy - TETE * W).toFixed(1)}px) scale(${(W / g.W0).toFixed(4)})`;
        contour.style.opacity = String(Math.max(0, 1 - e * 5).toFixed(3));
      }
    };
    let attente = 0;
    window.addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(mesurer, 120); });
    if (ST) ST.addEventListener('refresh', mesurer);
    mesurer();
    return { etat: etatF, maj, mesurer };
  };

  const quiSuisJe = {
    preparer() {
      enteteNuit();
      const f = this.fenetre = fenetreRepere();
      if (!actif()) return;
      /* Fermée jusqu'à l'ouverture de la page (sauf au retour arrière, où tout est déjà en place). */
      if (f && etat.arrivee !== 'retour') { f.etat.o = 0; f.maj(); }
      manifeste();
      /* Ordinateur : la section se fixe et, au défilement, la fenêtre grandit jusqu'à montrer le portrait plein écran.
         Téléphone : le texte occupe le bas de l'écran, la fenêtre garde sa taille et monte un peu plus vite que la page. */
      if (f) gsap.matchMedia().add({ ordi: '(min-width: 761px)', tel: '(max-width: 760px)' }, (ctx) => {
        if (ctx.conditions.ordi) {
          gsap.fromTo(f.etat, { p: 0 }, { p: 1, ease: 'none', onUpdate: f.maj,
            scrollTrigger: { trigger: '.qsj-tete', start: 'top top', end: '+=100%', pin: true, anticipatePin: 1, scrub: 0.5, invalidateOnRefresh: true } });
        } else {
          f.etat.p = 0; f.maj();
          gsap.fromTo('.qsj-fenetre, .qsj-contour', { y: 0 }, { y: () => -window.innerHeight * 0.14, ease: 'none',
            scrollTrigger: { trigger: '.qsj-tete', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        }
      });
      gsap.fromTo('.sceau-tour', { rotate: 0 }, { rotate: 200, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: '.charte', start: 'top bottom', end: 'bottom top', scrub: true } });
      const presse = gsap.fromTo('.sceau', { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.2)', paused: true });
      ST.create({ trigger: '.sceau', start: 'top 78%', once: true, onEnter: () => presse.play() });
      ondesFin();
      ST.sort(); ST.refresh();
    },
    entree(tl, t0) {
      premierEcran(tl, t0, '.qsj-ligne', '.qsj-tete .surtitre, .qsj-role, .qsj-intro, .qsj-actions');
      const f = this.fenetre;
      if (!f) return;
      /* La fenêtre s'ouvre depuis le centre de la tête, le contour de laiton se trace, l'ombre se pose. */
      tl.fromTo(f.etat, { o: 0 }, { o: 1, duration: 1.4, ease: 'expo.out', onUpdate: f.maj }, t0 - 0.5)
        .fromTo('.qsj-contour path', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, t0 - 0.3)
        .fromTo('.qsj-contour ellipse', { scale: 0.2, opacity: 0, svgOrigin: '64 217.5' }, { scale: 1, opacity: 0.7, duration: 0.9, ease: 'power3.out' }, t0);
    },
    etatFinal() {
      remettre('.qsj-ligne, .qsj-tete .surtitre, .qsj-role, .qsj-intro, .qsj-actions, .sceau');
      gsap.set('.qsj-contour path, .qsj-contour ellipse', { clearProps: 'all' });
      if (this.fenetre) { this.fenetre.etat.o = 1; this.fenetre.maj(); }
    },
  };
  quiSuisJe.arrivee = arriver(quiSuisJe);

  /* ---------- Immobilier ---------- */
  /* Du plan à la pierre : intro 0 → 1 (le balayage découvre la photo de gauche à droite), retour 0 → 1 au défilement
     (le plan revient par la droite jusqu'à 55 %). La loupe suit la souris (dans la boucle du socle, souris seulement)
     et montre le plan sous elle ; elle se pose quand la souris s'arrête. */
  const planPierre = () => {
    const section = $('.imm-tete'), scene = $('.imm-scene'), plan = $('.imm-plan'), scan = $('.imm-scan'), loupe = $('.imm-loupe');
    if (!section || !scene || !plan) return null;
    const e = { intro: 1, retour: 0 };
    let dernier = '';
    const maj = () => {
      const v = Math.max(0, Math.min(e.intro * 100, 100 - 55 * e.retour));
      const t = `${v.toFixed(2)}%`;
      if (t === dernier) return;
      dernier = t;
      scene.style.setProperty('--scan', t);
      if (scan) scan.style.opacity = v > 0.3 && v < 99.7 ? '1' : '0';
    };
    if (loupe && !etat.calme && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const R = 130;
      let sx = 0, sy = 0, cx = 0, cy = 0, r = 0, cible = 0, ecrit = '';
      /* L'ouverture est en haut de page : position = coordonnées écran + défilement (aucune lecture de mise en page). */
      section.addEventListener('pointermove', (ev) => {
        if (ev.pointerType !== 'mouse') return;
        sx = ev.clientX; sy = ev.clientY + window.scrollY;
        if (!cible) { cx = sx; cy = sy; }
        cible = 1;
      }, { passive: true });
      section.addEventListener('pointerleave', () => { cible = 0; });
      boucle(scene, (dt) => {
        const k = 1 - Math.exp(-dt * 12);
        cx += (sx - cx) * k; cy += (sy - cy) * k;
        r += (cible * R - r) * (1 - Math.exp(-dt * 8));
        if (Math.abs(sx - cx) < 0.2) cx = sx;
        if (Math.abs(sy - cy) < 0.2) cy = sy;
        if (Math.abs(cible * R - r) < 0.3) r = cible * R;
        const sig = `${cx.toFixed(1)}|${cy.toFixed(1)}|${r.toFixed(1)}`;
        if (sig === ecrit) return;
        ecrit = sig;
        plan.style.setProperty('--mx', `${cx.toFixed(1)}px`);
        plan.style.setProperty('--my', `${cy.toFixed(1)}px`);
        plan.style.setProperty('--r', `${r.toFixed(1)}px`);
        loupe.style.opacity = r > 1 ? '1' : '0';
        loupe.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) scale(${(r / R).toFixed(3)})`;
      });
    }
    maj();
    return { etat: e, maj };
  };

  const immobilier = {
    preparer() {
      enteteNuit();
      const P = this.plan = planPierre();
      if (!actif()) return;
      /* Le plan couvre toute la façade jusqu'à l'ouverture (sauf au retour arrière). */
      if (P && etat.arrivee !== 'retour') { P.etat.intro = 0; P.maj(); }
      if (P) gsap.fromTo(P.etat, { retour: 0 }, { retour: 1, ease: 'none', onUpdate: P.maj,
        scrollTrigger: { trigger: '.imm-tete', start: 'top top', end: 'bottom top', scrub: 0.4 } });
      const couches = $$('.couche');
      gsap.fromTo(couches, { y: (i) => i * 34 }, { y: 0, ease: 'power2.out', scrollTrigger: { trigger: '.eclatee', start: 'top 80%', end: 'center 45%', scrub: true } });
      gsap.fromTo('.legende', { x: 24, opacity: 0.25 }, { x: 0, opacity: 1, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.eclatee', start: 'top 75%', end: 'center 50%', scrub: true } });
      ondesFin();
      ST.sort(); ST.refresh();
    },
    entree(tl, t0) {
      premierEcran(tl, t0, '.imm-ligne', '.imm-tete .surtitre, .imm-cartouche');
      tl.fromTo('.imm-scene img', { scale: 1.08 }, { scale: 1, duration: 2, ease: 'power2.out' }, t0 - 0.4);
      const P = this.plan;
      if (P) tl.fromTo(P.etat, { intro: 0 }, { intro: 1, duration: 1.7, ease: 'power2.inOut', onUpdate: P.maj }, t0 + 0.2);
    },
    etatFinal() {
      remettre('.imm-ligne, .imm-tete .surtitre, .imm-cartouche, .imm-scene img');
      if (this.plan) { this.plan.etat.intro = 1; this.plan.maj(); }
    },
  };
  immobilier.arrivee = arriver(immobilier);

  /* ---------- Contact ---------- */
  const contact = {
    preparer() {
      this.etapes();
      /* Carte en courbes de niveau (WebGL), image fixe dessous ; le relief se soulève sous la souris. */
      const canvas = $('.carte-vivante-gl');
      this.carte = canvas ? carteCourbes(canvas, $('.ct-tete'), $('.carte-pose'), { mention: $('.carte-mention') }) : null;
      if (!actif()) return;
      /* Au défilement, la carte s'incline et s'éloigne ; le repère reste posé. */
      gsap.timeline({ scrollTrigger: { trigger: '.ct-tete', start: 'top top', end: 'bottom top', scrub: true,
        onUpdate: (s) => this.carte && this.carte.defiler(s.progress) } })
        .fromTo('.carte-vivante', { transformPerspective: 1400, rotateX: 0, scale: 1, yPercent: 0 }, { rotateX: 24, scale: 1.18, yPercent: 8, ease: 'none' }, 0)
        .fromTo('.carte-pose', { yPercent: 0, opacity: 1 }, { yPercent: -60, opacity: 0.2, ease: 'none' }, 0)
        .fromTo('.ct-numero a', { x: 0 }, { x: -40, ease: 'none' }, 0);
    },
    /* Formulaire en quatre étapes : une étape à la fois, hauteur animée, récapitulatif en direct. */
    etapes() {
      const f = $('[data-etapes]');
      if (!f) return;
      const etapes = $$('[data-etape]', f), cadre = $('.rdv-etapes', f);
      const prec = $('[data-precedent]', f), suiv = $('[data-suivant]', f), env = $('[data-envoyer]', f);
      const libelle = $('[data-etape-libelle]', f), barre = $('.rdv-barre span', f);
      const gabarit = libelle.textContent.replace(/1(.*?)4.*$/, '{n}$1{t}');
      let n = 0;
      const recap = () => ['sujet', 'situation', 'dispo', 'moyen'].forEach((k) => {
        const r = f.querySelector(`input[name="${k}"]:checked`);
        const dd = document.querySelector(`[data-recap="${k}"]`);
        if (dd) dd.textContent = r ? r.closest('label').textContent.trim() : '—';
      });
      const aller = (i) => {
        const avant = cadre.offsetHeight;
        etapes.forEach((e, k) => { e.hidden = k !== i; });
        n = i;
        const apres = cadre.scrollHeight;
        if (!etat.calme && gsap) gsap.fromTo(cadre, { height: avant }, { height: apres, duration: 0.45, ease: 'power3.out', clearProps: 'height', onComplete: () => window.ScrollTrigger && window.ScrollTrigger.refresh() });
        prec.hidden = i === 0; suiv.hidden = i === etapes.length - 1; env.hidden = i !== etapes.length - 1;
        libelle.textContent = gabarit.replace('{n}', String(i + 1)).replace('{t}', `4 · ${etapes[i].dataset.titre}`);
        barre.style.transform = `scaleX(${(i + 1) / etapes.length})`;
        const leg = $('legend', etapes[i]);
        if (leg) { leg.tabIndex = -1; leg.focus({ preventScroll: true }); }
      };
      suiv.addEventListener('click', () => aller(Math.min(etapes.length - 1, n + 1)));
      prec.addEventListener('click', () => aller(Math.max(0, n - 1)));
      f.addEventListener('change', recap);
      /* Une erreur dans une étape cachée (envoi) ramène à l'étape 4, où sont les champs obligatoires. */
      f.addEventListener('submit', () => { if (n !== etapes.length - 1) aller(etapes.length - 1); }, true);
      recap();
    },
    entree(tl, t0) {
      tl.fromTo('.ct-tete .surtitre, .ct-titre', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, t0 - 0.2)
        .fromTo('.ct-chiffre > span', { yPercent: (i) => 125 + (i % 3) * 30 }, { yPercent: 0, duration: 0.7, stagger: 0.045, ease: 'power3.out' }, t0 - 0.1)
        .fromTo('.ct-intro, .ct-coord, .ct-tete .bouton, .carte-coordonnees', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07 }, t0 + 0.2);
      /* Le repère tombe sur Le Mans, s'écrase, et ses ondes parcourent la carte. */
      const corps = $('.carte-repere .repere-corps'), ombre = $('.carte-repere .repere-ombre');
      if (!corps) return;
      const t1 = t0 + 0.1;
      tl.fromTo(corps, { y: -window.innerHeight * 0.9, scaleY: 1.12, scaleX: 0.94 }, { y: 0, scaleY: 1, scaleX: 1, duration: 0.55, ease: 'power3.in' }, t1 - 0.35)
        .fromTo(ombre, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'power3.in' }, t1 - 0.35)
        .to(corps, { scaleY: 0.92, scaleX: 1.05, duration: 0.08 }, t1 + 0.2)
        .to(corps, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }, t1 + 0.28)
        .call(() => {
          if (etat.calme) return;
          gsap.fromTo('.carte-onde', { scale: 0.5, opacity: 0.9 }, { scale: 5, opacity: 0, duration: 1.3, stagger: 0.2, ease: 'power2.out' });
          if (!this.carte) return;
          this.carte.onde();
          /* Téléphone : la loupe s'ouvre autour du repère et laisse voir le terrain. */
          const l = { v: 0 };
          gsap.to(l, { v: 1, duration: 1.4, delay: 0.3, ease: 'power3.out', onUpdate: () => this.carte.terrain(l.v) });
        }, null, t1 + 0.2)
        .fromTo('.carte-lieu', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, t1 + 0.3);
    },
    etatFinal() { remettre('.ct-tete .surtitre, .ct-titre, .ct-chiffre > span, .carte-repere .repere-corps, .carte-repere .repere-ombre, .carte-lieu, .ct-intro, .ct-coord, .ct-tete .bouton, .carte-coordonnees'); this.carte && this.carte.terrain(1); },
  };
  contact.arrivee = arriver(contact);

  /* ---------- 404 : le repère tombe à côté de la carte ---------- */
  const introuvable = {
    entree(tl, t0) {
      tl.fromTo('.introuvable-repere .repere-corps', { y: -220, rotate: 0 }, { y: 0, duration: 0.6, ease: 'bounce.out' }, t0 - 0.2)
        .fromTo('.introuvable-repere', { rotate: 0 }, { rotate: 18, duration: 0.5, ease: 'power2.out' }, t0 + 0.4);
    },
    etatFinal() { remettre('.introuvable-repere .repere-corps'); },
  };
  introuvable.arrivee = arriver(introuvable);

  return { accompagnement, 'qui-suis-je': quiSuisJe, immobilier, contact, '404': introuvable };
}
