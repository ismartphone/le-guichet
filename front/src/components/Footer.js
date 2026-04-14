import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Le Guichet</h3>
            <p className="text-sm">
              Votre plateforme de reservation de billets pour les matchs de football.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/matchs" className="hover:text-white transition">Matchs</Link></li>
              <li><Link to="/clubs" className="hover:text-white transition">Clubs</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Connexion</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Inscription</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>contact@leguichet.fr</li>
              <li>01 23 45 67 89</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Le Guichet — Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
