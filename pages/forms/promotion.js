import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

const RANK_OPTIONS = [
  '1-2 ранг', '2-3 ранг', '3-4 ранг', '4-5 ранг', '5-6 ранг',
  '6-7 ранг', '7-8 ранг', '8-9 ранг', '9-10 ранг', '10-11 ранг',
  '11-12 ранг', '12-13 ранг'
];

export default function PromotionForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', rankRange: '', reportLink: '' });

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) { router.push('/'); return; }
        setUser(data.user); setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'promotion', fullName: formData.fullName, rankRange: formData.rankRange, reportLink: formData.reportLink })
      });
      if (res.ok) { alert('✅ Заявка отправлена!'); router.push('/dashboard'); }
      else { const err = await res.json(); throw new Error(err.error || 'Ошибка'); }
    } catch (error) { alert('❌ ' + error.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <FormLayout>
      <h1>📈 Запрос на повышение</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик *</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Например: Sanya Suspect 270726" /></div>
        <div className="form-group"><label>С какого на какой ранг *</label><select required value={formData.rankRange} onChange={(e) => setFormData({...formData, rankRange: e.target.value})}><option value="">-- Выберите --</option>{RANK_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
        <div className="form-group"><label>Ссылка на отчет *</label><textarea required value={formData.reportLink} onChange={(e) => setFormData({...formData, reportLink: e.target.value})} rows="4" /></div>
        <div className="form-group"><label>Discord ID</label><input type="text" value={`${user.username} (${user.id})`} disabled /></div>
        <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? '⏳ Отправка...' : '📤 Отправить'}</button>
      </form>
      <style jsx>{`
        h1 { color: white; margin-bottom: 30px; text-align: center; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; transform: translateY(-2px); }
      `}</style>
    </FormLayout>
  );
}