import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

export default function ResignationForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', screenshot: '' });

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => { if (!data.user) { router.push('/'); return; } setUser(data.user); setLoading(false); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'resignation', ...formData }) });
    if (res.ok) { alert('✅ Увольнение отправлено!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <FormLayout>
      <h1>📋 Заявление на увольнение</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик *</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
        <div className="form-group"><label>Скриншот планшета *</label><textarea required value={formData.screenshot} onChange={(e) => setFormData({...formData, screenshot: e.target.value})} rows="4" /></div>
        <button type="submit" className="submit-btn">📤 Отправить</button>
      </form>
      <style jsx>{`
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; }
      `}</style>
    </FormLayout>
  );
}