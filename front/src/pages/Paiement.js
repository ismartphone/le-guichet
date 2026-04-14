import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { reservationsAPI } from '../services/api';

export default function Paiement() {
  const navigate = useNavigate();
  const location = useLocation();
  const { match, tribune, nbPlaces } = location.state || {};

  const [form, setForm] = useState({
    numeroCarte: '',
    dateExpiration: '',
    cvv: '',
    nomCarte: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = tribune ? tribune.prix * nbPlaces : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await reservationsAPI.create({
        match_id: match.id,
        tribune_id: tribune.id,
        nb_places: nbPlaces,
      });
      navigate('/confirmation');
    } catch (err) {
      setError('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!match || !tribune) {
    return (
      <div className="text-center mt-16 text-gray-500">
        Aucune réservation en cours.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Paiement</h1>

      {/* Récap réservation */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Récapitulatif</h2>
        <div className="flex items-center gap-4 mb-4">
          {match.club_domicile?.logo && (
            <img src={match.club_domicile.logo} alt="" className="w-10 h-10 object-contain" />
          )}
          <span className="font-bold">{match.club_domicile?.nom}</span>
          <span className="text-gray-400">vs</span>
          <span className="font-bold">{match.club_exterieur?.nom}</span>
          {match.club_exterieur?.logo && (
            <img src={match.club_exterieur.logo} alt="" className="w-10 h-10 object-contain" />
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Tribune : <span className="font-semibold">{tribune.nom}</span></p>
          <p>Nombre de places : <span className="font-semibold">{nbPlaces}</span></p>
          <p>Prix unitaire : <span className="font-semibold">{tribune.prix} €</span></p>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-xl font-bold text-green-600">Total : {total.toFixed(2)} €</p>
        </div>
      </div>

      {/* Formulaire paiement */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold text-lg mb-4">Informations de paiement</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
            <input
              type="text"
              placeholder="Jean Dupont"
              value={form.nomCarte}
              onChange={(e) => setForm({ ...form, nomCarte: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={form.numeroCarte}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                setForm({ ...form, numeroCarte: formatted });
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
              <input
                type="text"
                placeholder="MM/AA"
                maxLength={5}
                value={form.dateExpiration}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  const formatted = val.length > 2 ? val.slice(0, 2) + '/' + val.slice(2) : val;
                  setForm({ ...form, dateExpiration: formatted });
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                placeholder="123"
                maxLength={3}
                value={form.cvv}
                onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Paiement sécurisé — Vos données sont protégées
        </p>
      </div>
    </div>
  );
}