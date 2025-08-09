import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="container-page py-10 space-y-3 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-white/70">Sahifa topilmadi</p>
      <Link className="btn btn-primary" to="/">Bosh sahifa</Link>
    </main>
  );
}