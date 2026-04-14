import { useState, useEffect } from 'react';
import { matchsAPI } from '../services/api';

export default function Classement() {
  const [classement, setClassement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    matchsAPI.getAll()
      .then((res) => {
        const data = res.data;
        const all = Array.isArray(data) ? data : data.data || [];
        // Calculer le classement à partir des matchs terminés
        const stats = {};

        all.forEach((match) => {
          if (match.score_domicile == null || match.score_exterieur == null) return;

          const dom = match.club_domicile;
          const ext = match.club_exterieur;
          if (!dom || !ext) return;

          // Init clubs
          if (!stats[dom.id]) {
            stats[dom.id] = { id: dom.id, nom: dom.nom, logo: dom.logo, pts: 0, j: 0, v: 0, n: 0, d: 0, bp: 0, bc: 0 };
          }
          if (!stats[ext.id]) {
            stats[ext.id] = { id: ext.id, nom: ext.nom, logo: ext.logo, pts: 0, j: 0, v: 0, n: 0, d: 0, bp: 0, bc: 0 };
          }

          const sd = match.score_domicile;
          const se = match.score_exterieur;

          // Matchs joués
          stats[dom.id].j++;
          stats[ext.id].j++;

          // Buts
          stats[dom.id].bp += sd;
          stats[dom.id].bc += se;
          stats[ext.id].bp += se;
          stats[ext.id].bc += sd;

          // Résultats
          if (sd > se) {
            stats[dom.id].v++;
            stats[dom.id].pts += 3;
            stats[ext.id].d++;
          } else if (sd < se) {
            stats[ext.id].v++;
            stats[ext.id].pts += 3;
            stats[dom.id].d++;
          } else {
            stats[dom.id].n++;
            stats[dom.id].pts += 1;
            stats[ext.id].n++;
            stats[ext.id].pts += 1;
          }
        });

        // Trier par points, puis diff de buts, puis buts marqués
        const sorted = Object.values(stats).sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if ((b.bp - b.bc) !== (a.bp - a.bc)) return (b.bp - b.bc) - (a.bp - a.bc);
          return b.bp - a.bp;
        });

        setClassement(sorted);
      })
      .catch(() => setError('Impossible de charger le classement'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-16 text-gray-500 text-lg">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-16 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Classement</h1>

      {classement.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">Aucune donnée disponible.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-700 text-white text-sm">
                <th className="py-3 px-4 text-left w-12">#</th>
                <th className="py-3 px-4 text-left">Club</th>
                <th className="py-3 px-2 text-center">Pts</th>
                <th className="py-3 px-2 text-center">J</th>
                <th className="py-3 px-2 text-center">V</th>
                <th className="py-3 px-2 text-center">N</th>
                <th className="py-3 px-2 text-center">D</th>
                <th className="py-3 px-2 text-center">BP</th>
                <th className="py-3 px-2 text-center">BC</th>
                <th className="py-3 px-2 text-center">Diff</th>
              </tr>
            </thead>
            <tbody>
              {classement.map((club, index) => (
                <tr
                  key={club.id}
                  className={`border-b border-gray-100 ${
                    index < 3 ? 'bg-green-50' : index >= classement.length - 3 ? 'bg-red-50' : ''
                  } hover:bg-gray-50 transition`}
                >
                  <td className="py-3 px-4 font-bold text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {club.logo && (
                        <img src={club.logo} alt="" className="w-8 h-8 object-contain" />
                      )}
                      <span className="font-semibold">{club.nom}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-green-700">{club.pts}</td>
                  <td className="py-3 px-2 text-center text-gray-600">{club.j}</td>
                  <td className="py-3 px-2 text-center text-gray-600">{club.v}</td>
                  <td className="py-3 px-2 text-center text-gray-600">{club.n}</td>
                  <td className="py-3 px-2 text-center text-gray-600">{club.d}</td>
                  <td className="py-3 px-2 text-center text-gray-600">{club.bp}</td>
                  <td className="py-3 px-2 text-center text-gray-600">{club.bc}</td>
                  <td className={`py-3 px-2 text-center font-bold ${
                    club.bp - club.bc > 0 ? 'text-green-600' : club.bp - club.bc < 0 ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {club.bp - club.bc > 0 ? '+' : ''}{club.bp - club.bc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
