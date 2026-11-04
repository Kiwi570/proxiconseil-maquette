/* Qui suis-je. Ouverture scindée sur fond sable : texte à gauche, portrait à droite qui naît
   d'une trame d'impression (WebGL). Puis la priorité mot à mot, le parcours en frise tracée,
   la charte en sceau qui tourne, les informations légales. */
import { html } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'qui-suis-je', fichier: 'qui-suis-je', imagePartage: 'portrait-1134.webp' };

export default (c) => html`
<section class="qsj-tete" id="debut">
  <div class="qsj-tete-texte">
    <p class="surtitre" data-anime="gsap">${c.t('quisuisje.tete.surtitre')}</p>
    <h1 class="qsj-titre"><span class="ligne-masque"><span class="qsj-ligne" data-anime="gsap">${c.t('quisuisje.tete.prenom')}</span></span><span class="ligne-masque"><span class="qsj-ligne" data-anime="gsap"><em>${c.t('quisuisje.tete.nom')}</em></span></span></h1>
    <p class="qsj-role" data-anime="gsap">${c.t('quisuisje.tete.role')}</p>
    <p class="qsj-intro" data-anime="gsap">${c.t('quisuisje.tete.texte')}</p>
    <p class="qsj-actions" data-anime="gsap">${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('quisuisje.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <span class="qsj-info" data-info-cle>${c.t('quisuisje.tete.info')}</span></p>
  </div>
  <div class="qsj-portrait" data-effet="portrait-trame">
    ${c.media({ nom: 'portrait', alt: c.s('quisuisje.tete.alt'), cadrage: '50% 30%', cadrageMobile: '52% 26%', priorite: true, classe: 'qsj-media', sizes: '(max-width: 760px) 100vw, 46vw' })}
    <canvas class="qsj-trame" aria-hidden="true"></canvas>
  </div>
</section>

<section class="priorite" id="priorite">
  <div class="conteneur priorite-grille">
    <div>
      <h2 class="surtitre-h2" data-anime>${c.t('quisuisje.valeur.titre')}</h2>
      <p class="manifeste manifeste--grand" data-effet="manifeste">${c.t('quisuisje.valeur.texte')}</p>
    </div>
    ${c.media({ nom: 'grok/carnet-bureau', alt: c.s('quisuisje.parcours.alt'), cadrage: '45% 50%', classe: 'priorite-media', sizes: '(max-width: 760px) 90vw, 38vw', attrs: 'data-fx="parallaxe"' })}
  </div>
</section>

<section class="parcours conteneur" id="parcours">
  <div class="parcours-tete">
    <h2 data-anime="lignes">${c.t('quisuisje.parcours.titre')}</h2>
    <p class="parcours-chiffre" data-anime><strong data-compteur="18">18</strong> <span>${c.t('accueil.apercu.chiffre')}</span></p>
  </div>
  <div class="frise" data-visuel>
    <svg class="frise-trait" viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M5 0 V100" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
    <ol class="frise-liste" data-anime="cascade">
      ${[1, 2, 3, 4].map((n) => html`<li class="frise-etape"><span class="frise-point" aria-hidden="true"></span><h3>${c.t(`quisuisje.parcours.e${n}Titre`)}</h3><p>${c.t(`quisuisje.parcours.e${n}`)}</p></li>`)}
    </ol>
  </div>
</section>

<section class="charte" id="charte">
  <div class="conteneur charte-grille">
    <div class="sceau" data-effet="sceau" role="img" aria-label="${c.s('quisuisje.charte.sceauAlt')}">
      <svg viewBox="0 0 300 300" aria-hidden="true"><defs><path id="sceau-cercle" d="M150 150 m-118 0 a118 118 0 1 1 236 0 a118 118 0 1 1 -236 0"/></defs>
        <g class="sceau-tour"><circle cx="150" cy="150" r="140" fill="none" stroke="currentColor" stroke-width="1.5"/><text class="sceau-texte"><textPath href="#sceau-cercle">${c.t('quisuisje.charte.sceau1')} · ${c.t('quisuisje.charte.sceau2')} · ${c.t('quisuisje.charte.sceau3')} · </textPath></text></g>
        <circle cx="150" cy="150" r="92" fill="none" stroke="currentColor" stroke-width="2.5"/>
      </svg>
      <span class="sceau-repere">${repere('sceau-pin')}</span>
    </div>
    <div>
      <h2 data-anime="lignes">${c.t('quisuisje.charte.titre')}</h2>
      <p class="charte-texte" data-anime>${c.t('quisuisje.charte.texte')}</p>
      <blockquote class="charte-recommandation" data-anime><p>${c.t('quisuisje.charte.recommandation')}</p></blockquote>
    </div>
  </div>
</section>

<section class="legal conteneur" id="informations-legales">
  <div class="legal-tete">
    <img class="legal-logo" src="/assets/images/logo-complet.webp" alt="${c.s('quisuisje.legal.logoAlt')}" width="720" height="252" loading="lazy" data-anime>
    <h2 data-anime="lignes">${c.t('quisuisje.legal.titre')}</h2>
  </div>
  <ul class="legal-liste" data-anime="cascade">
    <li>${c.t('quisuisje.legal.l1')}</li>
    <li>${c.t('quisuisje.legal.l2')}</li>
    <li>${c.t('quisuisje.legal.l3')}</li>
    <li>${c.t('commun.mediateurs')}</li>
  </ul>
  <p class="legal-reseaux">${c.t('quisuisje.legal.reseaux')} <a href="${c.site.contact.linkedin}" target="_blank" rel="noopener">${c.t('commun.linkedin')}</a> · <a href="${c.site.contact.facebook}" target="_blank" rel="noopener">${c.t('commun.facebook')}</a></p>
</section>

<section class="fin-page" id="appel">
  <div class="conteneur fin-page-grille">
    <div class="fin-page-repere" aria-hidden="true" data-effet="ondes-appel" data-visuel><span></span><span></span><span></span>${repere('fin-repere')}</div>
    <div>
      <h2 data-anime="lignes">${c.t('accueil.appel.titre')}</h2>
      <p data-anime>${c.t('accueil.appel.texte')}</p>
      <p class="appel-actions" data-anime>${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('accueil.appel.rdv') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('accueil.appel.appeler')}</a></p>
    </div>
  </div>
</section>
`;
