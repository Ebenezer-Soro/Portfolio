# Injecter ses informations dans le portfolio

Trois temps : **saisir** dans le formulaire, **essayer à blanc**, **injecter**.

## 1. Saisir

Ouvrir `formulaire.html` dans un navigateur (double-clic). Il fonctionne hors
ligne et n'envoie rien sur le réseau.

- Identité, réglages du site, puis une section par type de contenu : réseaux,
  services, compétences, parcours, projets, publications, articles, FAQ,
  témoignages.
- La saisie est gardée dans le navigateur au fil de l'eau : on peut fermer
  l'onglet et revenir plus tard. « Effacer le brouillon » la supprime.
- **Images** : déposer les fichiers dans `public/` (par exemple
  `public/images/moi.png`) et saisir le chemin `/images/moi.png`. Une URL
  `https://` fonctionne aussi.
- **Importer un fichier** recharge un export précédent pour le corriger, ou
  `exemple.json` pour voir un formulaire rempli.

Chaque section de liste porte une case **« Remplacer cette section en base »** :

| Case | Liste | Effet de l'injection |
| --- | --- | --- |
| cochée | remplie | la section en base est remplacée par la liste |
| cochée | vide | la section en base est **vidée** |
| décochée | — | la section en base n'est **pas touchée** |

Les témoignages de démonstration actuellement en base (Awa Koné, Jean Dupont)
sont fictifs : laisser la section cochée, même vide, les retire.

« Vérifier et exporter » liste les problèmes éventuels ; chaque ligne mène au
champ concerné. Une fois tout valide, télécharger `mes-infos.json`.

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
| `formulaire.html` | le formulaire de saisie |
| `schema.ts` | le format du fichier, validé par le seed |
| `exemple.json` | un fichier complet de démonstration |
| `mes-infos.json` | vos informations — non versionné |
| `../seed.ts` | l'injection en base |
