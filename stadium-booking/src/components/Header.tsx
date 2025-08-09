import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import uz from '../i18n/uz';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-black/40 to-transparent backdrop-blur border-b border-white/10">
      <div className="container-page py-3 flex items-center justify-between">
        <Link to={user ? '/' : '/login'} className="text-lg font-bold tracking-wide">
          {uz.appName}
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {!user && location.pathname !== '/login' && (
            <Link to="/login" className="btn btn-primary">{uz.nav.login}</Link>
          )}
          {!user && location.pathname !== '/register' && (
            <Link to="/register" className="btn btn-accent">{uz.nav.register}</Link>
          )}
          {user && (
            <button onClick={logout} className="btn btn-accent">{uz.nav.logout}</button>
          )}
        </nav>
      </div>
    </header>
  );
}