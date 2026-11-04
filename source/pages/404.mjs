/* 404 « Hors de la carte » : le repère tombe à côté de la carte. */
import { html } from '../../outils/gabarit.mjs';
import { repere } from '../gabarits/commun.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="introuvable" id="debut">
  ${c.media({ nom: 'grok/hors-carte', alt: c.s('introuvable.alt'), cadrage: '50% 60%', priorite: true, classe: 'introuvable-fond', sizes: '100vw', attrs: 'data-fx="zoom"' })}
  <div class="introuvable-texte conteneur">
    <div class="introuvable-scene" aria-hidden="true">${repere('introuvable-repere', 'data-effet="repere-chute"')}</div>
    <h1 data-anime="lignes">${c.t('introuvable.titre')}</h1>
    <p data-anime>${c.t('introuvable.texte')}</p>
    <p data-anime>${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })} <span class="introuvable-info" data-info-cle>06 63 47 91 22</span></p>
  </div>
</section>
`;
