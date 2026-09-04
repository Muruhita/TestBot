import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const RANK_OPTIONS = [
  '1-2 ранг', '2-3 ранг', '3-4 ранг', '4-5 ранг', '5-6 ранг',
  '6-7 ранг', '7-8 ранг', '8-9 ранг', '9-10 ранг', '10-11 ранг',
  '11-12 ранг', '12-13 ранг'
];

export default function PromotionForm() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    rankRange: '',
    reportLink: ''
  });

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
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'promotion',
          fullName: formData.fullName,
          rankRange: formData.rankRange,
          reportLink: formData.reportLink
        })
      });

      if (res.ok) {
        alert('✅ Заявка на повышение успешно отправлена!');
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
        {/* Анимированный фон */}
        <div className="animated-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <button onClick={() => router.push('/dashboard')} className="back-btn">
          ← Назад к выбору
        </button>
        
        <div className="form-container">
          <h1>📈 Запрос на повышение</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Имя Фамилия + Статик *</label>
              <input 
                type="text" 
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Например: Sanya Suspect 270726"
              />
            </div>

            <div className="form-group">
              <label>С какого на какой ранг вы повышаетесь *</label>
              <select
                required
                value={formData.rankRange}
                onChange={(e) => setFormData({...formData, rankRange: e.target.value})}
                className="select-input"
              >
                <option value="">-- Выберите диапазон рангов --</option>
                {RANK_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ссылка на одобренный отчет о повышении *</label>
              <textarea 
                required
                value={formData.reportLink}
                onChange={(e) => setFormData({...formData, reportLink: e.target.value})}
                placeholder="Вставьте ссылку на ваш одобренный отчет о повышении..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Discord ID</label>
              <input 
                type="text" 
                value={`${user.username} (${user.id})`}
                disabled 
                className="disabled-input" 
              />
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? '⏳ Отправка...' : '📤 Отправить заявку'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .form-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: #0a0a0a;
          color: white;
          padding: 30px;
        }

        /* Анимированный фон */
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float 10s infinite ease-in-out;
        }
        .orb-1 {
          width: 400px;
          height: 400px;
          background: #5865F2;
          top: -100px;
          left: -100px;
        }
        .orb-2 {
          width: 300px;
          height: 300px;
          background: #ffffff;
          top: 50%;
          right: -100px;
          animation-delay: -2s;
        }
        .orb-3 {
          width: 250px;
          height: 250px;
          background: #444;
          bottom: -50px;
          left: 50%;
          animation-delay: -4s;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -50px) scale(1.1); }
        }

        /* Кнопка назад */
        .back-btn {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.3s;
          font-size: 14px;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        /* Стеклянный контейнер */
        .form-container {
          position: relative;
          z-index: 10;
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeIn 0.5s ease;
        }
        h1 {
          color: white;
          margin-bottom: 30px;
          font-size: 28px;
          text-align: center;
        }

        /* Поля */
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          color: #888;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        input, textarea, .select-input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: white;
          font-size: 15px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .select-input {
          appearance: none;
          cursor: pointer;
        }
        .select-input option {
          background: #1a1a1a;
          color: white;
        }
        input:focus, textarea:focus, .select-input:focus {
          outline: none;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }
        .disabled-input {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(255, 255, 255, 0.02);
        }
        textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* Кнопка отправки */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #ccc;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(255,255,255,0.2);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Загрузка */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #0a0a0a;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-container p {
          color: #888;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}
