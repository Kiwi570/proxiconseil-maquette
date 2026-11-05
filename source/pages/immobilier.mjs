/* Immobilier. Ouverture « du plan à la pierre » : la façade en plein écran apparaît d'abord en plan d'architecte
   (bleu nuit pétrole, traits calcaire), puis un balayage révèle la photo ; sous la souris, une loupe montre le plan,
   et au défilement le plan revient par la droite. Titre géant en bas à gauche, informations dans un cartouche
   d'architecte. Puis une résidence en vue éclatée, couche par couche, et la mosaïque des résidences Stellium. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'immobilier', fichier: 'immobilier', imagePartage: 'grok/immobilier-facade-1280.webp' };

/* Vue éclatée : cinq couches d'un immeuble en perspective, de l'emplacement au toit. */
const couche = (cle, i) => {
  const y = 300 - i * 52;
  const dessus = `M60 ${y} L240 ${y - 50} L420 ${y} L240 ${y + 50} Z`;
  const cote = `M60 ${y} L60 ${y + 26} L240 ${y + 76} L240 ${y + 50} Z M240 ${y + 50} L240 ${y + 76} L420 ${y + 26} L420 ${y} Z`;
  return `<g class="couche couche--${cle}" data-i="${i}"><path class="couche-cote" d="${cote}"/><path class="couche-dessus" d="${dessus}"/></g>`;
};

export default (c) => html`
<section class="imm-tete" id="debut" data-entete-nuit>
  <div class="imm-scene" data-effet="plan-pierre" data-souris>
    ${c.media({ nom: 'grok/immobilier-facade', alt: c.s('immobilier.tete.alt'), cadrage: '50% 50%', priorite: true, classe: 'imm-photo', sizes: '100vw' })}
    <div class="imm-plan" aria-hidden="true">
      ${c.media({ nom: 'immobilier-plan', alt: '', cadrage: '50% 50%', priorite: true, classe: 'imm-plan-media', sizes: '100vw' })}
      <p class="plan-cartouche"><span>${c.t('immobilier.tete.cartouche')}</span><span>${c.t('immobilier.tete.cartoucheNote')}</span></p>
    </div>
    <span class="imm-scan" aria-hidden="true"></span>
    <span class="imm-loupe" aria-hidden="true"></span>
  </div>
  <div class="conteneur imm-tete-texte">
    <div class="imm-titrage">
      <p class="surtitre" data-anime="gsap">${c.t('immobilier.tete.surtitre')}</p>
      <h1 class="imm-titre"><span class="ligne-masque"><span class="imm-ligne" data-anime="gsap">${c.t('immobilier.tete.titre1')}</span></span><span class="ligne-masque"><span class="imm-ligne" data-anime="gsap"><em>${c.t('immobilier.tete.titre2')}</em></span></span></h1>
    </div>
    <div class="imm-cartouche" data-anime="gsap">
      <p class="imm-cartouche-texte">${c.t('immobilier.tete.texte')}</p>
      <p class="imm-actions">${c.lien('contact', { ancre: 'rendez-vous', params: 'sujet=immobilier', classe: 'bouton bouton--clair', texte: c.t('immobilier.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })}</p>
      <p class="imm-info" data-info-cle>${c.t('immobilier.tete.info')}</p>
    </div>
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
