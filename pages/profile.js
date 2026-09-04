import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

const DEPARTMENTS = [
  { id: 'ib', name: 'IB (Intelligence Branch)' },
  { id: 'cid', name: 'CID (Criminal Investigation)' },
  { id: 'fa', name: 'FA (Free Agent)' },
  { id: 'hrt', name: 'HRT (Hostage Rescue)' },
  { id: 'atf', name: 'ATF (Anti Terrorism)' },
  { id: 'af', name: 'AF (Air Force)' },
  { id: 'ocu', name: 'OCU (Organized Crime)' },
  { id: 'dea', name: 'DEA (Drug Enforcement)' },
  { id: 'fna', name: 'FNA (Academy)' },
  { id: 'nsb', name: 'NSB (National Security)' },
  { id: 'trainee', name: 'Trainee (Стажёр)' }
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [banned, setBanned] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus(data.error);
          setLoading(false);
          return;
        }
        setUser(data.user);
        setNickname(data.nickname || '');
        setDepartment(data.department || '');
        setBanned(data.banned);
        setLoading(false);
      })
      .catch(() => {
        setStatus('Ошибка загрузки профиля');
        setLoading(false);
      });
  }, []);

  const saveProfile = async () => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, department })
    });
    const data = await res.json();
    setStatus(data.message || data.error);
  };

  if (loading) return <p className="loading">Загрузка...</p>;

  return (
    <Layout>
      <div className="profile-page">
        {/* Анимированный фон */}
        <div className="animated-bg">
          <div className="gradient-overlay"></div>
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
          <div className="orb orb3"></div>
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <span key={i} className={`particle p${i + 1}`}></span>
            ))}
          </div>
        </div>

        <div className={`profile-container ${visible ? 'show' : ''}`}>
          <h1>👤 Профиль</h1>
          {user && (
            <div className="profile-card">
              <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" className="avatar" />
              <h2>{user.username}</h2>
              <p className="discord-id">Discord ID: {user.id}</p>
              <div className={`status ${banned ? 'banned' : 'active'}`}>
                {banned ? '⛔ Заблокирован' : '✅ Активен'}
              </div>

              <div className="field">
                <label>Игровой ник (Имя Фамилия + Статик):</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Например: Sanya Suspect 270726" />
              </div>

              <div className="field">
                <label>Ваш отдел:</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">-- Не выбран --</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <button onClick={saveProfile} className="save-btn">Сохранить</button>
              {status && <p className="status-msg">{status}</p>}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          position: relative;
          min-height: 80vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        /* Анимированный фон */
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a3e 50%, #0a0a0a 100%);
          background-size: 400% 400%;
          animation: gradientShift 12s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float 10s ease-in-out infinite;
        }

        .orb1 {
          width: 400px;
          height: 400px;
          background: #5865F2;
          top: -10%;
          left: -10%;
        }

        .orb2 {
          width: 300px;
          height: 300px;
          background: #FF69B4;
          bottom: -10%;
          right: -10%;
          animation-delay: -3s;
        }

        .orb3 {
          width: 200px;
          height: 200px;
          background: #00FFAA;
          top: 30%;
          left: 60%;
          animation-delay: -6s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(15px, 40px) scale(1.05); }
        }

        .particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          animation: particleFloat linear infinite;
        }

        .p1 { top: 10%; left: 10%; animation-duration: 8s; }
        .p2 { top: 20%; left: 80%; animation-duration: 10s; animation-delay: 1s; }
        .p3 { top: 60%; left: 30%; animation-duration: 9s; animation-delay: 2s; }
        .p4 { top: 80%; left: 70%; animation-duration: 11s; animation-delay: 0.5s; }
        .p5 { top: 40%; left: 50%; animation-duration: 7s; animation-delay: 1.5s; }
        .p6 { top: 15%; left: 40%; animation-duration: 12s; animation-delay: 0.2s; }
        .p7 { top: 70%; left: 15%; animation-duration: 9.5s; animation-delay: 2.5s; }
        .p8 { top: 30%; left: 90%; animation-duration: 10.5s; animation-delay: 3s; }
        .p9 { top: 50%; left: 5%; animation-duration: 8.5s; animation-delay: 1.2s; }
        .p10 { top: 90%; left: 45%; animation-duration: 11.5s; animation-delay: 0.8s; }
        .p11 { top: 5%; left: 25%; animation-duration: 7.5s; animation-delay: 2.2s; }
        .p12 { top: 75%; left: 85%; animation-duration: 9.8s; animation-delay: 1.7s; }
        .p13 { top: 35%; left: 65%; animation-duration: 10.2s; animation-delay: 0.3s; }
        .p14 { top: 55%; left: 95%; animation-duration: 8.8s; animation-delay: 2.8s; }
        .p15 { top: 25%; left: 15%; animation-duration: 12.5s; animation-delay: 1.9s; }
        .p16 { top: 65%; left: 55%; animation-duration: 9.2s; animation-delay: 0.6s; }
        .p17 { top: 85%; left: 20%; animation-duration: 10.8s; animation-delay: 2.4s; }
        .p18 { top: 45%; left: 75%; animation-duration: 8.2s; animation-delay: 1.4s; }
        .p19 { top: 95%; left: 90%; animation-duration: 11.2s; animation-delay: 0.9s; }
        .p20 { top: 12%; left: 60%; animation-duration: 9.6s; animation-delay: 3.2s; }

        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0.8; }
          25% { transform: translateY(-40px) translateX(20px); opacity: 1; }
          50% { transform: translateY(-80px) translateX(-20px); opacity: 0.4; }
          75% { transform: translateY(-40px) translateX(15px); opacity: 0.9; }
          100% { transform: translateY(0) translateX(0); opacity: 0.8; }
        }

        /* Контент профиля */
        .profile-container {
          position: relative;
          z-index: 10;
          max-width: 500px;
          width: 100%;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .profile-container.show {
          opacity: 1;
          transform: translateY(0);
        }

        h1 {
          color: white;
          margin-bottom: 30px;
          text-shadow: 0 4px 30px rgba(255,255,255,0.3);
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { text-shadow: 0 4px 30px rgba(88,101,242,0.5); }
          to { text-shadow: 0 4px 30px rgba(255,105,180,0.7); }
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-bottom: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 30px rgba(88,101,242,0.5);
        }

        h2 {
          color: white;
          margin-bottom: 8px;
        }

        .discord-id {
          color: #aaa;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .status {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          margin: 15px 0;
        }

        .status.banned {
          background: #ff4444;
          color: white;
        }

        .status.active {
          background: #4CAF50;
          color: white;
        }

        .field {
          margin-bottom: 20px;
          text-align: left;
        }

        label {
          display: block;
          color: #aaa;
          margin-bottom: 8px;
        }

        input, select {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 8px;
          box-sizing: border-box;
          transition: border-color 0.3s;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #5865F2;
        }

        select option {
          background: #1a1a1a;
        }

        .save-btn {
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
          margin-top: 10px;
        }

        .save-btn:hover {
          background: #ccc;
          transform: translateY(-2px);
        }

        .status-msg {
          margin-top: 10px;
          color: #4CAF50;
          font-size: 14px;
        }

        .loading {
          color: #aaa;
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </Layout>
  );
}
