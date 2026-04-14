import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          🎟 Le Guichet
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/matchs" className="hover:text-green-200 transition">
            Matchs
          </Link>

          {user ? (
            <>
              <Link to="/reservations" className="hover:text-green-200 transition">
                Mes Réservations
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-green-200 transition font-semibold">
                  Admin
                </Link>
              )}
              <span className="text-green-200 text-sm">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-green-800 hover:bg-green-900 px-3 py-1 rounded text-sm transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200 transition">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-white text-green-700 px-3 py-1 rounded font-semibold hover:bg-green-100 transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
