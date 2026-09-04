import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FormLayout from '../../components/FormLayout';

export default function LeaveForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [leaveType, setLeaveType] = useState('IC');
  const [formData, setFormData] = useState({ department: '', reason: '', startDate: '', endDate: '' });

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => { if (data.nickname) setNickname(data.nickname); });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'leave', leaveType, fullName: nickname, ...formData }) });
    if (res.ok) { alert('✅ Отпуск отправлен!'); router.push('/dashboard'); }
    else { const err = await res.json(); alert('❌ ' + err.error); }
  };

  return (
    <FormLayout>
      <h1>🌴 Отпуск</h1>
      <div className="switcher">
        <button className={leaveType === 'IC' ? 'active' : ''} onClick={() => setLeaveType('IC')}>IC</button>
        <button className={leaveType === 'OOC' ? 'active' : ''} onClick={() => setLeaveType('OOC')}>OOC</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Имя Фамилия + Статик</label><input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required /></div>
        <div className="form-group"><label>Отдел</label><input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required /></div>
        <div className="form-group"><label>Причина</label><textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required rows="4" /></div>
        <div className="date-row"><div><label>Начало</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required /></div><div><label>Конец</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required /></div></div>
        <button type="submit" className="submit-btn">📤 Отправить</button>
      </form>
      <style jsx>{`
        h1 { color: white; margin-bottom: 30px; }
        .switcher { display: flex; gap: 10px; margin-bottom: 20px; }
        .switcher button { flex: 1; padding: 10px; background: #222; color: #888; border: none; border-radius: 8px; cursor: pointer; }
        .switcher button.active { background: #fff; color: #000; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; }
      `}</style>
    </FormLayout>
  );
}