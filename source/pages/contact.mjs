/* Contact. Ouverture : la carte vivante en courbes de niveau (WebGL : relief sous la souris, onde au clic),
   le repère qui tombe sur Le Mans, le numéro de téléphone chiffre par chiffre. Formulaire simulé en quatre étapes avec
   récapitulatif en direct, puis schéma Saint-Pavace / Le Mans et bandeau de bocage. */
import { html, brut } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'carte-courbes.webp' };

export default (c) => {
  const f = (k) => c.t(`contact.formulaire.${k}`);
  const k = c.site.contact;
  const chiffres = k.telephone.split('');
  return html`
<section class="ct-tete" id="debut">
  <div class="carte-vivante" aria-hidden="true" data-effet="carte-courbes" data-souris>
    <img class="carte-vivante-image" src="/assets/images/carte-courbes.webp" alt="" width="1600" height="1000" fetchpriority="high" loading="eager" decoding="async" data-audit-ignorer>
    <canvas class="carte-vivante-gl" data-audit-ignorer></canvas>
  </div>
  <div class="carte-pose" aria-hidden="true">
    <span class="carte-onde"></span><span class="carte-onde"></span>
    ${repere('carte-repere', 'data-effet="repere-chute"')}
    <span class="carte-lieu">${c.t('contact.carte.leMans')}</span>
  </div>
  <div class="conteneur ct-tete-grille">
    <div class="ct-tete-texte">
      <p class="surtitre" data-anime="gsap">${c.t('contact.tete.surtitre')}</p>
      <h1 class="ct-titre" data-anime="gsap">${c.t('contact.tete.titre')}</h1>
      <p class="ct-numero" data-effet="numero-pose"><a href="tel:${k.telephoneLien}" data-info-cle aria-label="${c.s('commun.appeler')} ${k.telephone}">${chiffres.map((ch) => (ch === ' ' ? brut('<span class="ct-espace"> </span>') : html`<span class="ct-chiffre"><span>${ch}</span></span>`))}</a></p>
      <p class="ct-intro" data-anime="gsap">${c.t('contact.tete.texte')}</p>
      <ul class="ct-coord" data-anime="gsap">
        <li><a href="mailto:${k.email}">${k.email}</a></li>
        <li>${c.t('contact.tete.adresse')}</li>
        <li class="ct-horaires">${c.t('contact.tete.horaires')}</li>
      </ul>
      <p data-anime="gsap"><a class="bouton" href="#rendez-vous" data-action-principale>${f('titre')}</a></p>
    </div>
  </div>
  <p class="carte-coordonnees" data-anime="gsap"><span>${c.t('accueil.hero.coordonnees')}</span></p>
</section>

<section class="rdv conteneur" id="rendez-vous">
  <div class="rdv-tete">
    <h2 data-anime="lignes">${f('titre')}</h2>
    <p data-anime>${f('deroule')}</p>
  </div>
  <div class="rdv-grille">
    <form class="rdv-form" data-formulaire data-etapes action="#" novalidate>
      <p class="rdv-progres" aria-live="polite"><span data-etape-libelle>${f('etape')} 1 ${f('sur')} 4 · ${f('e1')}</span><span class="rdv-barre" aria-hidden="true"><span></span></span></p>
      <div class="rdv-etapes">
        <fieldset class="rdv-etape" data-etape="1" data-titre="${c.s('contact.formulaire.e1')}">
          <legend>${f('e1')}</legend>
          <p class="rdv-aide">${f('e1Aide')}</p>
          <div class="rdv-choix">
            ${c.donnees.objectifs.map((o, i) => html`<label class="choix"><input type="radio" name="sujet" value="${o.cle}"><span>${o.nom}</span></label>`)}
            <label class="choix"><input type="radio" name="sujet" value="autre"><span>${f('autre')}</span></label>
          </div>
        </fieldset>
        <fieldset class="rdv-etape" data-etape="2" data-titre="${c.s('contact.formulaire.e2')}" hidden>
          <legend>${f('e2')}</legend>
          <div class="rdv-choix">
            <label class="choix"><input type="radio" name="situation" value="prive"><span>${f('particulier')}</span></label>
            <label class="choix"><input type="radio" name="situation" value="pro"><span>${f('professionnel')}</span></label>
          </div>
          <div class="champ"><label for="f-projet">${f('projet')}</label><textarea id="f-projet" name="projet" rows="4"></textarea></div>
        </fieldset>
        <fieldset class="rdv-etape" data-etape="3" data-titre="${c.s('contact.formulaire.e3')}" hidden>
          <legend>${f('e3')}</legend>
          <p class="rdv-aide">${f('e3Aide')}</p>
          <div class="rdv-choix">
            <label class="choix"><input type="radio" name="dispo" value="matin"><span>${f('matin')}</span></label>
            <label class="choix"><input type="radio" name="dispo" value="midi"><span>${f('midi')}</span></label>
            <label class="choix"><input type="radio" name="dispo" value="soir"><span>${f('soir')}</span></label>
          </div>
          <p class="rdv-aide">${f('moyen')}</p>
          <div class="rdv-choix">
            <label class="choix"><input type="radio" name="moyen" value="tel"><span>${f('parTel')}</span></label>
            <label class="choix"><input type="radio" name="moyen" value="email"><span>${f('parEmail')}</span></label>
          </div>
        </fieldset>
        <fieldset class="rdv-etape" data-etape="4" data-titre="${c.s('contact.formulaire.e4')}" hidden>
          <legend>${f('e4')}</legend>
          <div class="champ"><label for="f-nom">${f('nom')}</label><input id="f-nom" name="nom" autocomplete="name" required></div>
          <div class="champ"><label for="f-tel">${f('tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel" required></div>
          <div class="champ"><label for="f-email">${f('email')}</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
          <div class="champ champ--case"><label class="case" for="f-accord"><input id="f-accord" name="accord" type="checkbox" required> <span>${f('accord')}</span></label></div>
          <p class="mention-donnees">${f('donnees')}</p>
        </fieldset>
      </div>
      <div class="rdv-nav">
        <button type="button" class="bouton bouton--contour" data-precedent hidden>${f('precedent')}</button>
        <button type="button" class="bouton" data-suivant>${f('suivant')}</button>
        <button type="submit" class="bouton" data-envoyer hidden>${f('envoyer')}</button>
      </div>
      <p data-message-envoi data-texte="${c.s('contact.formulaire.envoye')}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="rdv-recap" aria-label="${c.s('contact.formulaire.recap')}" data-visuel>
      ${repere('rdv-recap-repere')}
      <p class="rdv-recap-titre">${f('recap')}</p>
      <dl>
        <div><dt>${f('recapObjectif')}</dt><dd data-recap="sujet">—</dd></div>
        <div><dt>${f('recapSituation')}</dt><dd data-recap="situation">—</dd></div>
        <div><dt>${f('recapDispo')}</dt><dd data-recap="dispo">—</dd></div>
        <div><dt>${f('recapContact')}</dt><dd data-recap="moyen">—</dd></div>
      </dl>
      <p class="rdv-recap-tel"><a href="tel:${k.telephoneLien}">${k.telephone}</a></p>
    </aside>
  </div>
</section>

<section class="ct-carte" id="carte">
  <div class="conteneur ct-carte-grille">
    <div>
      <h2 data-anime="lignes">${c.t('contact.carte.titre')}</h2>
      <p data-anime>${c.t('contact.carte.texte')}</p>
    </div>
    <figure class="schema" role="img" aria-label="${c.s('contact.carte.alt')}">
      <svg viewBox="0 0 420 320" data-fx="trace" aria-hidden="true">
        <path class="schema-riviere" data-fx-trait d="M190 0 C 205 50, 240 80, 228 128 S 170 200, 196 250 S 250 300, 236 320"/>
        <circle class="schema-ville" cx="214" cy="188" r="26" data-repere/>
        <circle class="schema-point" cx="214" cy="188" r="5" data-superpose/>
        <circle class="schema-point schema-point--cabinet" cx="248" cy="96" r="6" data-repere/>
        <text class="schema-nom" x="246" y="214">${c.t('contact.carte.leMans')}</text>
        <text class="schema-nom schema-nom--cabinet" x="264" y="92">${c.t('contact.carte.saintPavace')}</text>
        <text class="schema-riv" x="120" y="40">${c.t('contact.carte.riviere')}</text>
        <path class="schema-nord" d="M380 40 L388 62 L380 56 L372 62 Z"/><text class="schema-petit" x="380" y="32" text-anchor="middle">N</text>
      </svg>
      <figcaption>${c.t('contact.carte.echelle')}</figcaption>
    </figure>
  </div>
  ${c.media({ nom: 'grok/contact-bocage', alt: c.s('contact.carte.bandeauAlt'), cadrage: '50% 55%', classe: 'ct-bandeau', sizes: '100vw', attrs: 'data-fx="parallaxe"' })}
</section>
`;
};
