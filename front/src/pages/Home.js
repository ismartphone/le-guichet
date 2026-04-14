import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto mt-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        🎟 Le Guichet
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Réservez vos places pour les prochains matchs de football en quelques clics.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          to="/matchs"
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Voir les matchs
        </Link>
        {!user && (
          <Link
            to="/register"
            className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
          >
            Créer un compte
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <Link to="/matchs" className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-3">⚽</div>
          <h3 className="font-bold text-lg mb-2">Tous les matchs</h3>
          <p className="text-gray-500 text-sm">
            Consultez le calendrier des prochains matchs avec les détails des équipes et des stades.
          </p>
        </Link>
        <Link to="/matchs" className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-3">🪑</div>
          <h3 className="font-bold text-lg mb-2">Choisissez votre tribune</h3>
          <p className="text-gray-500 text-sm">
            Sélectionnez la tribune qui vous convient et le nombre de places souhaitées.
          </p>
        </Link>
        <Link to="/reservations" className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-bold text-lg mb-2">Réservation instantanée</h3>
          <p className="text-gray-500 text-sm">
            Confirmez votre réservation en un clic et retrouvez-la dans votre espace personnel.
          </p>
        </Link>
      </div>
    </div>
  );
}
