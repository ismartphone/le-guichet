// ============================================
// DONNÉES FICTIVES — À SUPPRIMER quand le backend sera prêt
// ============================================

export const MOCK_MATCHS = [
  {
    id: 1,
    date_match: '2026-04-25T15:00:00.000000Z',
    statut: 'a_venir',
    club_domicile: { id: 1, nom: 'Olympique Lyonnais', ville: 'Lyon', logo: 'https://media.api-sports.io/football/teams/80.png' },
    club_exterieur: { id: 2, nom: 'AJ Auxerre', ville: 'Auxerre', logo: 'https://media.api-sports.io/football/teams/98.png' },
    stade: {
      id: 1,
      nom: 'Groupama Stadium',
      ville: 'Lyon',
      capacite: 59186,
      tribunes: [
        { id: 1, nom: 'Tribune Nord', capacite: 12000, prix: 16.00, stade_id: 1 },
        { id: 2, nom: 'Tribune Sud', capacite: 12000, prix: 18.00, stade_id: 1 },
        { id: 3, nom: 'Tribune Est', capacite: 8000, prix: 20.00, stade_id: 1 },
        { id: 4, nom: 'Tribune Ouest', capacite: 8000, prix: 22.00, stade_id: 1 },
        { id: 5, nom: 'Ferveur Nord', capacite: 5000, prix: 20.00, stade_id: 1 },
        { id: 6, nom: 'Tribune VIP', capacite: 2000, prix: 120.00, stade_id: 1 },
      ],
    },
  },
  {
    id: 2,
    date_match: '2026-05-03T21:00:00.000000Z',
    statut: 'a_venir',
    club_domicile: { id: 3, nom: 'Paris Saint-Germain', ville: 'Paris', logo: 'https://media.api-sports.io/football/teams/85.png' },
    club_exterieur: { id: 4, nom: 'Olympique de Marseille', ville: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' },
    stade: {
      id: 2,
      nom: 'Parc des Princes',
      ville: 'Paris',
      capacite: 48583,
      tribunes: [
        { id: 7, nom: 'Tribune Auteuil', capacite: 10000, prix: 35.00, stade_id: 2 },
        { id: 8, nom: 'Tribune Boulogne', capacite: 10000, prix: 35.00, stade_id: 2 },
        { id: 9, nom: 'Tribune Borelli', capacite: 8000, prix: 45.00, stade_id: 2 },
        { id: 10, nom: 'Tribune Présidentielle', capacite: 3000, prix: 150.00, stade_id: 2 },
      ],
    },
  },
  {
    id: 3,
    date_match: '2026-05-10T17:00:00.000000Z',
    statut: 'a_venir',
    club_domicile: { id: 5, nom: 'AS Monaco', ville: 'Monaco', logo: 'https://media.api-sports.io/football/teams/91.png' },
    club_exterieur: { id: 6, nom: 'LOSC Lille', ville: 'Lille', logo: 'https://media.api-sports.io/football/teams/79.png' },
    stade: {
      id: 3,
      nom: 'Stade Louis-II',
      ville: 'Monaco',
      capacite: 18523,
      tribunes: [
        { id: 11, nom: 'Tribune Pescatore', capacite: 5000, prix: 25.00, stade_id: 3 },
        { id: 12, nom: 'Tribune Rainier III', capacite: 4000, prix: 30.00, stade_id: 3 },
        { id: 13, nom: 'Tribune Honneur', capacite: 3000, prix: 55.00, stade_id: 3 },
      ],
    },
  },
  {
    id: 4,
    date_match: '2026-04-19T20:45:00.000000Z',
    statut: 'en_cours',
    club_domicile: { id: 4, nom: 'Olympique de Marseille', ville: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' },
    club_exterieur: { id: 7, nom: 'Stade Rennais', ville: 'Rennes', logo: 'https://media.api-sports.io/football/teams/94.png' },
    stade: {
      id: 4,
      nom: 'Orange Vélodrome',
      ville: 'Marseille',
      capacite: 67394,
      tribunes: [
        { id: 14, nom: 'Virage Nord', capacite: 14000, prix: 15.00, stade_id: 4 },
        { id: 15, nom: 'Virage Sud', capacite: 14000, prix: 15.00, stade_id: 4 },
        { id: 16, nom: 'Tribune Ganay', capacite: 10000, prix: 30.00, stade_id: 4 },
        { id: 17, nom: 'Tribune Jean Bouin', capacite: 10000, prix: 30.00, stade_id: 4 },
        { id: 18, nom: 'Loge VIP', capacite: 2000, prix: 200.00, stade_id: 4 },
      ],
    },
  },
];
