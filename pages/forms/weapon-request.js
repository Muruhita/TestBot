import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

export default function WeaponRequestForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ rank: '', department: '', item: '' });

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => { if (data.nickname) setNickname(data.nickname); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'weaponRequest', fullName: nickname, ...formData }) });
    if (res.ok) { alert('✅ Запрос отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <FormLayout>
      <h1>🔫 Спец Вооружение</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик</label><input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required /></div>
        <div className="form-group"><label>Ваш ранг</label><input type="text" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required /></div>
        <div className="form-group"><label>Ваш отдел</label><input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required /></div>
        <div className="form-group"><label>Предмет на выбор</label><select value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} required><option value="">-- Выберите --</option><option>Пистолет</option><option>Автомат</option><option>Снайперская винтовка</option><option>Дробовик</option><option>Бронежилет</option><option>Граната</option><option>Спец. щит</option></select></div>
        <button type="submit" className="submit-btn">📤 Отправить</button>
      </form>
      <style jsx>{`
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, select { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; }
      `}</style>
    </FormLayout>
  );
}