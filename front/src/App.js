import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Paiement from './pages/Paiement';
import Confirmation from './pages/Confirmation';

// Pages publiques
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Matchs from './pages/Matchs';
import MatchDetail from './pages/MatchDetail';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import NotFound from './pages/NotFound';

// Pages protégées
import MesReservations from './pages/MesReservations';

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClubs from './pages/admin/AdminClubs';
import AdminMatchs from './pages/admin/AdminMatchs';
import AdminTribunes from './pages/admin/AdminTribunes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="px-4 pb-12 flex-1">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/matchs" element={<Matchs />} />
              <Route path="/matchs/:id" element={<MatchDetail />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:id" element={<ClubDetail />} />

              {/* Routes protégées (user connecté) */}
              <Route path="/paiement" element={
                <PrivateRoute><Paiement /></PrivateRoute>
              } />
              <Route path="/confirmation" element={
                <PrivateRoute><Confirmation /></PrivateRoute>
              } />
              <Route path="/reservations" element={
                <PrivateRoute><MesReservations /></PrivateRoute>
              } />

              {/* Routes admin */}
              <Route path="/admin" element={
                <PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>
              } />
              <Route path="/admin/clubs" element={
                <PrivateRoute adminOnly><AdminClubs /></PrivateRoute>
              } />
              <Route path="/admin/matchs" element={
                <PrivateRoute adminOnly><AdminMatchs /></PrivateRoute>
              } />
              <Route path="/admin/tribunes" element={
                <PrivateRoute adminOnly><AdminTribunes /></PrivateRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;