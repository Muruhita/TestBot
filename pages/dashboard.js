import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  const isAdmin = user && user.id === '1018113109346504744';

  return (
    <div className="dashboard">
      {/* Анимированный фон */}
      <div className="animated-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Шапка с вкладками */}
      <div className="header">
        <h1>🏛️ Majestic FIB Forms</h1>
        <div className="user-info">
          <img 
            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
            alt="Avatar" 
            className="avatar"
          />
          <span>{user.username}</span>
          
          {isAdmin && (
            <button onClick={() => router.push('/admin')} className="admin-btn">
              🛠️ Админ-панель
            </button>
          )}

          <button onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </div>

      {/* Вкладки */}
      <div className="tabs">
        <button className="tab active" onClick={() => router.push('/dashboard')}>📝 Формы</button>
        <button className="tab" onClick={() => router.push('/profile')}>👤 Профиль</button>
        <button className="tab" onClick={() => router.push('/help')}>📖 Справка</button>
        {isAdmin && (
          <button className="tab" onClick={() => router.push('/admin')}>🛠️ Админ</button>
        )}
      </div>

      {/* Карточки форм */}
      <div className="cards-grid">
        <div className="card" onClick={() => router.push('/forms/promotion')}>
          <div className="card-icon">📈</div>
          <h3>Запрос на повышение</h3>
          <p>Подать запрос на повышение</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/transfer')}>
          <div className="card-icon">🔄</div>
          <h3>Перевод в отдел</h3>
          <p>Подать заявку на перевод в другой отдел</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/report')}>
          <div className="card-icon">📋</div>
          <h3>Отчёт о повышении</h3>
          <p>Подать отчёт о повышении для своего отдела</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/high-rank-report')}>
          <div className="card-icon">🌟</div>
          <h3>Отчёт на повышение (Хай Ранги)</h3>
          <p>Повышение для старшего состава</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/resignation')}>
          <div className="card-icon">🚪</div>
          <h3>Заявление на увольнение</h3>
          <p>Подать заявление на увольнение из FIB</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/reinstatement')}>
          <div className="card-icon">🔁</div>
          <h3>Восстановление</h3>
          <p>Вернуться в FIB после увольнения</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/transfer-to-fib')}>
          <div className="card-icon">🏛️</div>
          <h3>Перевод в FIB</h3>
          <p>Перевестись в FIB из другого отдела</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/weapon-request')}>
          <div className="card-icon">🔫</div>
          <h3>Спец Вооружение</h3>
          <p>Запросить специальное вооружение</p>
        </div>

        <div className="card" onClick={() => router.push('/forms/leave')}>
          <div className="card-icon">🌴</div>
          <h3>Отпуск</h3>
          <p>Подать заявку на IC или OOC отпуск</p>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: #0a0a0a;
          color: white;
          padding: 30px;
        }

        /* Анимированный фон с шарами */
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
        .orb-4 {
          width: 200px;
          height: 200px;
          background: #888;
          top: 20%;
          left: 30%;
          animation-delay: -6s;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -50px) scale(1.1); }
        }

        /* Шапка */
        .header {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto 30px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideDown 0.5s ease;
        }
        .header h1 {
          font-size: 28px;
          margin: 0;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
          color: #aaa;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .logout-btn, .admin-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .logout-btn:hover, .admin-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .admin-btn {
          background: rgba(88, 101, 242, 0.3);
          border-color: #5865F2;
        }
        .admin-btn:hover {
          background: rgba(88, 101, 242, 0.6);
        }

        /* Вкладки */
        .tabs {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          justify-content: center;
        }
        .tab {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #aaa;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .tab:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        .tab.active {
          color: black;
          background: white;
          font-weight: bold;
        }

        /* Карточки */
        .cards-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.4s ease;
          text-align: center;
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }
        .card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #fff;
          box-shadow: 0 15px 40px rgba(255, 255, 255, 0.1);
        }
        .card-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        .card h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .card p {
          color: #888;
          font-size: 14px;
        }

        /* Анимации */
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

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
      `}</style>
    </div>
  );
}
