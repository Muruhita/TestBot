import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  const forms = [
    { title: 'Запрос на повышение', icon: '📈', path: '/forms/promotion', desc: 'Подать запрос' },
    { title: 'Перевод в отдел', icon: '🔄', path: '/forms/transfer', desc: 'Перевестись' },
    { title: 'Отчёт о повышении', icon: '📋', path: '/forms/report', desc: 'Отчёт для отдела' },
    { title: 'Отчёт на повышение (Хай Ранги)', icon: '🌟', path: '/forms/high-rank-report', desc: 'Для старшего состава' },
    { title: 'Заявление на увольнение', icon: '🚪', path: '/forms/resignation', desc: 'Уволиться' },
    { title: 'Восстановление', icon: '🔁', path: '/forms/reinstatement', desc: 'Вернуться в FIB' },
    { title: 'Перевод в FIB', icon: '🏛️', path: '/forms/transfer-to-fib', desc: 'Перевестись в FIB' },
    { title: 'Спец Вооружение', icon: '🔫', path: '/forms/weapon-request', desc: 'Запросить оружие' },
    { title: 'Снятие ЧС', icon: '🚫', path: '/forms/withdrawal', desc: 'Снять ЧС' },
  ];

  return (
    <Layout>
      <div className="dashboard-wrapper">
        <h1 className="page-title">📝 Формы</h1>
        
        <div className="cards-grid">
          {forms.map((form, index) => (
            <div 
              key={index} 
              className="card" 
              onClick={() => router.push(form.path)}
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div className="card-icon">{form.icon}</div>
              <h3>{form.title}</h3>
              <p>{form.desc}</p>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          position: relative;
          z-index: 10; /* чтобы контент был выше фона */
        }

        /* ===== Заголовок ===== */
        .page-title {
          font-size: 40px;
          font-weight: 800;
          text-align: center;
          color: #fff;
          margin-bottom: 40px;
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
          animation: titleGlow 3s ease-in-out infinite alternate;
        }

        @keyframes titleGlow {
          from { text-shadow: 0 4px 30px rgba(88, 101, 242, 0.5); }
          to { text-shadow: 0 4px 30px rgba(255, 105, 180, 0.7); }
        }

        /* ===== Карточки ===== */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          cursor: pointer;
          text-align: center;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease, border-color 0.4s ease;
          opacity: 0;
          animation: cardIn 0.6s ease forwards;
        }

        .card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: #5865F2;
          box-shadow: 0 20px 40px rgba(88, 101, 242, 0.4);
        }

        .card-icon {
          font-size: 56px;
          margin-bottom: 16px;
          transition: transform 0.3s ease;
        }

        .card:hover .card-icon {
          transform: scale(1.2) rotate(8deg);
        }

        .card h3 {
          font-size: 18px;
          color: #fff;
          margin-bottom: 8px;
        }

        .card p {
          font-size: 14px;
          color: #aaa;
        }

        /* Свечение внутри карточки */
        .card-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(88,101,242,0.3), transparent 70%);
          top: -30px;
          right: -30px;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .card:hover .card-glow {
          opacity: 1;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </Layout>
  );
}
