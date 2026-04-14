import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchsAPI } from '../services/api';

export default function Matchs() {
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtre, setFiltre] = useState('a_venir'); // 'a_venir' ou 'termines'

  useEffect(() => {
    matchsAPI.getAll()
      .then((res) => {
        const data = res.data;
        // L'API retourne {a_venir: [...], termines: [...]}
        const tous = [...(data.a_venir||[]),...(data.termines||[])];
        setMatchs(tous);
      })
      .catch(() => setError('Impossible de charger les matchs'))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const matchsFiltres = matchs.filter((m) => {
    const matchDate = new Date(m.date_match);
    if (filtre === 'a_venir') {
      return matchDate >= now || m.statut === 'a_venir' || m.statut === 'programme';
    }
    return matchDate < now || m.statut === 'termine';
  });

  // À venir : du plus proche au plus loin / Terminés : du plus récent au plus ancien
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
    return <div className="text-center mt-16 text-gray-500 text-lg">Chargement des matchs...</div>;
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Matchs</h1>

      {/* Filtres */}
      <div className="flex gap-2 mb-8">
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
          Terminés
        </button>
      </div>

      {matchsTries.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          {filtre === 'a_venir' ? 'Aucun match à venir.' : 'Aucun match terminé.'}
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
                  <p className="font-bold text-sm">{match.club_domicile?.nom}</p>
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
                  <p className="font-bold text-sm">{match.club_exterieur?.nom}</p>
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
                  {filtre === 'a_venir' ? 'A venir' : 'Terminé'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
