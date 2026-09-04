import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

const DEPARTMENTS = [
  { id: 'ib', name: 'IB', emoji: '🕵️' }, { id: 'cid', name: 'CID', emoji: '🔍' },
  { id: 'fa', name: 'FA', emoji: '🆓' }, { id: 'hrt', name: 'HRT', emoji: '🛡️' },
  { id: 'atf', name: 'ATF', emoji: '💥' }, { id: 'af', name: 'AF', emoji: '✈️' },
  { id: 'ocu', name: 'OCU', emoji: '⚖️' }, { id: 'dea', name: 'DEA', emoji: '💊' },
  { id: 'fna', name: 'FNA', emoji: '📚' }, { id: 'nsb', name: 'NSB', emoji: '🏛️' },
  { id: 'trainee', name: 'Trainee', emoji: '📖' }
];

export default function ReportForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', department: '', currentRank: '', targetRank: '', isInstructor: '', workLinks: '' });

  const targetRankNum = parseInt(formData.targetRank);
  const showInstructorField = (targetRankNum === 9 || targetRankNum === 10) && formData.department !== 'fa';

  useEffect(() => {
    fetch('/api/me').then(res => res.json()).then(data => { if (!data.user) { router.push('/'); return; } setUser(data.user); setLoading(false); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showInstructorField && formData.isInstructor !== 'yes') { alert('⚠️ Для 9-10 ранга нужен инструктор!'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'report', ...formData }) });
      if (res.ok) { alert('✅ Отчёт отправлен!'); router.push('/dashboard'); }
      else { const err = await res.json(); throw new Error(err.error || 'Ошибка'); }
    } catch (error) { alert('❌ ' + error.message); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <FormLayout>
      <h1>📋 Отчёт о повышении</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик *</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} /></div>
        <div className="form-group"><label>Отдел *</label><select required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}><option value="">-- Выберите --</option>{DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}</select></div>
        <div className="form-group"><label>Текущий ранг *</label><select required value={formData.currentRank} onChange={(e) => setFormData({...formData, currentRank: e.target.value})}><option value="">-- Выберите --</option>{['1','2','3','4','5','6','7','8','9','10'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
        <div className="form-group"><label>Целевой ранг *</label><select required value={formData.targetRank} onChange={(e) => setFormData({...formData, targetRank: e.target.value})}><option value="">-- Выберите --</option>{['1','2','3','4','5','6','7','8','9','10'].map(r => <option key={r} value={r}>{r}</option>)}</select></div>
        {showInstructorField && <div className="form-group"><label>Назначены на инструктора? *</label><select required value={formData.isInstructor} onChange={(e) => setFormData({...formData, isInstructor: e.target.value})}><option value="">-- Выберите --</option><option value="yes">✅ Да</option><option value="no">❌ Нет</option></select></div>}
        <div className="form-group"><label>Ссылки на работу *</label><textarea required value={formData.workLinks} onChange={(e) => setFormData({...formData, workLinks: e.target.value})} rows="4" /></div>
        <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? '⏳ Отправка...' : '📤 Отправить'}</button>
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