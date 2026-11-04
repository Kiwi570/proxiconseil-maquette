/* Accueil : carte en courbes de niveau (WebGL) où le repère du logo se pose sur Le Mans,
   raisons mot à mot sur une photo qui ondule, six objectifs sur six anneaux (section épinglée),
   déroulé en itinéraire, citation raturée, aperçu du portrait, avis suspendus à des repères,
   galerie des résidences, appel final sur des ondes. Une section, au moins un effet au défilement. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'carte-courbes.webp' };

/* Anneaux concentriques : un par objectif, libellé posé sur l'anneau. */
export function anneaux(c, objectifs, { classe = '', effet = 'anneaux-objectifs', angles = [-2.2, -0.75, 0.15, 0.95, 2.05, 2.75], viewBox = '-330 -330 660 660', R0 = 62, PAS = 36, corps = 23, courts = true } = {}) {
  const demi = Math.abs(parseFloat(viewBox.split(' ')[0]));
  return html`<svg class="anneaux ${classe}" viewBox="${brut(viewBox)}" role="img" aria-label="${c.s('accompagnement.tete.anneauxAlt')}" data-effet="${effet}">
  ${objectifs.map((o, i) => {
    const r = R0 + i * PAS;
    const a = angles[i] ?? 0;
    const x = Math.round(Math.cos(a) * r), y = Math.round(Math.sin(a) * r);
    return html`<g class="anneau" data-i="${i}" data-cle="${o.cle}">
      <circle class="anneau-cercle" r="${r}" fill="none"/>
      <circle class="anneau-point" cx="${x}" cy="${y}" r="5" data-repere/>
      ${(() => {
        /* Libellé tourné vers le centre s'il sortirait du dessin. */
        const nom = courts ? o.court || o.nom : o.nom;
        const largeur = nom.length * corps * 0.56;
        const droite = x >= 0 ? x + 14 + largeur <= demi : !(x - 14 - largeur >= -demi);
        return html`<text class="anneau-nom" x="${x + (droite ? 14 : -14)}" y="${y + 8}" text-anchor="${droite ? 'start' : 'end'}">${nom}</text>`;
      })()}
    </g>`;
  })}
  <circle class="anneaux-deco" r="${R0 + 6 * PAS + 22}" fill="none"/>
  <g class="anneaux-repere" transform="translate(-16 -46) scale(.25)">${brut('<path fill="currentColor" fill-rule="evenodd" d="M11.26 97.53A62.5 62.5 0 1 1 116.74 97.53L64 180.5ZM88 64A24 24 0 1 0 40 64A24 24 0 1 0 88 64Z"/>')}</g>
</svg>`;
}

