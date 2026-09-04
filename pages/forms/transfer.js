import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const DEPARTMENTS = [
  { id: 'cid', name: 'CID', emoji: '🚔' },
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

export default function TransferForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    rank: '',
    currentDepartment: '',
    targetDepartment: '',
    reason: '',
    cidExperience: '',
    cidExamples: '',
    cidServers: '',
    cidKnowledge: '',
    cidLawKnowledge: '',
    faRules: '',
    faPrevious: ''
  });

  const targetDept = formData.targetDepartment;
  const currentDept = formData.currentDepartment;
  const rankNum = parseInt(formData.rank);

  const showCidFields = targetDept === 'cid';
  const showFaFields = targetDept === 'fa';
  const isSameDepartment = currentDept && targetDept && currentDept === targetDept;
  const isFaRankValid = targetDept !== 'fa' || (targetDept === 'fa' && rankNum >= 5);

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
    if (isSameDepartment) {
      alert('❌ Нельзя перевестись в тот же отдел!');
      return;
    }
    if (!isFaRankValid) {
      alert('❌ Для перевода в FA необходим ранг 5 или выше!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'transfer',
          targetDepartment: formData.targetDepartment,
          fullName: formData.fullName,
          rank: formData.rank,
          currentDepartment: formData.currentDepartment,
          reason: formData.reason,
          ...formData
        })
      });
      if (res.ok) {
        alert('✅ Заявка на перевод успешно отправлена!');
        router.push('/dashboard');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Ошибка отправки');
      }
    } catch (error) {
      alert('❌ Ошибка при отправке заявки: ' + error.message);
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
          <h1>🔄 Перевод в отдел</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя Фамилия + Статик *</label>
              <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Например: Sanya Suspect 270726" />
            </div>
            <div className="form-group">
              <label>Ваш ранг *</label>
              <select required value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})}>
                <option value="">-- Выберите ранг --</option>
                {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Ваш текущий отдел *</label>
              <select required value={formData.currentDepartment} onChange={(e) => setFormData({...formData, currentDepartment: e.target.value})}>
                <option value="">-- Выберите текущий отдел --</option>
                {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Желаемый отдел *</label>
              <select required value={formData.targetDepartment} onChange={(e) => setFormData({...formData, targetDepartment: e.target.value})}>
                <option value="">-- Выберите желаемый отдел --</option>
                {DEPARTMENTS.filter(d => d.id !== 'trainee').map(d => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}
              </select>
            </div>
            {isSameDepartment && <div className="warning">❌ Нельзя перевестись в тот же отдел!</div>}
            {targetDept === 'fa' && !isFaRankValid && <div className="warning">❌ Для перевода в FA необходим ранг 5 или выше!</div>}
            
            <div className="form-group">
              <label>Причина перевода *</label>
              <textarea required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows="4" />
            </div>

            {showCidFields && (
              <>
                <h3>Дополнительные вопросы для CID</h3>
                <div className="form-group"><label>Чем занимается CID? *</label><textarea required value={formData.cidExperience} onChange={(e) => setFormData({...formData, cidExperience: e.target.value})} /></div>
                <div className="form-group"><label>Ваш опыт в CID? *</label><input type="text" required value={formData.cidExamples} onChange={(e) => setFormData({...formData, cidExamples: e.target.value})} /></div>
                <div className="form-group"><label>Примеры работ *</label><textarea required value={formData.cidServers} onChange={(e) => setFormData({...formData, cidServers: e.target.value})} /></div>
                <div className="form-group"><label>Серверы с CID *</label><input type="text" required value={formData.cidKnowledge} onChange={(e) => setFormData({...formData, cidKnowledge: e.target.value})} /></div>
                <div className="form-group"><label>Знания CID (1-10) *</label><select required value={formData.cidLawKnowledge} onChange={(e) => setFormData({...formData, cidLawKnowledge: e.target.value})}>{['1','2','3','4','5','6','7','8','9','10'].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
              </>
            )}

            {showFaFields && (
              <>
                <h3>Дополнительные вопросы для FA</h3>
                <div className="form-group"><label>Знания правил ПОИП *</label><textarea required value={formData.faRules} onChange={(e) => setFormData({...formData, faRules: e.target.value})} /></div>
                <div className="form-group"><label>Были ли в FA раньше? *</label><textarea required value={formData.faPrevious} onChange={(e) => setFormData({...formData, faPrevious: e.target.value})} /></div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={submitting || !isFormValid()}>
              {submitting ? '⏳ Отправка...' : '📤 Отправить заявку'}
            </button>
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
        h3 { color: #888; margin-bottom: 10px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; }
        input, textarea, select { width: 100%; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: white; border-radius: 8px; box-sizing: border-box; }
        select option { background: #1a1a1a; }
        .warning { background: rgba(255, 0, 0, 0.1); border: 1px solid #ff4444; color: #ff8080; padding: 10px; border-radius: 8px; margin-bottom: 15px; }
        .submit-btn { width: 100%; padding: 15px; background: #fff; color: #000; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s; }
        .submit-btn:hover { background: #ccc; transform: translateY(-2px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
}
