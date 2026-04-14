import { useState, useEffect } from 'react';
import { reservationsAPI } from '../services/api';

export default function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = () => {
    setLoading(true);
    reservationsAPI.getAll()
      .then((res) => setReservations(res.data))
      .catch(() => setError('Impossible de charger vos réservations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await reservationsAPI.cancel(id);
      fetchReservations();
    } catch {
      alert('Erreur lors de l\'annulation');
    }
  };

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
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">Vous n'avez aucune réservation.</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map((resa) => (
            <div key={resa.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">
                    {resa.match?.club_domicile?.nom} vs {resa.match?.club_exterieur?.nom}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(resa.match?.date_match)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tribune : <span className="font-medium">{resa.tribune?.nom}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Places : <span className="font-medium">{resa.nb_places}</span> —
                    Total : <span className="font-bold text-green-600">
                      {(resa.tribune?.prix * resa.nb_places).toFixed(2)} €
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                    resa.statut === 'confirmee'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {resa.statut === 'confirmee' ? 'Confirmée' : 'Annulée'}
                  </span>

                  {resa.statut === 'confirmee' && (
                    <button
                      onClick={() => handleCancel(resa.id)}
                      className="block mt-3 text-sm text-red-500 hover:text-red-700 hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
