import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

export default function TransferToFibForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [formData, setFormData] = useState({ approval: '', rankProof: '' });

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => { if (data.nickname) setNickname(data.nickname); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'transferToFib', fullName: nickname, ...formData }) });
    if (res.ok) { alert('✅ Перевод отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <FormLayout>
      <h1>🏛️ Перевод в FIB</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия | Статик ID</label><input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required /></div>
        <div className="form-group"><label>Одобрение от начальства (ссылка)</label><input type="text" value={formData.approval} onChange={(e) => setFormData({...formData, approval: e.target.value})} required /></div>
        <div className="form-group"><label>Доказательство ранга (ссылка)</label><textarea value={formData.rankProof} onChange={(e) => setFormData({...formData, rankProof: e.target.value})} required rows="4" /></div>
        <button type="submit" className="submit-btn">📤 Отправить</button>
      </form>
      <style jsx>{`
        h1 { color: white; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; }
      `}</style>
    </FormLayout>
  );
}