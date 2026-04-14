# Le Guichet — Documentation API pour le front React

## Informations générales

| Clé | Valeur |
|-----|--------|
| Base URL | `http://localhost:8000/api` |
| Format | JSON |
| Auth | Bearer Token (Laravel Sanctum) |

Toutes les requêtes et réponses sont en **JSON**.  
Pour les routes protégées, ajouter le header :
```
Authorization: Bearer <token>
```

---

## Authentification

### Inscription

```
POST /api/register
```

**Body :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse",
  "password_confirmation": "motdepasse"
}
```

**Réponse 201 :**
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "user"
  },
  "token": "1|abc123..."
}
```

---

### Connexion

```
POST /api/login
```

**Body :**
```json
{
  "email": "jean@example.com",
  "password": "motdepasse"
}
```

**Réponse 200 :**
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "user"
  },
  "token": "2|xyz456..."
}
```

> Stocker le `token` et le `role` (ex : localStorage ou context React).  
> Si `role === "admin"`, afficher les interfaces d'administration.

---

### Déconnexion

```
POST /api/logout
```
**Header requis :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{ "message": "Déconnecté avec succès." }
```

---

### Utilisateur connecté

```
GET /api/me
```
**Header requis :** `Authorization: Bearer <token>`

**Réponse 200 :**
```json
{
  "id": 1,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "role": "user"
}
```

---

## Clubs

### Liste tous les clubs

```
GET /api/clubs
```
**Public — aucun header requis.**

**Réponse 200 :**
```json
[
  { "id": 1, "nom": "Paris Saint-Germain", "ville": "Paris", "logo": "https://..." },
  { "id": 2, "nom": "Olympique de Marseille", "ville": "Marseille", "logo": "https://..." }
]
```

---

## Matchs

### Liste tous les matchs

```
GET /api/matchs
```
**Public.**

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "date_match": "2026-04-20T15:00:00.000000Z",
    "statut": "programme",
    "club_domicile": { "id": 1, "nom": "PSG", "ville": "Paris", "logo": "..." },
    "club_exterieur": { "id": 2, "nom": "OM", "ville": "Marseille", "logo": "..." },
    "stade": { "id": 1, "nom": "Parc des Princes", "ville": "Paris", "capacite": 48000 }
  }
]
```

---

### Détail d'un match (avec tribunes)

```
GET /api/matchs/{id}
```
**Public.**

**Réponse 200 :**
```json
{
  "id": 1,
  "date_match": "2026-04-20T15:00:00.000000Z",
  "statut": "programme",
  "club_domicile": { "id": 1, "nom": "PSG", "logo": "..." },
  "club_exterieur": { "id": 2, "nom": "OM", "logo": "..." },
  "stade": {
    "id": 1,
    "nom": "Parc des Princes",
    "capacite": 48000,
    "tribunes": [
      { "id": 1, "nom": "Tribune Nord", "capacite": 5000, "prix": 25.00 },
      { "id": 2, "nom": "Tribune VIP",  "capacite": 1000, "prix": 120.00 }
    ]
  }
}
```

---

## Tribunes d'un match

```
GET /api/tribunes/{match_id}
```
**Public.**

**Réponse 200 :**
```json
[
  { "id": 1, "nom": "Tribune Nord", "capacite": 5000, "prix": 25.00,  "stade_id": 1 },
  { "id": 2, "nom": "Tribune VIP",  "capacite": 1000, "prix": 120.00, "stade_id": 1 }
]
```

---

## Réservations

> Toutes les routes suivantes nécessitent `Authorization: Bearer <token>`.

### Mes réservations

```
GET /api/reservations
```

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "nb_places": 2,
    "statut": "confirmee",
    "tribune": { "id": 1, "nom": "Tribune Nord", "prix": 25.00 },
    "match": {
      "id": 1,
      "date_match": "2026-04-20T15:00:00.000000Z",
      "club_domicile": { "nom": "PSG" },
      "club_exterieur": { "nom": "OM" }
    }
  }
]
```

---

### Créer une réservation

```
POST /api/reservations
```

**Body :**
```json
{
  "match_id": 1,
  "tribune_id": 1,
  "nb_places": 2
}
```

**Réponse 201 :**
```json
{
  "id": 1,
  "user_id": 1,
  "match_id": 1,
  "tribune_id": 1,
  "nb_places": 2,
  "statut": "confirmee"
}
```

**Contraintes :**
- `nb_places` : entre 1 et 10

---

### Annuler une réservation

```
DELETE /api/reservations/{id}
```

**Réponse 200 :**
```json
{ "message": "Réservation annulée." }
```

> La réservation passe en `statut: "annulee"`, elle n'est pas supprimée.

---

## Routes Admin

> Nécessitent `Authorization: Bearer <token>` d'un compte avec `role: "admin"`.

| Méthode | URL | Action |
|---------|-----|--------|
| `POST` | `/api/admin/clubs` | Créer un club |
| `PUT` | `/api/admin/clubs/{id}` | Modifier un club |
| `DELETE` | `/api/admin/clubs/{id}` | Supprimer un club |
| `POST` | `/api/admin/matchs` | Créer un match |
| `PUT` | `/api/admin/matchs/{id}` | Modifier un match |
| `DELETE` | `/api/admin/matchs/{id}` | Supprimer un match |
| `POST` | `/api/admin/matchs/sync` | Sync matchs depuis API-Football |
| `POST` | `/api/admin/tribunes` | Créer une tribune |
| `PUT` | `/api/admin/tribunes/{id}` | Modifier une tribune |
| `DELETE` | `/api/admin/tribunes/{id}` | Supprimer une tribune |

### Exemple — Créer un match (admin)

```
POST /api/admin/matchs
```

**Body :**
```json
{
  "club_domicile_id": 1,
  "club_exterieur_id": 2,
  "stade_id": 1,
  "date_match": "2026-04-20 15:00:00"
}
```

---

## Gestion des erreurs

| Code | Signification |
|------|---------------|
| `200` | OK |
| `201` | Créé avec succès |
| `401` | Non authentifié (token manquant ou invalide) |
| `403` | Accès refusé (pas admin) |
| `404` | Ressource introuvable |
| `422` | Erreur de validation |

**Exemple d'erreur 422 :**
```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## Exemple d'intégration React

```js
// api.js — configuration Axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Injecter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

```js
// Connexion
const { data } = await api.post('/login', { email, password });
localStorage.setItem('token', data.token);
localStorage.setItem('role', data.user.role);

// Liste des matchs
const { data: matchs } = await api.get('/matchs');

// Réserver
await api.post('/reservations', {
  match_id: 1,
  tribune_id: 1,
  nb_places: 2,
});
```

---

## Comptes de test

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@leguichet.fr` | `password` | admin |
| `user@leguichet.fr` | `password` | user |
