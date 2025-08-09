import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import uz from '../i18n/uz';
import Button from '../components/Button';
import Header from '../components/Header';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(phoneNumber, password);
      toast.success(uz.toast.loginSuccess);
      navigate('/');
    } catch {
      toast.error(uz.toast.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container-page py-6">
        <div className="card p-4">
          <h1 className="text-xl font-semibold mb-4">{uz.nav.login}</h1>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="label">{uz.auth.phoneNumber}</label>
              <input className="input mt-1" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="998901234567" />
            </div>
            <div>
              <label className="label">{uz.auth.password}</label>
              <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button disabled={loading} type="submit" className="w-full">{uz.auth.loginBtn}</Button>
          </form>
          <div className="text-sm text-white/70 mt-3">
            {uz.auth.noAccount} <Link className="underline" to="/register">{uz.nav.register}</Link>
          </div>
        </div>
      </main>
    </>
  );
}