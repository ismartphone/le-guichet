import { useState, useEffect } from 'react';
import { clubsAPI, adminAPI } from '../../services/api';

export default function AdminClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', ville: '', logo: '' });
  const [saving, setSaving] = useState(false);

  const fetchClubs = () => {
    setLoading(true);
    clubsAPI.getAll()
      .then((res) => setClubs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const resetForm = () => {
    setForm({ nom: '', ville: '', logo: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (club) => {
    setForm({ nom: club.nom, ville: club.ville, logo: club.logo || '' });
    setEditing(club.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminAPI.updateClub(editing, form);
      } else {
        await adminAPI.createClub(form);
      }
      resetForm();
      fetchClubs();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce club ?')) return;
    try {
      await adminAPI.deleteClub(id);
      fetchClubs();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center mt-16 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Clubs</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {showForm ? 'Annuler' : '+ Nouveau club'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <h2 className="font-bold text-lg">{editing ? 'Modifier le club' : 'Nouveau club'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={form.ville}
                onChange={(e) => setForm({ ...form, ville: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL du logo (optionnel)</label>
            <input
              type="text"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="https://..."
            />
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
        {clubs.map((club) => (
          <div key={club.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {club.logo && (
                <img src={club.logo} alt="" className="w-10 h-10 object-contain" />
              )}
              <div>
                <p className="font-bold">{club.nom}</p>
                <p className="text-sm text-gray-500">{club.ville}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(club)}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(club.id)}
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
