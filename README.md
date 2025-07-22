# README - Déploiement du Site RMS Impact

Ce guide explique comment déployer le site web statique de RMS Impact en utilisant les services AWS S3 et CloudFront. Cette méthode est performante, sécurisée et économique.

**Domaine :** `rmsimpact.org` (géré par GoDaddy)
**Contact :** `contact@rmsimpact.org`

## Prérequis

1.  Un compte AWS.
2.  Le nom de domaine `rmsimpact.org` enregistré chez GoDaddy.
3.  Tous les fichiers du site web prêts à être téléversés.

## Étape 1 : Créer un Certificat SSL avec AWS Certificate Manager (ACM)

Pour que votre site soit sécurisé (HTTPS), il faut un certificat SSL.

1.  Ouvrez la console AWS et allez dans **Certificate Manager (ACM)**.
2.  **IMPORTANT :** Assurez-vous d'être dans la région **USA Est (Virginie du Nord) us-east-1**. C'est une exigence de CloudFront.
3.  Cliquez sur **"Demander un certificat"** et choisissez **"Demander un certificat public"**.
4.  Entrez les noms de domaine :
    * `rmsimpact.org`
    * `*.rmsimpact.org` (pour couvrir tous les sous-domaines comme `www`)
5.  Choisissez la **"Validation DNS"** comme méthode de validation. C'est la plus simple.
6.  AWS vous fournira des enregistrements **CNAME** à ajouter à votre configuration DNS chez GoDaddy.
7.  Connectez-vous à votre compte **GoDaddy**, allez dans la gestion DNS de `rmsimpact.org` et ajoutez les enregistrements CNAME fournis par AWS.
8.  Attendez quelques minutes (parfois jusqu'à 30 minutes) qu'AWS valide la propriété du domaine. Le statut du certificat passera à **"Délivré"**.

## Étape 2 : Créer un Bucket S3 pour héberger les fichiers

Le bucket S3 stockera tous vos fichiers HTML, CSS, JS et images.

1.  Dans la console AWS, allez dans le service **S3**.
2.  Cliquez sur **"Créer un bucket"**.
3.  **Nom du bucket :** Il est recommandé d'utiliser le nom de domaine, par exemple `rmsimpact-website-files`. Le nom doit être unique globalement.
4.  **Région AWS :** Choisissez une région proche de votre public cible (par ex., `eu-west-3` pour Paris).
5.  **Bloquer tout accès public :** Laissez cette option **cochée**. L'accès se fera via CloudFront, pas directement via S3, ce qui est plus sécurisé.
6.  Cliquez sur **"Créer le bucket"**.
7.  Une fois créé, sélectionnez votre bucket et cliquez sur **"Charger"**. Téléversez toute l'arborescence de votre site (fichiers et dossiers).

## Étape 3 : Configurer CloudFront pour la Distribution de Contenu

CloudFront est le CDN (Content Delivery Network) d'AWS. Il va distribuer votre site rapidement et de manière sécurisée.

1.  Allez dans le service **CloudFront** sur la console AWS.
2.  Cliquez sur **"Créer une distribution"**.
3.  **Origine :** Dans le champ "Domaine d'origine", sélectionnez le bucket S3 que vous venez de créer.
4.  **S3 bucket access :**
    * Sélectionnez **"Yes, use OAI (Origin Access Identity)"**.
    * Cliquez sur **"Create new OAI"** et donnez-lui un nom.
    * Choisissez **"Yes, update the bucket policy"**. AWS mettra automatiquement à jour la politique de votre bucket S3 pour autoriser CloudFront à y accéder.
5.  **Default cache behavior :**
    * **Viewer protocol policy :** Sélectionnez **"Redirect HTTP to HTTPS"** pour forcer l'utilisation du SSL.
6.  **Settings :**
    * **Alternate domain name (CNAME) :** Ajoutez `rmsimpact.org` et `www.rmsimpact.org`.
    * **Custom SSL certificate :** Sélectionnez le certificat que vous avez créé à l'étape 1.
    * **Default root object :** Entrez `index.html`. Cela indique à CloudFront quel fichier charger lorsque quelqu'un visite la racine de votre domaine.
7.  Cliquez sur **"Create distribution"**. Le déploiement peut prendre environ 15 minutes.

## Étape 4 : Mettre à jour les DNS chez GoDaddy

La dernière étape consiste à faire pointer votre nom de domaine vers la distribution CloudFront.

1.  Dans la console CloudFront, sélectionnez votre distribution. Copiez le **"Nom de domaine de la distribution"** (ex: `d12345abcdef.cloudfront.net`).
2.  Retournez sur votre compte **GoDaddy** dans la gestion DNS pour `rmsimpact.org`.
3.  Modifiez (ou créez) l'enregistrement `CNAME` pour `www` :
    * **Type :** CNAME
    * **Nom :** `www`
    * **Valeur :** Collez le nom de domaine de votre distribution CloudFront.
4.  Pour le domaine racine (`rmsimpact.org`), GoDaddy ne permet pas toujours d'utiliser un CNAME. Vous devrez utiliser la **"Redirection"** :
    * Configurez une redirection permanente (301) de `http://rmsimpact.org` vers `https://www.rmsimpact.org`.

Attendez la propagation des DNS (cela peut prendre de quelques minutes à quelques heures). Une fois terminé, votre site `https://www.rmsimpact.org` sera en ligne, sécurisé et servi via CloudFront.# rmsimpact-website
