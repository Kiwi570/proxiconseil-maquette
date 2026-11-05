/* Accueil : hero plein cadre, un lever de soleil sur le bocage (WebGL : relief à la souris, courbes de niveau
   révélées sous le curseur, onde au clic, travelling au défilement) où le repère du logo se pose sur le soleil ;
   six objectifs en boussole interactive (un écran), raisons mot à mot sur trois repères, portrait,
   déroulé en itinéraire, avis suspendus à des repères (fil à faire glisser sur téléphone), bande des résidences
   à faire glisser, citation raturée et appel final sur des ondes. Une section, au moins un effet au défilement. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'grok/hero-horizon-1280.webp' };

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
  <g class="anneaux-curseur"><circle class="anneaux-onde" r="14" fill="none"/><g class="anneaux-saut"><g class="anneaux-repere" transform="translate(-16 -46) scale(.25)">${brut('<path fill="currentColor" fill-rule="evenodd" d="M11.26 97.53A62.5 62.5 0 1 1 116.74 97.53L64 180.5ZM88 64A24 24 0 1 0 40 64A24 24 0 1 0 88 64Z"/>')}</g></g></g>
</svg>`;
}

export default (c) => html`
<section class="hero" id="debut" data-plein-ecran>
  <div class="hero-scene" data-effet="horizon-vivant" data-souris data-soleil="0.6413 0.445" data-soleil-mobile="0.6365 0.446" data-horizon="0.445">
    ${c.media({ nom: 'grok/hero-horizon', alt: c.s('accueil.hero.alt'), classe: 'hero-media', sizes: '100vw', priorite: true })}
    <canvas class="hero-gl" aria-hidden="true" data-audit-ignorer></canvas>
    <div class="hero-pose" aria-hidden="true">
      <span class="hero-onde"></span><span class="hero-onde"></span><span class="hero-onde"></span>
      ${repere('hero-repere', 'data-effet="repere-horizon"')}
    </div>
  </div>
  <div class="hero-texte conteneur">
    <div class="hero-titrage">
      <p class="surtitre" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
      <h1 class="hero-titre"><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne">${c.t('accueil.hero.titre1')}</span></span><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne">${c.t('accueil.hero.titre2')}</span></span><span class="ligne-masque"><span data-anime="gsap" class="hero-ligne"><em>${c.t('accueil.hero.titre3')}</em></span></span></h1>
    </div>
    <div class="hero-cote">
      <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
      <p class="hero-actions" data-anime="gsap">
        ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--clair', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
        <span class="hero-info" data-info-cle><strong>${c.t('accueil.hero.info')}</strong> <span>${c.t('accueil.hero.infoDetail')}</span></span>
      </p>
    </div>
  </div>
  <a class="hero-defiler" href="#objectifs" data-anime="gsap"><span>${c.t('accueil.hero.defiler')}</span></a>
</section>

<section class="objectifs" id="objectifs" data-objectifs>
  <div class="objectifs-grille conteneur">
    <div class="objectifs-tete">
      <p class="surtitre" data-anime>${c.t('accueil.objectifs.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.objectifs.titre')}</h2>
      <p data-anime>${c.t('accueil.objectifs.texte')}</p>
      <div class="objectifs-choix" role="group" aria-label="${c.s('accueil.objectifs.choix')}" data-anime="cascade">
        ${c.donnees.objectifs.map((o, i) => html`<button type="button" class="objectif-choix" data-objectif-choix="${i}" aria-controls="objectif-${o.cle}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span>${o.court || o.nom}</span><span class="objectif-choix-temps" aria-hidden="true"></span></button>`)}
      </div>
      <p class="objectifs-consigne"><span>${c.t('accueil.objectifs.consigne')}</span> <button type="button" class="objectifs-pause" data-objectifs-pause aria-pressed="false" data-pause="${c.s('accueil.objectifs.pause')}" data-lecture="${c.s('accueil.objectifs.lecture')}">${c.t('accueil.objectifs.pause')}</button></p>
    </div>
    <div class="objectifs-schema" data-visuel>${anneaux(c, c.donnees.objectifs)}</div>
    <ol class="objectifs-liste" aria-live="off">
      ${c.donnees.objectifs.map((o, i) => html`<li class="objectif${i === 0 ? ' actif' : ''}" data-i="${i}" id="objectif-${o.cle}">
        ${c.media({ nom: o.image, alt: o.alt, cadrage: o.cadrage, classe: 'objectif-media', sizes: '(max-width: 760px) 90vw, 30vw' })}
        <div class="objectif-texte"><span class="objectif-num">0${i + 1} / 06</span><h3>${o.nom}</h3><p>${o.texte}</p>${c.lien('contact', { ancre: 'rendez-vous', params: `sujet=${o.cle}`, classe: 'lien-fleche', texte: c.t('accueil.objectifs.parler') })}</div>
      </li>`)}
    </ol>
  </div>
  <p class="objectifs-pied conteneur"><span class="objectifs-risque">${c.t('commun.risque')}</span> ${c.lien('accompagnement', { classe: 'lien-fleche', texte: c.t('accueil.objectifs.lien') })}</p>
</section>

<section class="raisons" id="raisons">
  <div class="raisons-grille conteneur">
    <div class="raisons-tete">
      <p class="surtitre" data-anime>${c.t('accueil.raisons.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.raisons.titre')}</h2>
      <p class="raisons-note" data-anime><span class="a-valider">${c.t('accueil.raisons.aValider')}</span></p>
      <svg class="raisons-chemin" viewBox="0 0 480 170" aria-hidden="true" data-effet="reperes-raisons" data-visuel>
        <path class="raisons-trace-fond" d="M10 128 C 60 150, 70 104, 92 118 S 190 96, 240 106 S 340 140, 388 122 S 450 104, 470 116"/>
        <path class="raisons-trace" pathLength="1" d="M10 128 C 60 150, 70 104, 92 118 S 190 96, 240 106 S 340 140, 388 122 S 450 104, 470 116"/>
        ${[[92, 118], [240, 106], [388, 122]].map(([x, y], i) => html`<g class="raisons-repere" data-i="${i}" transform="translate(${x} ${y})"><ellipse class="raisons-ombre" rx="15" ry="5.5"/><g class="raisons-pin"><g transform="translate(-14 -40) scale(.22)">${brut('<path fill="currentColor" fill-rule="evenodd" d="M11.26 97.53A62.5 62.5 0 1 1 116.74 97.53L64 180.5ZM88 64A24 24 0 1 0 40 64A24 24 0 1 0 88 64Z"/>')}</g></g><text class="raisons-n" y="34" text-anchor="middle">0${i + 1}</text></g>`)}
      </svg>
    </div>
    <ol class="raisons-liste">
      <li data-i="0"><span class="raisons-num" aria-hidden="true">01</span><p class="manifeste" data-effet="manifeste">${c.t('accueil.raisons.r1')}</p></li>
      <li data-i="1"><span class="raisons-num" aria-hidden="true">02</span><p class="manifeste" data-effet="manifeste">${c.t('accueil.raisons.r2')}</p></li>
      <li data-i="2"><span class="raisons-num" aria-hidden="true">03</span><p class="manifeste" data-effet="manifeste">${c.t('accueil.raisons.r3')}</p></li>
    </ol>
  </div>
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

<section class="avis" id="avis">
  <div class="conteneur avis-tete">
    <p class="surtitre" data-anime>${c.t('accueil.avis.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('accueil.avis.titre')}</h2>
    <p data-anime>${c.t('accueil.avis.texte')}</p>
  </div>
  <ul class="avis-liste conteneur" data-effet="avis-epingles" data-visuel data-bande-mobile tabindex="0" aria-label="${c.s('accueil.avis.region')}">
    ${c.donnees.avis.map((a, i) => html`<li class="avis-carte" style="--i:${i}">${repere('avis-pin')}<div class="avis-corps"><blockquote><p>${a.texte}</p></blockquote><p class="avis-auteur">${a.auteur} <span>· ${c.t('accueil.avis.source')}</span></p></div></li>`)}
  </ul>
</section>

<section class="residences" id="immobilier">
  <div class="conteneur residences-tete">
    <div>
      <p class="surtitre" data-anime>${c.t('accueil.immobilier.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.immobilier.titre')}</h2>
    </div>
    <div class="residences-cote">
      <p data-anime>${c.t('accueil.immobilier.texte')} ${c.lien('immobilier', { classe: 'lien-fleche', texte: c.t('accueil.immobilier.lien') })}</p>
      <p class="residences-nav" data-anime><button type="button" class="residences-fleche" data-bande-precedent aria-label="${c.s('accueil.immobilier.precedent')}">←</button><button type="button" class="residences-fleche" data-bande-suivant aria-label="${c.s('accueil.immobilier.suivant')}">→</button></p>
    </div>
  </div>
  <div class="residences-piste" data-bande data-effet="bande-residences" data-curseur-libelle="${c.s('accueil.immobilier.glisser')}" tabindex="0" role="region" aria-label="${c.s('accueil.immobilier.region')}">
    ${c.donnees.residences.map((r, i) => html`<article class="residence" id="residence-${i + 1}">
      ${c.media({ nom: r.image, alt: r.alt, classe: 'residence-media', sizes: '(max-width: 760px) 78vw, 26vw' })}
      <p class="residence-legende">${c.t('accueil.immobilier.legende')}</p>
    </article>`)}
  </div>
  <div class="galerie-progres conteneur" aria-hidden="true"><span></span></div>
</section>

<section class="appel" id="appel">
  ${c.media({ nom: 'grok/appel-riviere', alt: c.s('accueil.appel.alt'), cadrage: '40% 50%', classe: 'appel-fond', sizes: '100vw', attrs: 'data-fx="parallaxe"' })}
  <div class="appel-ondes" aria-hidden="true" data-effet="ondes-appel"><span></span><span></span><span></span><span></span></div>
  <div class="appel-texte conteneur">
    <figure class="citation-texte" data-effet="rature-avenir">
      <p class="citation-faux" aria-hidden="true"><span class="citation-faux-texte">${c.t('accueil.citation.faux')}</span><svg class="citation-rature" viewBox="0 0 400 40" preserveAspectRatio="none"><path pathLength="1" d="M4 26 C 70 14, 130 30, 200 20 S 330 12, 396 22"/></svg></p>
      <blockquote class="citation-vrai"><p>${c.t('accueil.citation.vrai')}</p></blockquote>
      <figcaption class="citation-auteur">${c.t('accueil.citation.auteur')}</figcaption>
    </figure>
    <div class="appel-bloc">
      <h2 data-anime="lignes">${c.t('accueil.appel.titre')}</h2>
      <p data-anime>${c.t('accueil.appel.texte')}</p>
      <p class="appel-actions" data-anime>
        ${c.lien('contact', { ancre: 'rendez-vous', classe: 'bouton bouton--clair', texte: c.t('accueil.appel.rdv'), attrs: 'data-survol="magnetique"' })}
        <a class="bouton bouton--contour-clair" href="tel:${c.site.contact.telephoneLien}" data-survol="magnetique">${c.t('accueil.appel.appeler')}</a>
      </p>
    </div>
  </div>
</section>
`;
