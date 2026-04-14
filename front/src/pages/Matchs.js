import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchsAPI } from '../services/api';
import { MOCK_MATCHS } from '../services/mockData'; // TODO: supprimer quand backend prêt

const USE_MOCK = false;


export default function Matchs() {
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (USE_MOCK) {
      setMatchs(MOCK_MATCHS);
      setLoading(false);
      return;
    }
    matchsAPI.getAll()
      .then((res) => setMatchs(res.data))
      .catch(() => setError('Impossible de charger les matchs'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-16 text-gray-500 text-lg">Chargement des matchs...</div>;
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">{error}</div>;
  }

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

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Prochains matchs</h1>

      {matchs.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">Aucun match programmé pour le moment.</p>
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
                  <span className="text-2xl font-bold text-gray-400">VS</span>
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
                  match.statut === 'programme' || match.statut === 'a_venir'
                    ? 'bg-green-100 text-green-700'
                    : match.statut === 'en_cours'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {match.statut === 'programme' || match.statut === 'a_venir' ? 'À venir' : match.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
