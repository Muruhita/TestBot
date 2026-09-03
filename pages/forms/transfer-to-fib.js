import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TransferToFibForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ approval: '', rankProof: '' });

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
      body: JSON.stringify({ type: 'transferToFib', fullName: nickname, ...formData })
    });
    if (res.ok) { alert('✅ Заявка на перевод в FIB отправлена!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>🏛️ Перевод в FIB</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя Фамилия | Статик ID</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
          </div>
          <div className="form-group">
            <label>✅ Одобрение от начальства (ссылка)</label>
            <input type="text" value={formData.approval} onChange={(e) => setFormData({...formData, approval: e.target.value})} required placeholder="Вставьте ссылку на одобрение" />
          </div>
          <div className="form-group">
            <label>📸 Доказательство ранга (Скрин с планшета)</label>
            <textarea value={formData.rankProof} onChange={(e) => setFormData({...formData, rankProof: e.target.value})} required rows="4" placeholder="Вставьте ссылку на скриншот" />
          </div>
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
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #aaa; }
        input, textarea {
          width: 100%; padding: 12px; background: #222; border: 1px solid #444;
          color: white; border-radius: 8px; box-sizing: border-box;
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