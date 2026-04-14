import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const sections = [
    { title: 'Clubs', description: 'Gérer les clubs de football', path: '/admin/clubs', icon: '🏟' },
    { title: 'Matchs', description: 'Gérer les matchs programmés', path: '/admin/matchs', icon: '⚽' },
    { title: 'Tribunes', description: 'Gérer les tribunes des stades', path: '/admin/tribunes', icon: '🪑' },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.path}
            to={section.path}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center"
          >
            <div className="text-4xl mb-3">{section.icon}</div>
            <h2 className="font-bold text-lg mb-1">{section.title}</h2>
            <p className="text-sm text-gray-500">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
