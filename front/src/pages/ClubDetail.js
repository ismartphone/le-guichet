import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clubsAPI, matchsAPI } from '../services/api';

export default function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtre, setFiltre] = useState('a_venir');

  useEffect(() => {
    Promise.all([
      clubsAPI.getAll(),
      matchsAPI.getAll(),
    ])
      .then(([clubsRes, matchsRes]) => {
        // Trouver le club
        const clubsData = clubsRes.data;
        const allClubs = Array.isArray(clubsData) ? clubsData : clubsData.data || [];
        const found = allClubs.find((c) => c.id === parseInt(id));
        if (!found) {
          setError('Club introuvable');
          return;
        }
        setClub(found);

        // Recuperer tous les matchs
        const matchsData = matchsRes.data;
        let allMatchs = [];
        if (Array.isArray(matchsData)) {
          allMatchs = matchsData;
        } else if (matchsData.a_venir || matchsData.termines) {
          allMatchs = [...(matchsData.a_venir || []), ...(matchsData.termines || [])];
        } else if (matchsData.data) {
          allMatchs = matchsData.data;
        }

        // Filtrer les matchs de ce club
        const clubMatchs = allMatchs.filter(
          (m) => m.club_domicile?.id === parseInt(id) || m.club_exterieur?.id === parseInt(id)
        );
        setMatchs(clubMatchs);
      })
      .catch(() => setError('Impossible de charger les donnees'))
      .finally(() => setLoading(false));
  }, [id]);

  const now = new Date();

  const matchsFiltres = matchs.filter((m) => {
    const matchDate = new Date(m.date_match);
    if (filtre === 'a_venir') {
      return matchDate >= now || m.statut === 'a_venir' || m.statut === 'programme';
    }
    return matchDate < now || m.statut === 'termine';
  });

  const matchsTries = [...matchsFiltres].sort((a, b) => {
    if (filtre === 'a_venir') return new Date(a.date_match) - new Date(b.date_match);
    return new Date(b.date_match) - new Date(a.date_match);
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center mt-16 text-gray-500 text-lg">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* En-tete du club */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex items-center gap-6">
        {club.logo ? (
          <img src={club.logo} alt="" className="w-20 h-20 object-contain" />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl">
            ⚽
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{club.nom}</h1>
          {club.ville && <p className="text-gray-500 text-lg">{club.ville}</p>}
          <p className="text-sm text-gray-400 mt-1">{matchs.length} match(s) au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFiltre('a_venir')}
          className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
            filtre === 'a_venir'
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          A venir
        </button>
        <button
          onClick={() => setFiltre('termines')}
          className={`px-5 py-2 rounded-full font-semibold text-sm transition ${
            filtre === 'termines'
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Termines
        </button>
      </div>

      {/* Liste des matchs */}
      {matchsTries.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          {filtre === 'a_venir' ? 'Aucun match a venir pour ce club.' : 'Aucun match termine pour ce club.'}
        </p>
      ) : (
        <div className="grid gap-4">
          {matchsTries.map((match) => (
            <Link
              key={match.id}
              to={`/matchs/${match.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="text-center min-w-[120px]">
                  {match.club_domicile?.logo && (
                    <img src={match.club_domicile.logo} alt="" className="w-12 h-12 mx-auto mb-1 object-contain" />
                  )}
                  <p className={`font-bold text-sm ${match.club_domicile?.id === parseInt(id) ? 'text-green-700' : ''}`}>
                    {match.club_domicile?.nom}
                  </p>
                </div>

                <div className="text-center">
                  {filtre === 'termines' && match.score_domicile != null ? (
                    <div className="text-3xl font-bold">
                      <span className={match.score_domicile > match.score_exterieur ? 'text-green-600' : 'text-gray-700'}>
                        {match.score_domicile}
                      </span>
                      <span className="text-gray-400 mx-2">-</span>
                      <span className={match.score_exterieur > match.score_domicile ? 'text-green-600' : 'text-gray-700'}>
                        {match.score_exterieur}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">VS</span>
                  )}
                </div>

                <div className="text-center min-w-[120px]">
                  {match.club_exterieur?.logo && (
                    <img src={match.club_exterieur.logo} alt="" className="w-12 h-12 mx-auto mb-1 object-contain" />
                  )}
                  <p className={`font-bold text-sm ${match.club_exterieur?.id === parseInt(id) ? 'text-green-700' : ''}`}>
                    {match.club_exterieur?.nom}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">{formatDate(match.date_match)}</p>
                <p className="text-sm text-gray-400">{match.stade?.nom}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${
                  filtre === 'a_venir'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {filtre === 'a_venir' ? 'A venir' : 'Termine'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
