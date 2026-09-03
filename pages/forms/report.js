import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReportForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ department: '', currentRank: '', targetRank: '', isInstructor: 'no', workLinks: '' });

  const departments = ['IB', 'CID', 'FA', 'HRT', 'ATF', 'AF', 'OCU', 'DEA', 'FNA', 'NSB'];
  const targetRankNum = parseInt(formData.targetRank);
  const showInstructorField = (targetRankNum === 9 || targetRankNum === 10) && formData.department !== 'fa';

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => { if (data.nickname) setNickname(data.nickname); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'report', fullName: nickname, ...formData }) });
    if (res.ok) { alert('✅ Отчет отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>📋 Отчёт о повышении</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя Фамилия + Статик</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
          </div>
          <div className="form-group">
            <label>Отдел</label>
            <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
              <option value="">-- Выберите --</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Текущий ранг</label>
            <select value={formData.currentRank} onChange={(e) => setFormData({...formData, currentRank: e.target.value})} required>
              <option value="">-- Выберите --</option>
              {['1','2','3','4','5','6','7','8','9','10'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>На какой ранг повышаетесь</label>
            <select value={formData.targetRank} onChange={(e) => setFormData({...formData, targetRank: e.target.value, isInstructor: ''})} required>
              <option value="">-- Выберите --</option>
              {['1','2','3','4','5','6','7','8','9','10'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {showInstructorField && (
            <div className="form-group">
              <label>Назначены ли на инструктора?</label>
              <select value={formData.isInstructor} onChange={(e) => setFormData({...formData, isInstructor: e.target.value})} required>
                <option value="">-- Выберите --</option>
                <option value="yes">✅ Да</option>
                <option value="no">❌ Нет</option>
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Ссылки на проделанную работу</label>
            <textarea value={formData.workLinks} onChange={(e) => setFormData({...formData, workLinks: e.target.value})} required rows="4" />
          </div>
          <button type="submit" className="submit-btn">📤 Отправить</button>
        </form>
      </div>
      <style jsx>{`
        .form-container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; animation: fadeIn 0.5s ease; }
        h1 { color: white; text-align: center; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #aaa; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #222; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
}
