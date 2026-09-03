import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [banned, setBanned] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.error) return;
        setUser(data.user);
        setNickname(data.nickname || '');
        setBanned(data.banned);
      });
  }, []);

  const saveNickname = async () => {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname })
    });
    const data = await res.json();
    setStatus(data.message || data.error);
  };

  return (
    <Layout>
      <div className="profile-container">
        <h1>👤 Профиль</h1>
        {user && (
          <div className="profile-card">
            <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" className="avatar" />
            <h2>{user.username}</h2>
            <p>Discord ID: {user.id}</p>
            <div className={`status ${banned ? 'banned' : 'active'}`}>
              {banned ? '⛔ Заблокирован' : '✅ Активен'}
            </div>
            <div className="nickname-section">
              <label>Ваш игровой ник (Имя Фамилия + Статик):</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Например: Sanya Suspect 270726" />
              <button onClick={saveNickname}>Сохранить</button>
              {status && <p className="status-msg">{status}</p>}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
        }
        .profile-card {
          background: #161616;
          border: 1px solid #333;
          padding: 40px;
          border-radius: 20px;
          animation: fadeIn 0.5s ease;
        }
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 20px;
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
        .nickname-section {
          margin-top: 30px;
          text-align: left;
        }
        .nickname-section label {
          display: block;
          margin-bottom: 10px;
          color: #aaa;
        }
        input {
          width: 100%;
          padding: 12px;
          background: #222;
          border: 1px solid #444;
          color: white;
          border-radius: 8px;
          margin-bottom: 15px;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
        button:hover {
          background: #ccc;
        }
        .status-msg {
          margin-top: 10px;
          color: #4CAF50;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Layout>
  );
}