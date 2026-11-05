# Journal des versions

## v3 — 5 novembre 2026

Accueil réorganisé : environ 10 écrans au lieu de 17, plus aucune section qui bloque le défilement.

- **Ordre** : hero, six objectifs, pourquoi un conseiller, Nicolas Rabouan, quatre étapes, avis, investir dans la pierre, citation et rendez-vous.
- **Six objectifs** : une boussole interactive sur un seul écran. Au clic sur un objectif (bouton ou anneau), le repère y saute et la fiche change, avec un lien « Parler de cet objectif » vers le rendez-vous. Sans geste, les objectifs défilent seuls toutes les 5 secondes, avec un bouton Pause.
- **Pourquoi un conseiller** : la grande image laisse place à un chemin où un repère se pose à chaque raison lue ; les mots s'allument toujours à la lecture.
- **Avis** : sur téléphone, les cartes pendent à un fil et se font glisser du doigt (environ 1 écran au lieu de 2,5) ; elles se balancent selon la vitesse.
- **Investir dans la pierre** : bande à faire glisser (souris, doigt, flèches, clavier) au lieu de la galerie épinglée ; les cartes s'inclinent selon la vitesse, le curseur affiche « Glisser ».
- **Fin de page** : la citation de Bernanos et l'appel au rendez-vous réunis sur la rivière au matin.

## v2 — 4 novembre 2026

Animations et nouvelle ouverture de l'accueil.

- **Accueil, nouveau hero** : lever de soleil sur un bocage dans la brume, en plein cadre (deux nouvelles illustrations générées : paysage pour l'ordinateur, portrait pour le téléphone), rendu en WebGL. Le paysage se pose à l'ouverture, le repère tombe sur le soleil qui se lève, ses ondes courent sur la campagne. À la souris, le premier plan bouge plus que le lointain ; sous le curseur, une loupe révèle les courbes de niveau et le terrain se soulève ; au clic, l'image ondule ; au défilement, travelling vers le soleil. En-tête nuit pétrole, fondu dans l'image.
- **Accueil, ordre** : les six objectifs viennent juste après le hero, « Pourquoi faire appel à un conseiller » passe en troisième.
- **Contact** : la carte en courbes de niveau devient l'ouverture, désormais vivante (le relief se soulève sous la souris, chaque clic lâche une onde), avec le repère sur Le Mans et le numéro chiffre par chiffre.
- **Tout le site** : chaque clic lâche une onde du repère au point cliqué ; le curseur devient un petit repère qui se lève sur les liens et se pose au clic.

## v1 — 4 novembre 2026

Première version de la maquette, direction « Le repère ».

- **Pages** : accueil, Mon accompagnement, Qui suis-je, Immobilier, Contact, 404. Chaque page a sa propre ouverture.
- **Intro** : le repère du logo tombe sur son anneau d'ombre, trois ondes partent, la dernière ouvre la page (moins de 3 s, accélérée par un clic, passée par un second).
- **Accueil** : carte en courbes de niveau en WebGL où le repère se pose sur Le Mans ; raisons mot à mot ; six objectifs sur six anneaux dans une section épinglée ; déroulé en itinéraire ; citation de Bernanos raturée ; aperçu du portrait ; avis Google suspendus à des repères ; galerie des résidences Stellium ; appel final.
- **Pages intérieures** : fiches d'objectifs empilées et boussole des situations ; portrait en trame d'impression, frise du parcours et sceau de la charte ; plan de masse et vue éclatée d'un investissement immobilier ; numéro en très grand et formulaire de rendez-vous en quatre étapes avec récapitulatif.
- **Contenus** : textes, statuts, ORIAS, médiateurs et avis repris du site actuel ; informations manquantes marquées « à compléter », éléments déduits de la réglementation marqués « à valider ».
- **Images** : logo détouré et repère vectoriel, portrait et résidences du site actuel, 17 illustrations générées avec la mention « Illustration générée ».
- **Technique** : pages générées depuis `donnees/`, polices hébergées, mode calme, voile de transition, noindex, image de partage par page.
