import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

const RANK_OPTIONS = ['1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15'];

export default function HighRankReportForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', rankRange: '', workLink: '' });

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => { if (!data.user) { router.push('/'); return; } setUser(data.user); setLoading(false); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'highrank', ...formData }) });
    if (res.ok) { alert('✅ Отчёт отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <FormLayout>
      <h1>🌟 Отчёт на повышение (Хай Ранги)</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик *</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
        <div className="form-group"><label>С какого на какой ранг *</label><select required value={formData.rankRange} onChange={(e) => setFormData({...formData, rankRange: e.target.value})}><option value="">-- Выберите --</option>{RANK_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
        <div className="form-group"><label>Ссылка на работу *</label><textarea required value={formData.workLink} onChange={(e) => setFormData({...formData, workLink: e.target.value})} rows="4" /></div>
        <button type="submit" className="submit-btn">📤 Отправить</button>
      </form>
      <style jsx>{`
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; }
      `}</style>
    </FormLayout>
  );
}