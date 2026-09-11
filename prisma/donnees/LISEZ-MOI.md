# Injecter ses informations dans le portfolio

Trois temps : **saisir** dans le formulaire, **essayer à blanc**, **injecter**.

## 1. Répondre au questionnaire

Ouvrir `formulaire.html` dans un navigateur (double-clic). Il pose une question
à la fois, fonctionne hors ligne et n'envoie rien sur le réseau.

- Environ quarante questions, en quinze chapitres : toi, te joindre, images
  et CV, tes chiffres, puis une rubrique par contenu du site (réseaux,
  services, compétences, parcours, projets, publications, blog, FAQ,
  témoignages), et enfin les sections à afficher.
- Les listes se remplissent comme un entretien : « Parle-moi d'un projet… »,
  puis « As-tu un autre projet à présenter ? ».
- Tes réponses sont gardées dans le navigateur au fil de l'eau : tu peux
  fermer l'onglet et reprendre plus tard. « Sommaire », en haut, permet de
  revenir à n'importe quel chapitre.
- Entrée valide une réponse ; les touches A, B, C choisissent une option.
- **Images** : dépose les fichiers dans `public/` (par exemple
  `public/images/moi.png`) et indique le chemin `/images/moi.png`. Une URL
  `https://` fonctionne aussi. Tu peux aussi les ajouter plus tard depuis
  l'admin.

Pour chaque rubrique de liste, la première question propose trois réponses :

| Réponse | Effet de l'injection |
| --- | --- |
| « Oui… » | la rubrique en base est remplacée par tes réponses |
| « Non » | la rubrique en base est **vidée** |
| « Garder ceux déjà en ligne » | la rubrique en base n'est **pas touchée** |

Une rubrique à laquelle tu n'as pas répondu n'est pas touchée non plus.

Les témoignages de démonstration actuellement en base (Awa Koné, Jean Dupont)
sont fictifs : répondre « Non » à la question des témoignages les retire.

Le **récapitulatif** final reprend toutes tes réponses, avec un lien
« Modifier » vers chaque question. Quand tout est valide, télécharge
`mes-infos.json`. « Reprendre depuis un fichier » recharge un fichier déjà
téléchargé pour le corriger.

## 2. Essayer à blanc

Placer le fichier dans ce dossier, sous ce nom exact :

```
prisma/donnees/mes-infos.json
```

Puis :

```bash
npm run db:injecter:simulation
```

La simulation exécute **réellement** toutes les écritures, contraintes de la
base comprises, puis annule la transaction. Elle affiche, section par section,
le nombre d'entrées avant et après. Rien n'est modifié.

Un fichier ailleurs sur le disque s'utilise sans le déplacer :

```bash
npm run db:injecter:simulation -- --fichier C:\Users\HP\Downloads\mes-infos.json
```

## 3. Injecter

```bash
npm run db:injecter
```

Toutes les écritures ont lieu dans une seule transaction : en cas d'erreur, la
base reste telle qu'elle était. `npm run db:seed` fait la même chose (c'est la
commande que Prisma lance aussi après `prisma migrate reset`).

## Ce que le seed fait, précisément

- **Source** : `--fichier` s'il est fourni, sinon `mes-infos.json`, sinon
  `exemple.json`.
- **Avec un fichier personnel**, il fait autorité : le profil est écrasé, les
  réglages sont mis à jour clé par clé, et chaque section présente remplace
  celle de la base.
- **Avec l'exemple**, il ne remplit que les sections vides. Relancer une
  migration sur une base déjà renseignée n'écrase donc jamais un contenu saisi
  dans le back-office.
- **Jamais touchés** : messages de contact, statistiques de visite,
  médiathèque, mot de passe administrateur.
- **Validation** : chaque entrée passe par les mêmes schémas que le
  back-office (`src/lib/validations.ts`). Les liens sont en plus restreints à
  `https://`, `http://` ou un chemin local — `javascript:`, `data:` ou
  `//autre-site` sont refusés.
- **Textes** : le contenu des articles et la présentation détaillée des
  projets sont saisis en texte simple (une ligne vide sépare deux
  paragraphes) et convertis au format du back-office.

## Confidentialité

`mes-infos.json` contient votre e-mail et votre téléphone : il est exclu de Git
(`.gitignore`) pour ne pas finir dans un dépôt public. Seul `exemple.json`, qui
ne contient que des données fictives, est versionné.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `formulaire.html` | le questionnaire |
| `schema.ts` | le format du fichier, validé par le seed |
| `exemple.json` | un fichier complet de démonstration |
| `mes-infos.json` | vos informations — non versionné |
| `../seed.ts` | l'injection en base |
