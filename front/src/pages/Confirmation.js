import { useNavigate } from 'react-router-dom';

export default function Confirmation() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto mt-16 text-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Paiement confirmé !</h1>
        <p className="text-gray-500 mb-6">
          Votre réservation a bien été enregistrée. Vous pouvez retrouver vos billets dans votre espace personnel.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/reservations')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Mes réservations
          </button>
          <button
            onClick={() => navigate('/matchs')}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Retour aux matchs
          </button>
        </div>
      </div>
    </div>
  );
}