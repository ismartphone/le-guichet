import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto mt-24 text-center">
      <div className="text-8xl mb-4">⚽</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-500 text-lg mb-8">
        Cette page n'existe pas ou a ete deplacee.
      </p>
      <Link
        to="/"
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Retour a l'accueil
      </Link>
    </div>
  );
}
