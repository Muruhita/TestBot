import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const DEPARTMENTS = [
  { id: 'ib', name: 'IB', emoji: '🕵️' },
  { id: 'cid', name: 'CID', emoji: '🔍' },
  { id: 'fa', name: 'FA', emoji: '🆓' },
  { id: 'hrt', name: 'HRT', emoji: '🛡️' },
  { id: 'atf', name: 'ATF', emoji: '💥' },
  { id: 'af', name: 'AF', emoji: '✈️' },
  { id: 'ocu', name: 'OCU', emoji: '⚖️' },
  { id: 'dea', name: 'DEA', emoji: '💊' },
  { id: 'fna', name: 'FNA', emoji: '📚' },
  { id: 'nsb', name: 'NSB', emoji: '🏛️' },
  { id: 'trainee', name: 'Trainee', emoji: '📖' }
];

const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function ReportForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    currentRank: '',
    targetRank: '',
    isInstructor: '',
    workLinks: ''
  });

  const targetRankNum = parseInt(formData.targetRank);
  const showInstructorField = (targetRankNum === 9 || targetRankNum === 10) && formData.department !== 'fa';

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/');
          return;
        }
        setUser(data.user);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showInstructorField && formData.isInstructor !== 'yes') {
      alert('⚠️ Для повышения на 9 или 10 ранг необходимо подтвердить назначение на инструктора!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'report',
          department: formData.department,
          fullName: formData.fullName,
          currentRank: formData.currentRank,
          targetRank: formData.targetRank,
          isInstructor: formData.isInstructor || 'no',
          workLinks: formData.workLinks
        })
      });
      if (res.ok) {
        alert('✅ Отчёт успешно отправлен!');
        router.push('/dashboard');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Ошибка отправки');
      }
    } catch (error) {
      alert('❌ Ошибка при отправке отчёта: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="form-page">
        <div className="bg-gradient"></div>
        <button onClick={() => router.push('/dashboard')} className="back-btn">← Назад к выбору</button>
        
        <div className="form-container">
          <h1>📋 Отчёт о повышении</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Имя Фамилия + Статик *</label><input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Например: Sanya Suspect 270726" /></div>
            <div className="form-group"><label>Выберите отдел *</label><select required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}><option value="">-- Выберите отдел --</option>{DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}</select></div>
            <div className="form-group"><label>Ваш текущий ранг *</label><select required value={formData.currentRank} onChange={(e) => setFormData({...formData, currentRank: e.target.value})}><option value="">-- Выберите ранг --</option>{RANKS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            <div className="form-group"><label>На какой ранг повышаетесь *</label><select required value={formData.targetRank} onChange={(e) => setFormData({...formData, targetRank: e.target.value})}><option value="">-- Выберите ранг --</option>{RANKS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
            
            {showInstructorField && (
              <div className="form-group">
                <label>Назначены ли вы на инструктора? *</label>
                <select required value={formData.isInstructor} onChange={(e) => setFormData({...formData, isInstructor: e.target.value})}>
                  <option value="">-- Выберите ответ --</option>
                  <option value="yes">✅ Да</option>
                  <option value="no">❌ Нет</option>
                </select>
              </div>
            )}

            <div className="form-group"><label>Ссылки на проделанную работу *</label><textarea required value={formData.workLinks} onChange={(e) => setFormData({...formData, workLinks: e.target.value})} rows="4" /></div>
            <div className="form-group"><label>Discord ID</label><input type="text" value={`${user.username} (${user.id})`} disabled className="disabled-input" /></div>
            <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? '⏳ Отправка...' : '📤 Отправить отчёт'}</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-page { min-height: calc(100vh - 60px); padding: 30px; position: relative; }
        .bg-gradient { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background: linear-gradient(135deg, #0a0a0a 20%, #1a1a3e 50%, #0a0a0a 80%); }
        .back-btn { background: rgba(255, 255, 255, 0.08); color: #aaa; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; transition: all 0.3s; font-size: 14px; position: relative; z-index: 10; }
        .back-btn:hover { background: rgba(255, 255, 255, 0.15); color: white; transform: translateY(-2px); }
        .form-container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border-radius: 20px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); position: relative; z-index: 10; animation: fadeIn 0.5s ease; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
        .disabled-input { opacity: 0.5; cursor: not-allowed; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; transform: translateY(-2px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
}
