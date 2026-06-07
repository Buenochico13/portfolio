# Portfolio OS

Prototype statique d'un portfolio premium inspire de macOS sur ordinateur et d'iOS sur mobile.

## Lancer le projet

Ouvrir `index.html` dans un navigateur. Aucun outil de build n'est necessaire.

Pour un serveur local :

```bash
python3 -m http.server 4174
```

## Fonctionnalites incluses

- Bureau macOS avec barre superieure, dock, applications, widgets et fenetres.
- Version mobile separee avec ecran verrouille, ecran d'accueil, dock et apps plein ecran.
- Applications de portfolio : Contacts, France Travail, Parcours, Photos, Safari, App Store, Plans, Mail, Calendrier et Reglages.
- WhatsApp ajoute pour recueillir des avis avec validation administrateur.
- Photos devient la galerie des missions/projets avec cartes et pages detail.
- France Travail devient une synthese des experiences professionnelles.
- Parcours devient Parcours+ avec chronologie scolaire premium.
- App Store presente les loisirs et passions avec fiches detail.
- Safari presente des astuces internes avec URL fictives personnalisables.
- Mail et Calendrier enregistrent les messages et demandes dans l'administration locale.
- Fenetres de bureau deplacables, superposables, minimisables et plein ecran.
- Mode admin depuis Reglages avec edition du profil, selection d'application, visibilite dock, ajout d'application et sauvegarde locale.
- Acces admin protege par code depuis Reglages. Code initial : `1234`.
- Back-office par onglets pour modifier le profil, les applications, les widgets, les experiences, le parcours, les projets, Safari, App Store, Plans, Mail, Calendrier et le code d'acces.
- Constructeur de theme par application : ajout de titres, textes, images, videos, import de fichiers, reglage de taille, position, couleur, gras, soulignement, surlignage et flou.
- Theme global par application : fond, bordures, rayon des coins et header personnalisable avec titre, sous-titre, image ou video.
- Le constructeur affiche aussi le contenu deja defini de l'application selectionnee afin de modifier le design en contexte.
- Les contenus deja definis peuvent etre selectionnes dans le constructeur pour regler couleur, taille de texte, largeur, hauteur, fond, bordures, gras et soulignement.
- La selection dans le constructeur preserve le scroll et le contexte de modification.
- Elements du constructeur deplacables librement dans une zone visuelle, redimensionnables a la souris, avec fond et bordures personnalisables.
- Widgets Notes, Horloge et Meteo administrables avec position, taille, couleurs et options. La meteo utilise Open-Meteo avec repli "Meteo indisponible".
- Disposition par defaut des widgets : Meteo, Horloge et Notes uniquement, avec position et taille administrables.
- Edition directe des contenus deja presents en mode edition visuelle : textes, titres, experiences France Travail, parcours, projets et autres contenus peuvent etre modifies directement dans les fenetres d'application.
- Persistance via `localStorage` pour simuler le futur back-office.

## Connexion Supabase

Le site contient maintenant une couche Supabase compatible avec le mode local.

1. Creer ou reactiver un projet Supabase.
2. Executer le fichier SQL [supabase/schema.sql](supabase/schema.sql) dans l'editeur SQL Supabase.
3. Dans le portfolio, ouvrir Reglages > Acces.
4. Renseigner :
   - URL Supabase
   - Cle anon publique
   - Activer Supabase = Oui
5. Cliquer sur Tester Supabase.
6. Cliquer sur Synchroniser vers Supabase.

Le site garde `localStorage` comme secours si Supabase n'est pas configure ou indisponible.

Tables prevues :

- `portfolio_settings` : profil, fonds, theme, options globales.
- `portfolio_apps` : nom, icone, couleur, contenu, positions desktop/mobile, dock, visibilite.
- `portfolio_widgets` : type, contenu, positions desktop/mobile, taille, visibilite.
- `portfolio_experiences` : entreprises, logos, periodes, activites, competences.
- `portfolio_missions_projects` : missions, projets, medias, videos, PDF, competences.
- `portfolio_education_timeline` : etapes scolaires, logos, medias, ordre.
- `portfolio_hobbies` : loisirs, categories, images, galeries, raisons.
- `portfolio_blog_articles` : astuces Safari, URL fictive, blocs texte/image/video/PDF.
- `portfolio_reviews` : avis WhatsApp, note, statut, moderation.
- `portfolio_contact_messages` : messages Mail, statut lu/non lu.
- `portfolio_appointments` : demandes Calendrier, statut et reprogrammation.
- `portfolio_media` : images, videos, PDF, logos et metadonnees.
- `portfolio_calendar_requests` : date, creneau, message, statut.

Le fichier SQL cree aussi `portfolio_state`, qui sauvegarde l'etat complet du portfolio pour garder une synchronisation simple avec ce prototype statique.

## Connexion GitHub

Le dossier est deja un repository Git local. Pour le relier a GitHub :

```bash
git add .
git commit -m "Initial Portfolio OS"
git branch -M main
git remote add origin https://github.com/VOTRE-UTILISATEUR/VOTRE-REPO.git
git push -u origin main
```

Si un remote existe deja, utiliser :

```bash
git remote set-url origin https://github.com/VOTRE-UTILISATEUR/VOTRE-REPO.git
git push -u origin main
```

Le projet est pret pour un hebergement Vercel en tant que site statique.
