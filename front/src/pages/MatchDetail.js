import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchsAPI, reservationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StadiumMap from '../components/StadiumMap';
import { MOCK_MATCHS } from '../services/mockData'; // TODO: supprimer quand backend prêt

const USE_MOCK = false; // TODO: passer à false quand backend prêt

export default function MatchDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Réservation
  const [selectedTribune, setSelectedTribune] = useState(null);
  const [nbPlaces, setNbPlaces] = useState(1);
  const [reserving, setReserving] = useState(false);
  const [success, setSuccess] = useState('');
  const [reserveError, setReserveError] = useState('');

  useEffect(() => {
    if (USE_MOCK) {
      const found = MOCK_MATCHS.find((m) => m.id === parseInt(id));
      setMatch(found || null);
      if (!found) setError('Match introuvable');
      setLoading(false);
      return;
    }
    matchsAPI.getOne(id)
      .then((res) => setMatch(res.data))
      .catch(() => setError('Match introuvable'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setReserving(true);
    setReserveError('');
    setSuccess('');
    try {
      await reservationsAPI.create({
        match_id: parseInt(id),
        tribune_id: selectedTribune.id,
        nb_places: nbPlaces,
      });
      setSuccess(`${nbPlaces} place(s) réservée(s) en ${selectedTribune.nom} !`);
      setSelectedTribune(null);
      setNbPlaces(1);
    } catch (err) {
      setReserveError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setReserving(false);
    }
  };

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

  const tribunes = match.stade?.tribunes || [];

  return (
    <div className="max-w-7xl mx-auto mt-6">
      {/* En-tête du match */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {match.club_domicile?.logo && (
                <img src={match.club_domicile.logo} alt="" className="w-12 h-12 object-contain" />
              )}
              <span className="font-bold text-lg">{match.club_domicile?.nom}</span>
            </div>
            <span className="text-xl font-bold text-gray-400">vs</span>
            <div className="flex items-center gap-4">
              {match.club_exterieur?.logo && (
                <img src={match.club_exterieur.logo} alt="" className="w-12 h-12 object-contain" />
              )}
              <span className="font-bold text-lg">{match.club_exterieur?.nom}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-800">{formatDate(match.date_match)}</p>
            <p className="text-sm text-gray-500">{match.stade?.nom}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 text-center font-medium">
          {success}
        </div>
      )}
      {reserveError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-center">
          {reserveError}
        </div>
      )}

      {/* Layout 2 colonnes : liste à gauche, stade à droite */}
      <div className="flex gap-6">
        {/* Colonne gauche — Liste des tribunes */}
        <div className="w-[350px] shrink-0">
          <h2 className="text-lg font-bold mb-3 text-gray-700 italic">
            Choisissez votre zone sur le plan ou dans la liste ci-dessous
          </h2>

          {tribunes.length === 0 ? (
            <p className="text-gray-500">Aucune tribune disponible.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {tribunes.map((tribune) => (
                <div
                  key={tribune.id}
                  onClick={() => setSelectedTribune(tribune)}
                  className={`border-l-4 bg-white rounded-r-lg shadow-sm p-4 cursor-pointer transition ${
                    selectedTribune?.id === tribune.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-blue-800 text-sm uppercase">{tribune.nom}</p>
                      <p className="text-xs text-gray-500">À partir de {tribune.prix} €</p>
                    </div>
                    <svg className={`w-5 h-5 transition-transform ${selectedTribune?.id === tribune.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Formulaire de réservation inline */}
                  {selectedTribune?.id === tribune.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <label className="text-xs font-medium text-gray-600">Places :</label>
                        <select
                          value={nbPlaces}
                          onChange={(e) => setNbPlaces(parseInt(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <span className="text-sm font-bold text-green-600 ml-auto">
                          {(tribune.prix * nbPlaces).toFixed(2)} €
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleReserve(); }}
                        disabled={reserving}
                        className="w-full bg-green-600 text-white py-2 rounded font-semibold text-sm hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {reserving ? 'Réservation...' : 'Réserver'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite — Plan du stade */}
        <div className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-[600px]">
            <StadiumMap
              tribunes={tribunes}
              selectedTribune={selectedTribune}
              onSelect={setSelectedTribune}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
