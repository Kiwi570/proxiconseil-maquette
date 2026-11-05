/* Effets propres des pages intérieures (accompagnement, qui suis-je, immobilier, contact, 404).
   Chaque page : preparer() (déclencheurs au défilement, états de départ), entree(tl, t0) (sa part de l'intro),
   arrivee() (après le voile), etatFinal() (retour, calme, secours). Chaque effet porte data-effet="nom". */
import { trameApi } from './trame.js?v=4';
import { carteCourbes } from './carte.js?v=4';

export function pagesInterieures({ gsap, ST, $, $$, etat, actif }) {
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
      this.boussole();
      if (!actif()) return;
      gsap.fromTo('.anneaux--horizon', { scale: 1, yPercent: 0 }, { scale: 1.3, yPercent: 18, ease: 'none', transformOrigin: '50% 100%',
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
      premierEcran(tl, t0, '.acc-ligne', '.acc-tete .surtitre, .acc-intro, .acc-actions');
      tl.fromTo('.anneaux--horizon .anneau-cercle', { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.out', transformOrigin: '50% 50%' }, t0 - 0.3)
        .fromTo('.anneaux--horizon .anneau-point, .anneaux--horizon .anneau-nom', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.05 }, t0 + 0.2)
        .fromTo('.anneaux--horizon .anneaux-repere', { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'bounce.out' }, t0 - 0.2);
    },
    etatFinal() { remettre('.acc-ligne, .acc-tete .surtitre, .acc-intro, .acc-actions, .anneaux--horizon .anneau-cercle, .anneaux--horizon .anneau-point, .anneaux--horizon .anneau-nom, .anneaux--horizon .anneaux-repere, .tampon, .feuillet'); },
  };
  accompagnement.arrivee = arriver(accompagnement);

  /* ---------- Qui suis-je ---------- */
  const quiSuisJe = {
    pret() {
      const canvas = $('.qsj-trame'), img = $('.qsj-media img');
      if (!canvas || !img || etat.calme) return null;
      this.trame = trameApi(canvas, img, $('.qsj-portrait'));
      return this.trame.pret;
    },
    preparer() {
      if (!actif()) return;
      manifeste();
      ST.create({ trigger: '.qsj-tete', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => this.trame && this.trame.melange(1 - s.progress * 0.5) });
      gsap.fromTo('.sceau-tour', { rotate: 0 }, { rotate: 200, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: '.charte', start: 'top bottom', end: 'bottom top', scrub: true } });
      const presse = gsap.fromTo('.sceau', { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.2)', paused: true });
      ST.create({ trigger: '.sceau', start: 'top 78%', once: true, onEnter: () => presse.play() });
      ondesFin();
      ST.sort(); ST.refresh();
    },
    entree(tl, t0) {
      premierEcran(tl, t0, '.qsj-ligne', '.qsj-tete .surtitre, .qsj-role, .qsj-intro, .qsj-actions');
      if (this.trame) tl.fromTo(this.trame.etat, { m: 0 }, { m: 1, duration: 1.4, ease: 'power2.inOut', onUpdate: () => this.trame.melange(this.trame.etat.m) }, t0 - 0.4);
    },
    etatFinal() { remettre('.qsj-ligne, .qsj-tete .surtitre, .qsj-role, .qsj-intro, .qsj-actions, .sceau'); this.trame && this.trame.melange(1); },
  };
  quiSuisJe.arrivee = arriver(quiSuisJe);

  /* ---------- Immobilier ---------- */
  const immobilier = {
    preparer() {
      this.traits = $$('.plan-traits > *');
      if (!actif()) return;
      gsap.timeline({ scrollTrigger: { trigger: '.imm-bandeau', start: 'top 75%', end: 'bottom 25%', scrub: true } })
        .fromTo('.imm-plan', { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }, { opacity: 0, clipPath: 'inset(0% 0% 0% 100%)', ease: 'power1.in' }, 0)
        .fromTo('.imm-media img', { scale: 1.12 }, { scale: 1, ease: 'none' }, 0);
      const couches = $$('.couche');
      gsap.fromTo(couches, { y: (i) => i * 34 }, { y: 0, ease: 'power2.out', scrollTrigger: { trigger: '.eclatee', start: 'top 80%', end: 'center 45%', scrub: true } });
      gsap.fromTo('.legende', { x: 24, opacity: 0.25 }, { x: 0, opacity: 1, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: '.eclatee', start: 'top 75%', end: 'center 50%', scrub: true } });
      ondesFin();
      ST.sort(); ST.refresh();
    },
    entree(tl, t0) {
      premierEcran(tl, t0, '.imm-ligne', '.imm-tete .surtitre, .imm-tete-cote > p');
      const traits = this.traits || [];
      traits.forEach((p) => { const L = p.getTotalLength ? p.getTotalLength() : 0; if (L) gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      tl.to(traits, { strokeDashoffset: 0, duration: 1.3, stagger: 0.04, ease: 'power2.inOut' }, t0 - 0.2);
    },
    etatFinal() { remettre('.imm-ligne, .imm-tete .surtitre, .imm-tete-cote > p'); gsap.set('.plan-traits > *', { clearProps: 'strokeDasharray,strokeDashoffset' }); },
  };
  immobilier.arrivee = arriver(immobilier);

  /* ---------- Contact ---------- */
  const contact = {
    preparer() {
      this.etapes();
      /* Carte en courbes de niveau (WebGL), image fixe dessous ; le relief se soulève sous la souris. */
      const canvas = $('.carte-vivante-gl');
      this.carte = canvas ? carteCourbes(canvas, $('.ct-tete'), $('.carte-pose')) : null;
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
        .call(() => { if (!etat.calme) gsap.fromTo('.carte-onde', { scale: 0.5, opacity: 0.9 }, { scale: 5, opacity: 0, duration: 1.3, stagger: 0.2, ease: 'power2.out' }); this.carte && this.carte.onde(); }, null, t1 + 0.2)
        .fromTo('.carte-lieu', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, t1 + 0.3);
    },
    etatFinal() { remettre('.ct-tete .surtitre, .ct-titre, .ct-chiffre > span, .carte-repere .repere-corps, .carte-repere .repere-ombre, .carte-lieu, .ct-intro, .ct-coord, .ct-tete .bouton, .carte-coordonnees'); },
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
