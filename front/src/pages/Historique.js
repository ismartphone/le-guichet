import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchsAPI } from '../services/api';

export default function Historique() {
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    matchsAPI.getAll()
      .then((res) => {
        const data = res.data;
        const all = Array.isArray(data) ? data : data.data || [];
        // Garder uniquement les matchs passés (date < maintenant) ou statut terminé
        const past = all.filter((m) => {
          const matchDate = new Date(m.date_match);
          return matchDate < new Date() || m.statut === 'termine';
        });
        // Trier du plus récent au plus ancien
        past.sort((a, b) => new Date(b.date_match) - new Date(a.date_match));
        setMatchs(past);
      })
      .catch(() => setError('Impossible de charger l\'historique'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
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
      <h1 className="text-3xl font-bold mb-8">Historique des matchs</h1>

      {matchs.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">Aucun match passé pour le moment.</p>
      ) : (
        <div className="grid gap-4">
          {matchs.map((match) => (
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
                  <div className="text-3xl font-bold">
                    <span className={match.score_domicile > match.score_exterieur ? 'text-green-600' : 'text-gray-700'}>
                      {match.score_domicile ?? '-'}
                    </span>
                    <span className="text-gray-400 mx-2">-</span>
                    <span className={match.score_exterieur > match.score_domicile ? 'text-green-600' : 'text-gray-700'}>
                      {match.score_exterieur ?? '-'}
                    </span>
                  </div>
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
                <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-500">
                  Terminé
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
