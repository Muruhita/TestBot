import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReinstatementForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ rank: '', proof: '', wasBannedWarned: 'no', approvalLink: '' });

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
      body: JSON.stringify({ type: 'reinstatement', fullName: nickname, ...formData })
    });
    if (res.ok) { alert('✅ Заявка отправлена!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>🔁 Восстановление</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя Фамилия | Статик ID</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
          </div>
          <div className="form-group">
            <label>Ранг на момент увольнения</label>
            <input type="text" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Доказательства (ссылка)</label>
            <textarea value={formData.proof} onChange={(e) => setFormData({...formData, proof: e.target.value})} required rows="4" placeholder="Ссылка на скриншоты" />
          </div>
          <div className="form-group">
            <label>Уволен после Ban/Warn?</label>
            <select value={formData.wasBannedWarned} onChange={(e) => setFormData({...formData, wasBannedWarned: e.target.value})}>
              <option value="no">Нет</option>
              <option value="yes">Да</option>
            </select>
          </div>
          {formData.wasBannedWarned === 'yes' && (
            <div className="form-group">
              <label>Ссылка на одобрение (State Fraction)</label>
              <input type="text" value={formData.approvalLink} onChange={(e) => setFormData({...formData, approvalLink: e.target.value})} required />
            </div>
          )}
          <button type="submit" className="submit-btn">📤 Отправить</button>
        </form>
      </div>

      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: #161616;
          border: 1px solid #333;
          padding: 40px;
          border-radius: 20px;
          animation: fadeIn 0.5s ease;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 8px;
          color: #aaa;
        }
        input, textarea, select {
          width: 100%;
          padding: 12px;
          background: #222;
          border: 1px solid #444;
          color: white;
          border-radius: 8px;
          box-sizing: border-box;
        }
        select option {
          background: #222;
        }
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
          transition: all 0.3s;
        }
        .submit-btn:hover {
          background: #ccc;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}