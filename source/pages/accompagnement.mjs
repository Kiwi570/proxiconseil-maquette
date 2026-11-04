/* Mon accompagnement. Ouverture : fond nuit pétrole, composition centrée, six anneaux qui se lèvent
   comme un horizon depuis le bas de l'écran (onde qui s'ouvre). Puis fiches d'objectifs empilées,
   pour qui, boussole (choix de situation), feuillets du déroulé, statuts et tampon ORIAS. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';
import { anneaux } from './accueil.mjs';

export const page = { cle: 'accompagnement', fichier: 'accompagnement', imagePartage: 'grok/objectif-epargne-784.webp' };

export default (c) => {
  const obj = c.donnees.objectifs;
  const nom = Object.fromEntries(obj.map((o) => [o.cle, o.nom]));
  const premiere = c.donnees.situations[0];
  return html`
<section class="acc-tete" id="debut">
  <div class="acc-tete-texte conteneur">
    <p class="surtitre" data-anime="gsap">${c.t('accompagnement.tete.surtitre')}</p>
    <h1 class="acc-titre"><span class="ligne-masque"><span class="acc-ligne" data-anime="gsap">${c.t('accompagnement.tete.titre1')}</span></span><span class="ligne-masque"><span class="acc-ligne" data-anime="gsap"><em>${c.t('accompagnement.tete.titre2')}</em></span></span></h1>
    <p class="acc-intro" data-anime="gsap">${c.t('accompagnement.tete.texte')}</p>
    <p class="acc-actions" data-anime="gsap">${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--clair', texte: c.t('accompagnement.tete.action'), attrs: 'data-action-principale data-survol="magnetique"' })} <span class="acc-info" data-info-cle>${c.t('accompagnement.tete.info')}</span></p>
  </div>
  <div class="acc-horizon" data-superpose>${anneaux(c, obj, { classe: 'anneaux--horizon', effet: 'anneaux-horizon', angles: [-2.45, -0.62, -1.95, -1.1, -2.75, -0.32], R0: 120, PAS: 62, viewBox: '-520 -520 1040 560', corps: 26, courts: false })}</div>
</section>

<section class="planches conteneur" id="objectifs">
  <h2 class="planches-titre" data-anime="lignes">${c.t('accompagnement.objectifs.titre')}</h2>
  <ol class="planches-liste" data-effet="planches">
    ${obj.map((o, i) => html`<li class="planche" id="objectif-${o.cle}" style="--i:${i}">
      ${c.media({ nom: o.image, alt: o.alt, cadrage: o.cadrage, classe: 'planche-media', sizes: '(max-width: 760px) 90vw, 36vw' })}
      <div class="planche-texte">
        <span class="planche-num">0${i + 1} / 06</span>
        <h3>${o.nom}</h3>
        <p>${o.texte}</p>
        ${c.lien('contact', { ancre: 'rendez-vous', params: `sujet=${o.cle}`, classe: 'lien-fleche', texte: c.t('accompagnement.objectifs.lien') })}
      </div>
      <span class="planche-voile" aria-hidden="true" data-superpose></span>
    </li>`)}
  </ol>
  <p class="planches-risque">${c.t('commun.risque')}</p>
</section>

<section class="pourqui conteneur" id="pour-qui">
  <h2 data-anime="lignes">${c.t('accompagnement.pourqui.titre')}</h2>
  <div class="pourqui-grille">
    <article class="pourqui-carte">
      ${c.media({ nom: 'grok/pour-particuliers', alt: c.s('accompagnement.pourqui.particuliersAlt'), cadrage: '55% 60%', classe: 'pourqui-media', sizes: '(max-width: 760px) 90vw, 44vw', attrs: 'data-anime="rideau"' })}
      <h3>${c.t('accompagnement.pourqui.particuliersTitre')}</h3>
      <p>${c.t('accompagnement.pourqui.particuliers')}</p>
    </article>
    <article class="pourqui-carte">
      ${c.media({ nom: 'grok/pour-entreprises', alt: c.s('accompagnement.pourqui.entreprisesAlt'), cadrage: '45% 55%', classe: 'pourqui-media', sizes: '(max-width: 760px) 90vw, 44vw', attrs: 'data-anime="rideau"' })}
      <h3>${c.t('accompagnement.pourqui.entreprisesTitre')}</h3>
      <p>${c.t('accompagnement.pourqui.entreprises')}</p>
    </article>
  </div>
</section>

<section class="boussole" id="boussole" data-boussole>
  <div class="conteneur boussole-grille">
    <div class="boussole-tete">
      <h2 data-anime="lignes">${c.t('accompagnement.boussole.titre')}</h2>
      <p data-anime>${c.t('accompagnement.boussole.texte')}</p>
      <fieldset class="boussole-choix" data-anime="cascade">
        <legend class="visuellement-cache">${c.t('accompagnement.boussole.legende')}</legend>
        ${c.donnees.situations.map((s, i) => html`<label class="choix"><input type="radio" name="situation" value="${s.cle}" data-objectifs="${s.objectifs.join(' ')}"${i === 0 ? brut(' checked') : ''}><span>${s.libelle}</span></label>`)}
      </fieldset>
    </div>
    <div class="boussole-resultat">
      <div class="boussole-schema" data-visuel>${anneaux(c, obj, { classe: 'anneaux--boussole', effet: 'boussole' })}</div>
      <p class="boussole-liste" aria-live="polite"><strong>${c.t('accompagnement.boussole.resultat')}</strong> <span data-boussole-noms>${premiere.objectifs.map((k) => nom[k]).join(', ')}</span></p>
      <p>${c.lien('contact', { ancre: 'rendez-vous', params: `sujet=${premiere.objectifs[0]}`, classe: 'bouton', texte: c.t('accompagnement.boussole.action'), attrs: 'data-boussole-lien' })}</p>
      <p class="boussole-mention">${c.t('accompagnement.boussole.mention')}</p>
    </div>
  </div>
  <script type="application/json" data-boussole-json>${brut(JSON.stringify(nom))}</script>
</section>

<section class="feuillets" id="deroule">
  <div class="conteneur">
    <h2 data-anime="lignes">${c.t('accompagnement.deroule.titre')}</h2>
    <p class="feuillets-intro" data-anime>${c.t('accompagnement.deroule.texte')} <span class="a-valider">${c.t('commun.aValider')}</span></p>
    <ol class="feuillets-liste" data-effet="feuillets" data-visuel>
      ${c.donnees.etapes.map((e, i) => html`<li class="feuillet" style="--i:${i}"><span class="feuillet-num">${i + 1}</span><h3>${e.titre}</h3><p>${e.texte}</p><span class="feuillet-lignes" aria-hidden="true"></span></li>`)}
    </ol>
  </div>
</section>

<section class="statuts conteneur" id="statuts">
  <div class="statuts-tete">
    <h2 data-anime="lignes">${c.t('accompagnement.statuts.titre')}</h2>
    <p data-anime>${c.t('accompagnement.statuts.texte')}</p>
    <a class="lien-fleche" href="https://www.orias.fr/" target="_blank" rel="noopener">${c.t('accompagnement.statuts.orias')}</a>
  </div>
  <div class="tampon" aria-hidden="true" data-effet="tampon-orias" data-visuel data-superpose>
    <svg viewBox="0 0 200 200"><defs><path id="tampon-cercle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0"/></defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <text class="tampon-texte"><textPath href="#tampon-cercle">ORIAS · CONSEILLER EN INVESTISSEMENTS FINANCIERS · </textPath></text>
      <text class="tampon-num" x="100" y="96" text-anchor="middle">22007088</text><text class="tampon-petit" x="100" y="118" text-anchor="middle">ANACOFI · AMF</text>
    </svg>
  </div>
  <ul class="statuts-liste" data-anime="cascade">
    <li><h3>${c.t('accompagnement.statuts.cifTitre')}</h3><p>${c.t('accompagnement.statuts.cif')}</p></li>
    <li><h3>${c.t('accompagnement.statuts.iobspTitre')}</h3><p>${c.t('accompagnement.statuts.iobsp')}</p></li>
    <li><h3>${c.t('accompagnement.statuts.iasTitre')}</h3><p>${c.t('accompagnement.statuts.ias')}</p></li>
    <li><h3>${c.t('accompagnement.statuts.immoTitre')}</h3><p>${c.t('accompagnement.statuts.immo')}</p></li>
  </ul>
</section>

<section class="fin-page fin-page--nuit" id="appel">
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
};
