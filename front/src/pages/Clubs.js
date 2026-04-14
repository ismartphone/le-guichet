import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clubsAPI } from '../services/api';

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    clubsAPI.getAll()
      .then((res) => {
        const data = res.data;
        setClubs(Array.isArray(data) ? data : data.data || []);
      })
      .catch(() => setError('Impossible de charger les clubs'))
      .finally(() => setLoading(false));
  }, []);

  const clubsFiltres = clubs.filter((c) =>
    c.nom?.toLowerCase().includes(search.toLowerCase()) ||
    c.ville?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-16 text-gray-500 text-lg">Chargement des clubs...</div>;
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Clubs</h1>

      {/* Barre de recherche */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Rechercher un club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {clubsFiltres.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">Aucun club trouve.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubsFiltres.map((club) => (
            <Link
              key={club.id}
              to={`/clubs/${club.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex items-center gap-4 hover:-translate-y-1 transition-all"
            >
              {club.logo ? (
                <img src={club.logo} alt="" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  ⚽
                </div>
              )}
              <div>
                <p className="font-bold text-lg">{club.nom}</p>
                {club.ville && (
                  <p className="text-sm text-gray-500">{club.ville}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
