import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import uz from '../i18n/uz';
import Button from '../components/Button';
import Header from '../components/Header';
import { isStrongEnoughPassword, isValidPhone } from '../utils/validation';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', teamName: '', phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(form.phoneNumber)) {
      toast.error(uz.errors.phoneInvalid);
      return;
    }
    if (!isStrongEnoughPassword(form.password)) {
      toast.error(uz.errors.passwordShort);
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success(uz.toast.registerSuccess);
      navigate('/');
    } catch (e) {
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
          <h1 className="text-xl font-semibold mb-4">{uz.nav.register}</h1>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="label">{uz.auth.firstName}</label>
              <input className="input mt-1" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="label">{uz.auth.lastName}</label>
              <input className="input mt-1" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <label className="label">{uz.auth.teamName}</label>
              <input className="input mt-1" value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} />
            </div>
            <div>
              <label className="label">{uz.auth.phoneNumber}</label>
              <input className="input mt-1" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="998901234567" />
            </div>
            <div>
              <label className="label">{uz.auth.password}</label>
              <input className="input mt-1" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button disabled={loading} type="submit" className="w-full">{uz.auth.registerBtn}</Button>
          </form>
          <div className="text-sm text-white/70 mt-3">
            {uz.auth.haveAccount} <Link className="underline" to="/login">{uz.nav.login}</Link>
          </div>
        </div>
      </main>
    </>
  );
}