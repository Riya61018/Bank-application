import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/dashboard" className="nav-logo">
          LedgerApp
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transfer">Transfer</Link>
          <button onClick={logout} className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
