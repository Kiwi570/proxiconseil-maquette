# Proxiconseil Patrimoine · maquette v4

Maquette de site pour **Nicolas Rabouan, Proxiconseil Patrimoine** (conseiller en investissements financiers, Le Mans).
Direction artistique « **Le repère** » : le repère du logo se pose sur le soleil d'un paysage de bocage (accueil)
et sur une carte en courbes de niveau (contact), et ses ondes deviennent les six objectifs du patrimoine. Papier calcaire, bleu pétrole du logo, nuit pétrole, laiton ; Fraunces et Manrope.

Site statique (HTML, CSS, JavaScript), prêt pour Vercel sans étape de construction. Maquette non indexée (noindex).

## Pages

| Page | Ouverture | Effets propres |
|---|---|---|
| Accueil `/` | Lever de soleil plein cadre (WebGL) : relief à la souris, courbes de niveau sous le curseur, onde au clic, travelling au défilement ; le repère tombe sur le soleil | horizon-vivant, repere-horizon, anneaux-objectifs (boussole interactive), manifeste, reperes-raisons, itineraire-etapes, avis-epingles (fil à faire glisser sur téléphone), bande-residences, rature-avenir, ondes-appel |
| Mon accompagnement `/accompagnement` | Nuit pétrole, centrée, six anneaux qui se lèvent comme un horizon | anneaux-horizon, planches, boussole, feuillets, tampon-orias |
| Qui suis-je `/qui-suis-je` | Scindée sur fond sable, portrait qui naît d'une trame d'impression (WebGL) | portrait-trame, manifeste, frise tracée, sceau |
| Immobilier `/immobilier` | Très grand titre, bandeau photo sous un plan de masse qui s'efface | plan-masse, vue-eclatee, mosaïque en rideaux |
| Contact `/contact` | Carte vivante en courbes de niveau (WebGL, relief sous la souris, onde au clic), le repère tombe sur Le Mans, numéro chiffre par chiffre | carte-courbes, repere-chute, numero-pose, formulaire en quatre étapes avec récapitulatif, schéma tracé |
| 404 | « Hors de la carte », le repère tombe à côté | repere-chute |

Pages du site actuel non reprises en v1 (disponibles en v2) : « Mes partenaires » (vide sur le site actuel), une page Avis dédiée.

## Travailler sur la maquette

- Textes : `donnees/textes/fr.json` ; données répétées : `donnees/*.json` (objectifs, avis, étapes, situations, résidences, couches).
- Pages : `source/pages/*.mjs` ; gabarit commun (en-tête, pied de page, intro, voile) : `source/gabarits/commun.mjs`.
- Style : `assets/css/site.css` ; effets : `assets/js/site.js` (intro et accueil), `pages.js` (pages intérieures), `horizon.js` (hero WebGL de l'accueil), `carte.js` (carte WebGL du contact), `trame.js` (portrait en trame), `ondes.js` (ondes au clic et teinte du curseur), `bande.js` (bandes à faire glisser).
- Générer les pages après toute modification : `node outils/generer.mjs` (ne jamais modifier les `.html` à la main).
- Audit : `node _audit/audit.mjs` (standard), `--complet` pour la version finale.
- Numéro de version des fichiers (`?v=N`) : champ `version` de `donnees/site.json`, à augmenter à chaque livraison.

## À fournir par le client (à compléter)

- **Mentions légales** complètes : éditeur (SARL Proxiconseil Patrimoine, RCS Le Mans 920 596 368, capital 5 000 €), directeur de publication, SIRET.
- **Hébergeur** : Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis (adresse vérifiée sur la politique de confidentialité de Vercel).
- **Politique de confidentialité** (RGPD) : usage des données du formulaire, cookies et mesure d'audience. Le site actuel indique « aucune donnée personnelle collectée » tout en utilisant Google Analytics et des cookies tiers : à corriger.
- **Médiateur de l'AMF** : le site actuel cite Marielle Cohen-Branche ; le médiateur est Rémi Bouchez depuis le 1er décembre 2025. La maquette indique « médiateur de l'AMF » sans nom.
- **Assurance de responsabilité civile professionnelle** et garantie financière, si elles doivent figurer.
- **Horaires** et **zone d'intervention** : absents du site actuel, marqués « à compléter » (aucun statut « ouvert » n'est affiché).
- **Parcours** : date de création de la SARL et dates des étapes.
- **Résidences Stellium** : nom et ville de chaque résidence.
- **Partenaires** : liste, si une page « Mes partenaires » est voulue.

