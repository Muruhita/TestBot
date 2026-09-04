import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WeaponRequestForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ rank: '', department: '', item: '' });

  const departments = ['IB', 'CID', 'FA', 'HRT', 'ATF', 'AF', 'OCU', 'DEA', 'FNA', 'NSB'];

  const items = [
    'Пистолет', 'Автомат', 'Снайперская винтовка', 'Дробовик', 'Бронежилет', 'Граната', 'Спец. щит'
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
      body: JSON.stringify({ type: 'weaponRequest', fullName: nickname, ...formData })
    });
    if (res.ok) { alert('✅ Запрос на спец вооружение отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <Layout>
      <div className="form-container">
        <h1>🔫 Спец Вооружение</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя Фамилия + Статик</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required placeholder="Например: Sanya Suspect 270726" />
          </div>
          <div className="form-group">
            <label>📌 Ваш ранг</label>
            <select value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required>
              <option value="">-- Выберите ранг --</option>
              {['1','2','3','4','5','6','7','8','9','10'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>🏢 Ваш отдел</label>
            <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required>
              <option value="">-- Выберите отдел --</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>🔫 Предмет на выбор</label>
            <select value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} required>
              <option value="">-- Выберите предмет --</option>
              {items.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
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
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; color: #aaa; }
        input, select {
          width: 100%; padding: 12px; background: #222; border: 1px solid #444;
          color: white; border-radius: 8px; box-sizing: border-box;
        }
        select option { background: #222; }
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