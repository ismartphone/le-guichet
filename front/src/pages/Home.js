import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchsAPI, reservationsAPI } from '../services/api';

export default function Home() {
  const { user } = useAuth();
  const [prochains, setProchains] = useState([]);
  const [derniers, setDerniers] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    matchsAPI.getAll()
      .then((res) => {
        const data = res.data;
        let all = [];
        if (Array.isArray(data)) {
          all = data;
        } else if (data.a_venir || data.termines) {
          all = [...(data.a_venir || []), ...(data.termines || [])];
        } else if (data.data) {
          all = data.data;
        }
        // 3 prochains matchs
        const futurs = all
          .filter((m) => new Date(m.date_match) >= new Date() || m.statut === 'a_venir' || m.statut === 'programme')
          .sort((a, b) => new Date(a.date_match) - new Date(b.date_match))
          .slice(0, 3);
        setProchains(futurs);
        // 3 derniers matchs termines
        const passes = all
          .filter((m) => new Date(m.date_match) < new Date() || m.statut === 'termine')
          .sort((a, b) => new Date(b.date_match) - new Date(a.date_match))
          .slice(0, 3);
        setDerniers(passes);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    reservationsAPI.getAll()
      .then((res) => {
        const data = res.data;
        const all = Array.isArray(data) ? data : data.data || [];
        setReservations(all.slice(0, 3));
      })
      .catch(() => {});
  }, [user]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Le Guichet</h1>
        <p className="text-xl text-gray-600 mb-8">
          Reservez vos places pour les prochains matchs de football en quelques clics.
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
              Creer un compte
            </Link>
          )}
        </div>
      </div>

      {/* 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/matchs" className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-3">⚽</div>
          <h3 className="font-bold text-lg mb-2">Tous les matchs</h3>
          <p className="text-gray-500 text-sm">
            Consultez le calendrier des prochains matchs avec les details des equipes et des stades.
          </p>
        </Link>
        <Link to="/matchs" className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-3">🪑</div>
          <h3 className="font-bold text-lg mb-2">Choisissez votre tribune</h3>
          <p className="text-gray-500 text-sm">
            Selectionnez la tribune qui vous convient et le nombre de places souhaitees.
          </p>
        </Link>
        <Link to="/reservations" className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-bold text-lg mb-2">Reservation instantanee</h3>
          <p className="text-gray-500 text-sm">
            Confirmez votre reservation en un clic et retrouvez-la dans votre espace personnel.
          </p>
        </Link>
      </div>

      {/* Prochains matchs */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Prochains matchs</h2>
          <Link to="/matchs" className="text-green-600 hover:text-green-700 font-semibold text-sm">
            Voir tout &rarr;
          </Link>
        </div>
        {prochains.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white rounded-xl shadow">Aucun match a venir.</p>
        ) : (
          <div className="grid gap-3">
            {prochains.map((match) => (
              <Link
                key={match.id}
                to={`/matchs/${match.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="text-center min-w-[100px]">
                    {match.club_domicile?.logo && (
                      <img src={match.club_domicile.logo} alt="" className="w-10 h-10 mx-auto mb-1 object-contain" />
                    )}
                    <p className="font-bold text-sm">{match.club_domicile?.nom}</p>
                  </div>
                  <span className="text-xl font-bold text-gray-400">VS</span>
                  <div className="text-center min-w-[100px]">
                    {match.club_exterieur?.logo && (
                      <img src={match.club_exterieur.logo} alt="" className="w-10 h-10 mx-auto mb-1 object-contain" />
                    )}
                    <p className="font-bold text-sm">{match.club_exterieur?.nom}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(match.date_match)}</p>
                  <p className="text-xs text-gray-400">{match.stade?.nom}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    A venir
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Derniers resultats */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Derniers resultats</h2>
          <Link to="/matchs" className="text-green-600 hover:text-green-700 font-semibold text-sm">
            Voir tout &rarr;
          </Link>
        </div>
        {derniers.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white rounded-xl shadow">Aucun match termine.</p>
        ) : (
          <div className="grid gap-3">
            {derniers.map((match) => (
              <Link
                key={match.id}
                to={`/matchs/${match.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="text-center min-w-[100px]">
                    {match.club_domicile?.logo && (
                      <img src={match.club_domicile.logo} alt="" className="w-10 h-10 mx-auto mb-1 object-contain" />
                    )}
                    <p className="font-bold text-sm">{match.club_domicile?.nom}</p>
                  </div>
                  <div className="text-2xl font-bold">
                    <span className={match.score_domicile > match.score_exterieur ? 'text-green-600' : 'text-gray-700'}>
                      {match.score_domicile ?? '-'}
                    </span>
                    <span className="text-gray-400 mx-2">-</span>
                    <span className={match.score_exterieur > match.score_domicile ? 'text-green-600' : 'text-gray-700'}>
                      {match.score_exterieur ?? '-'}
                    </span>
                  </div>
                  <div className="text-center min-w-[100px]">
                    {match.club_exterieur?.logo && (
                      <img src={match.club_exterieur.logo} alt="" className="w-10 h-10 mx-auto mb-1 object-contain" />
                    )}
                    <p className="font-bold text-sm">{match.club_exterieur?.nom}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(match.date_match)}</p>
                  <p className="text-xs text-gray-400">{match.stade?.nom}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                    Termine
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mes reservations (si connecte) */}
      {user && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Mes reservations</h2>
            <Link to="/reservations" className="text-green-600 hover:text-green-700 font-semibold text-sm">
              Voir tout &rarr;
            </Link>
          </div>
          {reservations.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-white rounded-xl shadow">Aucune reservation.</p>
          ) : (
            <div className="grid gap-3">
              {reservations.map((resa) => (
                <div key={resa.id} className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold">
                      {resa.match?.club_domicile?.nom} vs {resa.match?.club_exterieur?.nom}
                    </p>
                    <p className="text-sm text-gray-500">
                      {resa.match?.date_match && formatDate(resa.match.date_match)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tribune : <span className="font-medium">{resa.tribune?.nom}</span> — {resa.nb_places} place(s)
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    resa.statut === 'confirmee'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {resa.statut === 'confirmee' ? 'Confirmee' : 'Annulee'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