## Points à valider par Nicolas Rabouan

- **Le mot « indépendant »** n'est pas employé : depuis MIF 2, un conseil en investissement dit indépendant ne peut être rémunéré que par ses clients. À reprendre seulement si son mode de rémunération le permet.
- **Le déroulé en quatre étapes** (entrée en relation, recueil de la situation, préconisations écrites, suivi) suit le cadre réglementaire des CIF ; il est marqué « à valider ».
- **Les couches d'un investissement immobilier** (emplacement, bien, gestion, fiscalité, revente) sont des repères généraux, marqués « à valider ».
- **La boussole** (situation → objectifs) est une orientation indicative, signalée comme telle.
- **Avis Google** : repris mot pour mot du site actuel (orthographe et émoticônes d'origine), sans les dates relatives (« il y a 14 jours »), qui deviendraient fausses. Un lien vers la fiche Google pourra être ajouté.
- **Formulations du site actuel** dans « Pourquoi faire appel à un conseiller patrimonial ? » : « le meilleur conseil », « sécuriser financièrement votre avenir », « dans les meilleures conditions ». Une communication de CIF doit rester claire, exacte et non trompeuse : ces superlatifs sont marqués « à valider ».
- **Voix** : le site parle à la première personne (« je »), comme le site actuel ; « ensemble » porte la relation.

## Crédits

- Illustrations générées (Grok) : `assets/images/grok/` — hero-horizon et hero-horizon-mobile (hero de l'accueil, ordinateur et téléphone), deroule-chemin, appel-riviere, objectif-epargne, objectif-tresorerie, objectif-immobilier, objectif-retraite, objectif-impots, objectif-transmission, pour-particuliers, pour-entreprises, carnet-bureau, immobilier-facade, contact-bocage, hors-carte. Chaque image porte la mention « Illustration générée » : **à garder sur le site final**.
- Photos du site actuel : portrait de Nicolas Rabouan, logo, cinq résidences commercialisées et livrées par Stellium Immobilier.
- Photos des résidences : étalonnage commun léger (un peu moins saturées, un peu plus chaudes) pour s'accorder à la palette.
- Polices : Fraunces et Manrope (licence SIL Open Font License, fichiers `assets/polices/OFL-*.txt`).
- GSAP (ScrollTrigger, SplitText), hébergé avec le site.

## À la mise en ligne définitive

- **Retirer** : `noindex` (balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`), formulaire simulé (le brancher sur un vrai envoi), mentions « à compléter » une fois remplies, mentions « à valider » une fois validées.
- **Affichage dans un autre site** : l'en-tête X-Frame-Options a été retiré de `vercel.json` pour que la maquette s'affiche dans un module Wix ; le remettre (`SAMEORIGIN`) si ce n'est plus utile.
- **Garder** : la mention « Illustration générée » sur les images créées par IA, les statuts et l'ORIAS, la mention de risque de perte en capital.
- Mettre l'adresse définitive du site dans `donnees/site.json` (`adresse`) et `donnees/structure.json`.

## Pistes pour la suite


- Remplacer deux ou trois illustrations par des scènes habitées, sans visage (un rendez-vous vu de dos, des mains qui feuillettent un carnet), et la chaise vide de la retraite par un paysage sarthois.
- Page « Mes partenaires » si Nicolas en fournit la liste ; page « Avis » avec lien vers la fiche Google.
- Photos réelles de Nicolas en rendez-vous, du bureau ou du Mans, qui remplaceraient les illustrations générées.
