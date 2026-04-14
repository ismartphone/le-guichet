import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import api from '../../services/api';

export default function AdminTribunes() {
  const [tribunes, setTribunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', capacite: '', prix: '', stade_id: '' });
  const [saving, setSaving] = useState(false);

  const fetchTribunes = () => {
    setLoading(true);
    // On récupère toutes les tribunes via l'API
    api.get('/tribunes/0')
      .then((res) => setTribunes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTribunes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTribunes();
  }, []);

  const resetForm = () => {
    setForm({ nom: '', capacite: '', prix: '', stade_id: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (tribune) => {
    setForm({
      nom: tribune.nom,
      capacite: tribune.capacite,
      prix: tribune.prix,
      stade_id: tribune.stade_id,
    });
    setEditing(tribune.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        capacite: parseInt(form.capacite),
        prix: parseFloat(form.prix),
        stade_id: parseInt(form.stade_id),
      };
      if (editing) {
        await adminAPI.updateTribune(editing, payload);
      } else {
        await adminAPI.createTribune(payload);
      }
      resetForm();
      fetchTribunes();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette tribune ?')) return;
    try {
      await adminAPI.deleteTribune(id);
      fetchTribunes();
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
        <h1 className="text-3xl font-bold">Gestion des Tribunes</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {showForm ? 'Annuler' : '+ Nouvelle tribune'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <h2 className="font-bold text-lg">{editing ? 'Modifier la tribune' : 'Nouvelle tribune'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Tribune Nord"
                required
              />
            </div>
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                value={form.capacite}
                onChange={(e) => setForm({ ...form, capacite: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
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

      {tribunes.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">Aucune tribune trouvée.</p>
      ) : (
        <div className="grid gap-3">
          {tribunes.map((tribune) => (
            <div key={tribune.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">{tribune.nom}</p>
                <p className="text-sm text-gray-500">
                  Capacité : {tribune.capacite} — Prix : {tribune.prix} € — Stade ID : {tribune.stade_id}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tribune)}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(tribune.id)}
                  className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
