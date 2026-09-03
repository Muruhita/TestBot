import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TransferForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ rank: '', currentDepartment: '', targetDepartment: '', reason: '' });

  const departments = ['IB', 'CID', 'FA', 'HRT', 'ATF', 'AF', 'OCU', 'DEA', 'FNA', 'NSB', 'Trainee'];

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => { if (data.nickname) setNickname(data.nickname); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'transfer', fullName: nickname, ...formData }) });
    if (res.ok) { alert('✅ Заявка отправлена!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>🔄 Перевод в отдел</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя Фамилия + Статик</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
          </div>
          <div className="form-group">
            <label>Ваш ранг</label>
            <input type="text" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Текущий отдел</label>
            <select value={formData.currentDepartment} onChange={(e) => setFormData({...formData, currentDepartment: e.target.value})} required>
              <option value="">-- Выберите --</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Желаемый отдел</label>
            <select value={formData.targetDepartment} onChange={(e) => setFormData({...formData, targetDepartment: e.target.value})} required>
              <option value="">-- Выберите --</option>
              {departments.filter(d => d !== 'Trainee').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Причина перевода</label>
            <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required rows="4" />
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
