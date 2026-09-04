import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

export default function TransferForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', rank: '', currentDepartment: '', targetDepartment: '', reason: '' });

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => { if (!data.user) { router.push('/'); return; } setUser(data.user); setLoading(false); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'transfer', ...formData }) });
    if (res.ok) { alert('✅ Перевод отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <FormLayout>
      <h1>🔄 Перевод в отдел</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик *</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
        <div className="form-group"><label>Ваш ранг *</label><input type="text" required value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} /></div>
        <div className="form-group"><label>Текущий отдел *</label><input type="text" required value={formData.currentDepartment} onChange={(e) => setFormData({...formData, currentDepartment: e.target.value})} /></div>
        <div className="form-group"><label>Желаемый отдел *</label><input type="text" required value={formData.targetDepartment} onChange={(e) => setFormData({...formData, targetDepartment: e.target.value})} /></div>
        <div className="form-group"><label>Причина *</label><textarea required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows="4" /></div>
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