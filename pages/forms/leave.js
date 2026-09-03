import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LeaveForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [leaveType, setLeaveType] = useState('IC');
  const [formData, setFormData] = useState({
    department: '', reason: '', startDate: '', endDate: ''
  });

  const departments = [
    'IB', 'CID', 'FA', 'HRT', 'ATF', 'AF', 'OCU', 'DEA', 'FNA', 'NSB'
  ];

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.nickname) setNickname(data.nickname);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'leave', leaveType, fullName: nickname, ...formData })
    });
    if (res.ok) { alert('✅ Заявка на отпуск отправлена!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>🌴 Отпуск</h1>
        
        <div className="type-switcher">
          <button 
            type="button" 
            className={leaveType === 'IC' ? 'active' : ''} 
            onClick={() => setLeaveType('IC')}
          >
            IC Отпуск
          </button>
          <button 
            type="button" 
            className={leaveType === 'OOC' ? 'active' : ''} 
            onClick={() => setLeaveType('OOC')}
          >
            OOC Отпуск
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Имя Фамилия + Статик</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
          </div>
          <div className="form-group">
            <label>🏢 Отдел</label>
            <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
              <option value="">-- Выберите отдел --</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>📝 Причина</label>
            <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required rows="4" />
          </div>
          <div className="form-group date-row">
            <div>
              <label>📅 Начало отпуска</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
            </div>
            <div>
              <label>📅 Конец отпуска</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
            </div>
          </div>
          <button type="submit" className="submit-btn">📤 Отправить</button>
        </form>
      </div>

      <style jsx>{`
        .form-container {
          max-width: 600px; margin: 0 auto; background: #161616;
          border: 1px solid #333; padding: 40px; border-radius: 20px;
          animation: fadeIn 0.5s ease;
        }
        h1 { color: white; margin-bottom: 30px; }
        .type-switcher {
          display: flex; gap: 10px; margin-bottom: 30px; background: #222;
          padding: 5px; border-radius: 10px;
        }
        .type-switcher button {
          flex: 1; padding: 12px; background: transparent; color: #888;
          border: none; border-radius: 8px; cursor: pointer; font-weight: bold;
          transition: all 0.3s;
        }
        .type-switcher button.active {
          background: #fff; color: #000; box-shadow: 0 4px 15px rgba(255,255,255,0.2);
        }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #aaa; }
        input, textarea, select {
          width: 100%; padding: 12px; background: #222; border: 1px solid #444;
          color: white; border-radius: 8px; box-sizing: border-box;
        }
        select option { background: #222; }
        .date-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 15px;
        }
        .submit-btn {
          width: 100%; padding: 15px; background: #fff; color: #000;
          border: none; border-radius: 10px; cursor: pointer; font-weight: bold;
          font-size: 16px; transition: all 0.3s;
        }
        .submit-btn:hover { background: #ccc; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}