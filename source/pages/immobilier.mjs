/* Immobilier. Ouverture : fond clair, très grand titre, puis un bandeau photo recouvert d'un plan de masse
   d'architecte qui se dessine, puis s'efface au défilement. Puis une résidence en vue éclatée,
   couche par couche, et la mosaïque des résidences Stellium. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'immobilier', fichier: 'immobilier', imagePartage: 'grok/immobilier-facade-1280.webp' };

/* Plan de masse : emprises de bâtiments, cotes et hachures, en traits fins (dessin d'architecte). */
const plan = `<svg class="plan-masse" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g class="plan-traits" fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke">
    <path d="M90 300 H430 V150 H300 V90 H90 Z"/><path d="M520 320 H760 V120 H520 Z"/><path d="M850 290 H1110 V170 H980 V110 H850 Z"/>
    <path d="M110 300 V320 M430 300 V320 M110 314 H430" stroke-dasharray="4 4"/><path d="M520 340 V356 M760 340 V356 M520 350 H760" stroke-dasharray="4 4"/>
    <path d="M40 370 C 300 350, 520 395, 760 372 S 1100 345, 1170 372"/><path d="M40 392 C 300 372, 520 417, 760 394 S 1100 367, 1170 394"/>
    <path d="M540 140 L740 300 M560 140 L740 284 M520 160 L700 320 M520 180 L680 320" stroke-width="1"/>
    <circle cx="470" cy="80" r="16"/><circle cx="800" cy="70" r="22"/><circle cx="1150" cy="120" r="18"/><circle cx="60" cy="110" r="20"/>
    <path d="M300 90 L350 40 M1110 170 L1150 140"/>
  </g>
</svg>`;

/* Vue éclatée : cinq couches d'un immeuble en perspective, de l'emplacement au toit. */
const couche = (cle, i) => {
  const y = 300 - i * 52;
  const dessus = `M60 ${y} L240 ${y - 50} L420 ${y} L240 ${y + 50} Z`;
  const cote = `M60 ${y} L60 ${y + 26} L240 ${y + 76} L240 ${y + 50} Z M240 ${y + 50} L240 ${y + 76} L420 ${y + 26} L420 ${y} Z`;
  return `<g class="couche couche--${cle}" data-i="${i}"><path class="couche-cote" d="${cote}"/><path class="couche-dessus" d="${dessus}"/></g>`;
};

export default (c) => html`
<section class="imm-tete" id="debut">
  <div class="conteneur imm-tete-texte">
    <p class="surtitre" data-anime="gsap">${c.t('immobilier.tete.surtitre')}</p>
    <h1 class="imm-titre"><span class="ligne-masque"><span class="imm-ligne" data-anime="gsap">${c.t('immobilier.tete.titre1')}</span></span><span class="ligne-masque"><span class="imm-ligne" data-anime="gsap"><em>${c.t('immobilier.tete.titre2')}</em></span></span></h1>
    <div class="imm-tete-cote">
      <p data-anime="gsap">${c.t('immobilier.tete.texte')}</p>
      <p class="imm-actions" data-anime="gsap">${c.lien('contact', { ancre: 'rendez-vous', params: 'sujet=immobilier', classe: 'bouton', texte: c.t('immobilier.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <span class="imm-info" data-info-cle>${c.t('immobilier.tete.info')}</span></p>
    </div>
  </div>
  <div class="imm-bandeau" data-effet="plan-masse">
    ${c.media({ nom: 'grok/immobilier-facade', alt: c.s('immobilier.tete.alt'), cadrage: '45% 55%', priorite: true, classe: 'imm-media', sizes: '100vw' })}
    <div class="imm-plan">${brut(plan)}<p class="plan-cartouche" aria-hidden="true"><span>${c.t('immobilier.tete.cartouche')}</span><span>${c.t('immobilier.tete.cartoucheNote')}</span></p></div>
  </div>
</section>

<section class="couches conteneur" id="couches">
  <div class="couches-tete">
    <h2 data-anime="lignes">${c.t('immobilier.couches.titre')}</h2>
    <p data-anime>${c.t('immobilier.couches.texte')} <span class="a-valider">${c.t('commun.aValider')}</span></p>
  </div>
  <div class="eclatee" data-effet="vue-eclatee" data-visuel>
    <svg class="eclatee-dessin" viewBox="0 0 480 440" aria-hidden="true">${brut(['sol', 'rdc', 'etage1', 'etage2', 'toit'].map(couche).join(''))}</svg>
    <ol class="eclatee-legendes">
      ${c.donnees.couches.map((k) => html`<li class="legende legende--${k.cle}"><h3>${k.titre}</h3><p>${k.texte}</p></li>`)}
    </ol>
  </div>
  <p class="couches-risque" data-anime>${c.t('immobilier.couches.risque')}</p>
</section>

<section class="mosaique conteneur" id="residences">
  <div class="mosaique-tete">
    <h2 data-anime="lignes">${c.t('immobilier.residences.titre')}</h2>
    <p data-anime>${c.t('immobilier.residences.texte')}</p>
  </div>
  <div class="mosaique-grille">
    ${c.donnees.residences.map((r, i) => html`<figure class="mosaique-carte" id="residence-${i + 1}" data-survol="incline">
      ${c.media({ nom: r.image, alt: r.alt, classe: 'mosaique-media', sizes: '(max-width: 760px) 90vw, 30vw', attrs: 'data-anime="rideau"' })}
      <figcaption>${c.t('immobilier.residences.legende')}</figcaption>
    </figure>`)}
  </div>
</section>

<section class="fin-page fin-page--courbes" id="appel">
  <div class="conteneur fin-page-grille">
    <div class="fin-page-repere" aria-hidden="true" data-effet="ondes-appel" data-visuel><span></span><span></span><span></span>${repere('fin-repere')}</div>
    <div>
      <h2 data-anime="lignes">${c.t('immobilier.appel.titre')}</h2>
      <p data-anime>${c.t('immobilier.appel.texte')}</p>
      <p class="appel-actions" data-anime>${c.lien('contact', { ancre: 'rendez-vous', params: 'sujet=immobilier', classe: 'bouton', texte: c.t('immobilier.appel.action') })} <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('accueil.appel.appeler')}</a></p>
    </div>
  </div>
</section>
`;
