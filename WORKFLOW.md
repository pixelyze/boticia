# Boticia — Guide du Dashboard Admin

## Pipeline des devis

Chaque demande de devis passe par ces statuts :

| Statut | Signification | Email envoyé ? |
|--------|--------------|----------------|
| **Nouveau** | Demande reçue, pas encore traitée | Email admin (Laëtitia) |
| **Contacté** | Premier échange / RDV programmé | Non |
| **Moodboard envoyé** | Moodboard livré au client | Email client |
| **Devis envoyé** | Proposition formelle envoyée | Email client |
| **Signé** | Contrat validé | Non |
| **Terminé** | Prestation réalisée | Non |
| **Annulé** | Abandonné | Non |

---

## Étape 1 — Un client soumet une demande

**Ce qui se passe :**
1. Le client remplit le formulaire sur `/mariages`, `/evenements` ou `/ateliers`
2. Une ligne est créée dans la base de données (statut : "nouveau")
3. Un **email est envoyé à laetitia@boticia.fr** avec les détails (nom, email, téléphone, type d'événement, date souhaitée) et un lien direct vers la fiche dans le dashboard

**Ce que le client voit :** Une page de confirmation. Pas d'email de confirmation à ce stade.

**Ce que l'admin voit :** Le devis apparaît dans le pipeline (badge jaune "Nouveau").

---

## Étape 2 — Ouvrir la fiche d'un devis

L'admin clique sur un devis dans la liste. La page s'ouvre en **vue Copilot** :
- Message contextuel animé selon le statut + date RDV + urgence
- Actions suggérées (programmer un RDV, envoyer un moodboard, etc.)

L'admin peut basculer en **vue Projet** pour accéder à tous les outils.

---

## Étape 3 — Programmer un rendez-vous

**Action :** Cliquer sur la ligne RDV dans le panneau projet → choisir date et heure.

**Ce qui se passe :**
- La date et l'heure sont enregistrées dans la base
- L'historique note "RDV programmé"
- Aucun email n'est envoyé au client

---

## Étape 4 — Changer le statut

**Action :** Cliquer sur la ligne statut → choisir le nouveau statut.

Le statut peut être changé librement (pas d'ordre imposé). Deux statuts déclenchent automatiquement un email (voir étapes 6 et 8).

L'admin peut aussi glisser-déposer les cartes en vue Kanban.

---

## Étape 5 — Activer l'espace client

**Action :** Activer le toggle "Espace client" dans le panneau projet.

**Ce qui se passe :**
- L'espace client est activé pour ce devis
- L'admin peut ensuite envoyer un **lien magique** (magic link) au client par email
- Le client clique le lien → accède à `/mon-projet` avec sa fiche projet, sa timeline et ses documents

---

## Étape 6 — Créer et envoyer le moodboard

### 6a. Ajouter du contenu au moodboard

**Action :** Cliquer sur le `+` dans la section Moodboard → uploader des images/PDF ou ajouter des liens externes.

L'admin peut aussi ajouter une **note personnelle** qui apparaîtra en haut du moodboard côté client.

### 6b. Envoyer le moodboard

**Action :** Cliquer "Envoyer le moodboard".

**Ce qui se passe :**
1. Le statut passe à **"Moodboard envoyé"**
2. Un **email est envoyé au client** :
   - Objet : *"Votre moodboard floral est prêt — Boticia"*
   - Contenu : message + bouton vers `/mon-projet/moodboard`
3. Le bouton devient vert "Moodboard envoyé" (désactivé)

**Ce que le client voit :** Email de notification. Sur `/mon-projet/moodboard`, il voit toutes les images, PDF et liens avec la note personnelle de l'admin.

---

## Étape 7 — Uploader une proposition (devis)

**Action :** Cliquer sur le `+` dans la section Devis → uploader un PDF.

Le fichier est stocké et apparaît dans la mini-liste des propositions. L'admin peut supprimer une proposition avec le bouton `×`.

---

## Étape 8 — Envoyer la proposition

**Action :** Cliquer "Envoyer le devis".

**Ce qui se passe :**
1. Le statut passe à **"Devis envoyé"**
2. Un **email est envoyé au client** :
   - Objet : *"Votre devis floral est disponible — Boticia"*
   - Contenu : message + bouton vers `/mon-projet/proposition`
3. Le bouton devient vert "Devis envoyé" (désactivé)

**Ce que le client voit :** Email de notification. Sur `/mon-projet/proposition`, il voit le devis et peut :
- **Accepter** → le statut de la proposition passe à "accepté"
- **Demander une révision** → il peut laisser un commentaire

---

## Étape 9 — Signature et finalisation

**Action :** L'admin change manuellement le statut en "Signé" puis "Terminé".

Aucun email automatique n'est envoyé à ces étapes.

---

## Historique (Timeline)

Toutes les actions significatives sont enregistrées dans la timeline à droite :

| Action | Automatique ? |
|--------|--------------|
| Changement de statut | Oui |
| RDV programmé | Oui |
| Portail activé/désactivé | Oui |
| Moodboard ajouté | Oui |
| Proposition créée | Oui |
| Note libre | Manuel (l'admin écrit un commentaire) |

Les notes sont modifiables et supprimables. Le reste de l'historique est en lecture seule.

---

## Récapitulatif des emails automatiques

| Moment | Destinataire | Objet |
|--------|-------------|-------|
| Nouvelle demande de devis | **Admin** (laetitia@boticia.fr) | "Nouvelle demande de [Nom] — Boticia" |
| Envoi du moodboard | **Client** | "Votre moodboard floral est prêt — Boticia" |
| Envoi du devis | **Client** | "Votre devis floral est disponible — Boticia" |

Tous les emails utilisent le template MJML `welcome` avec le logo Boticia, un message personnalisé et un bouton CTA.

- **En production** : envoyés via Resend (domaine `boticia.fr`)
- **En développement** : envoyés via Mailpit (consultable sur `http://localhost:54324`)