export default (c) => html`
<section class="hero" id="debut" data-plein-ecran>
  <div class="hero-carte" aria-hidden="true" data-effet="carte-courbes">
    <img class="hero-carte-image" src="/assets/images/carte-courbes.webp" alt="" width="1600" height="1000" fetchpriority="high" loading="eager" decoding="async" data-audit-ignorer>
    <canvas class="hero-carte-gl" data-audit-ignorer></canvas>
  </div>
  <div class="hero-pose" data-repere>
    <span class="hero-onde"></span><span class="hero-onde"></span>
    ${repere('hero-repere', 'data-effet="repere-chute"')}
    <span class="hero-lieu">${c.t('contact.carte.leMans')}</span>
  </div>
  <div class="hero-texte conteneur">
    <p class="surtitre" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
    <h1 class="hero-titre"><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne">${c.t('accueil.hero.titre2')}</span></span><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne"><em>${c.t('accueil.hero.titre3')}</em></span></span></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
      <span class="hero-info" data-info-cle><strong>${c.t('accueil.hero.info')}</strong> <span>${c.t('accueil.hero.infoDetail')}</span></span>
    </p>
  </div>
  <p class="hero-coordonnees" data-anime="gsap"><span>${c.t('accueil.hero.coordonnees')}</span></p>
</section>

<section class="raisons" id="raisons">
  ${c.media({ nom: 'grok/raisons-bureau', alt: c.s('accueil.raisons.alt'), cadrage: '45% 88%', classe: 'raisons-media', sizes: '(max-width: 760px) 100vw, 50vw', attrs: 'data-fx="zoom" data-fx-force="16"' })}
  <div class="raisons-texte conteneur">
    <p class="surtitre" data-anime>${c.t('accueil.raisons.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('accueil.raisons.titre')}</h2>
    <p class="raisons-note" data-anime><span class="a-valider">${c.t('accueil.raisons.aValider')}</span></p>
    <ol class="raisons-liste">
      <li><span class="raisons-num" aria-hidden="true">01</span><p class="manifeste" data-effet="manifeste">${c.t('accueil.raisons.r1')}</p></li>
      <li><span class="raisons-num" aria-hidden="true">02</span><p class="manifeste" data-effet="manifeste">${c.t('accueil.raisons.r2')}</p></li>
      <li><span class="raisons-num" aria-hidden="true">03</span><p class="manifeste" data-effet="manifeste">${c.t('accueil.raisons.r3')}</p></li>
    </ol>
  </div>
</section>

<section class="objectifs ecran epingle" id="objectifs" data-objectifs data-entete-cache>
  <div class="objectifs-grille conteneur">
    <div class="objectifs-tete">
      <p class="surtitre" data-anime>${c.t('accueil.objectifs.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.objectifs.titre')}</h2>
      <p data-anime>${c.t('accueil.objectifs.texte')}</p>
      <p class="objectifs-consigne" data-anime>${c.t('accueil.objectifs.consigne')}</p>
    </div>
    <div class="objectifs-schema">${anneaux(c, c.donnees.objectifs)}</div>
    <ol class="objectifs-liste">
      ${c.donnees.objectifs.map((o, i) => html`<li class="objectif" data-i="${i}" id="objectif-${o.cle}">
        ${c.media({ nom: o.image, alt: o.alt, cadrage: o.cadrage, classe: 'objectif-media', sizes: '(max-width: 760px) 34vw, 30vw' })}
        <div class="objectif-texte"><span class="objectif-num">0${i + 1}</span><h3>${o.nom}</h3><p>${o.texte}</p></div>
      </li>`)}
    </ol>
  </div>
  <p class="objectifs-pied conteneur"><span class="objectifs-risque">${c.t('commun.risque')}</span> ${c.lien('accompagnement', { classe: 'lien-fleche', texte: c.t('accueil.objectifs.lien') })}</p>
</section>

<section class="deroule" id="deroule">
  ${c.media({ nom: 'grok/deroule-chemin', alt: c.s('accueil.deroule.titre'), cadrage: '50% 60%', classe: 'deroule-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="12"' })}
  <div class="deroule-contenu conteneur">
    <div class="deroule-tete">
      <p class="surtitre" data-anime>${c.t('accueil.deroule.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.deroule.titre')}</h2>
      <p data-anime>${c.t('accueil.deroule.texte')} <span class="a-valider">${c.t('commun.aValider')}</span></p>
    </div>
    <div class="itineraire" data-effet="itineraire-etapes">
      <svg class="itineraire-trace" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path class="itineraire-fond" d="M50 0 C 90 120, 10 230, 50 340 S 90 560, 50 670 S 10 880, 50 1000"/><path class="itineraire-chemin" d="M50 0 C 90 120, 10 230, 50 340 S 90 560, 50 670 S 10 880, 50 1000"/></svg>
      <ol class="itineraire-etapes">
        ${c.donnees.etapes.map((e, i) => html`<li class="etape" data-i="${i}"><span class="etape-repere" aria-hidden="true">${repere('etape-pin')}</span><div class="etape-carte"><span class="etape-num">${c.t('contact.formulaire.etape')} ${i + 1}</span><h3>${e.titre}</h3><p>${e.texte}</p></div></li>`)}
      </ol>
    </div>
  </div>
</section>

<section class="citation" id="citation">
  ${c.media({ nom: 'grok/citation-horizon', alt: c.s('accueil.citation.auteur'), cadrage: '50% 50%', classe: 'citation-fond', sizes: '100vw', attrs: 'data-fx="zoom" data-fx-force="14"' })}
  <figure class="citation-texte conteneur" data-effet="rature-avenir">
    <p class="citation-faux" aria-hidden="true"><span class="citation-faux-texte">${c.t('accueil.citation.faux')}</span><svg class="citation-rature" viewBox="0 0 400 40" preserveAspectRatio="none"><path pathLength="1" d="M4 26 C 70 14, 130 30, 200 20 S 330 12, 396 22"/></svg></p>
    <blockquote class="citation-vrai"><p>${c.t('accueil.citation.vrai')}</p></blockquote>
    <figcaption class="citation-auteur">${c.t('accueil.citation.auteur')}</figcaption>
  </figure>
</section>

<section class="apercu conteneur" id="qui">
  ${c.media({ nom: 'portrait', alt: c.s('accueil.apercu.alt'), cadrage: '52% 35%', classe: 'apercu-media', sizes: '(max-width: 760px) 90vw, 38vw', attrs: 'data-anime="rideau"' })}
  <div class="apercu-texte">
    <p class="surtitre" data-anime>${c.t('accueil.apercu.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('accueil.apercu.titre')}</h2>
    <p class="apercu-chiffre" data-anime><strong data-compteur="18">18</strong> <span>${c.t('accueil.apercu.chiffre')}</span></p>
    <p data-anime>${c.t('accueil.apercu.texte')}</p>
    <p data-anime>${c.lien('qui-suis-je', { classe: 'bouton bouton--contour', texte: c.t('accueil.apercu.lien'), attrs: 'data-survol="magnetique"' })}</p>
  </div>
</section>

<section class="avis" id="avis">
  <div class="conteneur avis-tete">
    <p class="surtitre" data-anime>${c.t('accueil.avis.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('accueil.avis.titre')}</h2>
    <p data-anime>${c.t('accueil.avis.texte')}</p>
  </div>
  <ul class="avis-liste conteneur" data-effet="avis-epingles" data-visuel>
    ${c.donnees.avis.map((a, i) => html`<li class="avis-carte" style="--i:${i}">${repere('avis-pin')}<div class="avis-corps"><blockquote><p>${a.texte}</p></blockquote><p class="avis-auteur">${a.auteur} <span>· ${c.t('accueil.avis.source')}</span></p></div></li>`)}
  </ul>
</section>

<section class="residences ecran epingle" id="immobilier" data-entete-cache data-fx="galerie">
  <div class="conteneur residences-tete">
    <div>
      <p class="surtitre" data-anime>${c.t('accueil.immobilier.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.immobilier.titre')}</h2>
    </div>
    <p data-anime>${c.t('accueil.immobilier.texte')} ${c.lien('immobilier', { classe: 'lien-fleche', texte: c.t('accueil.immobilier.lien') })}</p>
  </div>
  <div class="piste residences-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.immobilier.region')}" data-anime="cascade">
    ${c.donnees.residences.map((r, i) => html`<article class="residence" id="residence-${i + 1}">
      ${c.media({ nom: r.image, alt: r.alt, classe: 'residence-media', sizes: '(max-width: 760px) 78vw, 28vw' })}
      <p class="residence-legende">${c.t('accueil.immobilier.legende')}</p>
    </article>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="appel" id="appel">
  ${c.media({ nom: 'grok/appel-riviere', alt: c.s('accueil.appel.titre'), cadrage: '40% 50%', classe: 'appel-fond', sizes: '100vw', attrs: 'data-fx="parallaxe"' })}
  <div class="appel-ondes" aria-hidden="true" data-effet="ondes-appel"><span></span><span></span><span></span><span></span></div>
  <div class="appel-texte conteneur">
    <h2 data-anime="lignes">${c.t('accueil.appel.titre')}</h2>
    <p data-anime>${c.t('accueil.appel.texte')}</p>
    <p class="appel-actions" data-anime>
      ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--clair', texte: c.t('accueil.appel.rdv'), attrs: 'data-survol="magnetique"' })}
      <a class="bouton bouton--contour-clair" href="tel:${c.site.contact.telephoneLien}" data-survol="magnetique">${c.t('accueil.appel.appeler')}</a>
    </p>
  </div>
</section>
`;
