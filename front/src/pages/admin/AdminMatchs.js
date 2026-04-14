import { useState, useEffect } from 'react';
import { matchsAPI, clubsAPI, adminAPI } from '../../services/api';

export default function AdminMatchs() {
  const [matchs, setMatchs] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    club_domicile_id: '',
    club_exterieur_id: '',
    stade_id: '',
    date_match: '',
  });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([matchsAPI.getAll(), clubsAPI.getAll()])
      .then(([matchsRes, clubsRes]) => {
        const data = matchsRes.data;
        const tous = [...(data.a_venir ? data.a_venir : []), ...(data.termines ? data.termines : [])];
        setMatchs(tous);
        setClubs(clubsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ club_domicile_id: '', club_exterieur_id: '', stade_id: '', date_match: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (match) => {
    setForm({
      club_domicile_id: match.club_domicile?.id || '',
      club_exterieur_id: match.club_exterieur?.id || '',
      stade_id: match.stade?.id || '',
      date_match: match.date_match ? match.date_match.slice(0, 16) : '',
    });
    setEditing(match.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        club_domicile_id: parseInt(form.club_domicile_id),
        club_exterieur_id: parseInt(form.club_exterieur_id),
        stade_id: parseInt(form.stade_id),
      };
      if (editing) {
        await adminAPI.updateMatch(editing, payload);
      } else {
        await adminAPI.createMatch(payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce match ?')) return;
    try {
      await adminAPI.deleteMatch(id);
      fetchData();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await adminAPI.syncMatchs();
      fetchData();
      alert('Synchronisation réussie !');
    } catch {
      alert('Erreur lors de la synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center mt-16 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Matchs</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {syncing ? 'Sync...' : 'Sync API-Football'}
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {showForm ? 'Annuler' : '+ Nouveau match'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <h2 className="font-bold text-lg">{editing ? 'Modifier le match' : 'Nouveau match'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club domicile</label>
              <select
                value={form.club_domicile_id}
                onChange={(e) => setForm({ ...form, club_domicile_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              >
                <option value="">-- Sélectionner --</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club extérieur</label>
              <select
                value={form.club_exterieur_id}
                onChange={(e) => setForm({ ...form, club_exterieur_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              >
                <option value="">-- Sélectionner --</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stade ID</label>
              <input
                type="number"
                value={form.stade_id}
                onChange={(e) => setForm({ ...form, stade_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
              <input
                type="datetime-local"
                value={form.date_match}
                onChange={(e) => setForm({ ...form, date_match: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}
          </button>
        </form>
      )}

      <div className="grid gap-3">
        {matchs.map((match) => (
          <div key={match.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <p className="font-bold">
                {match.club_domicile?.nom} vs {match.club_exterieur?.nom}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(match.date_match)} — {match.stade?.nom}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(match)}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(match.id)}
                className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
