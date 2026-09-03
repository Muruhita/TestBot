import Redis from 'ioredis';
import { verifyToken } from '../../lib/discord';
import { containsBadWords } from '../../lib/badwords';
import { isBlacklisted } from '../../lib/antispam';

const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });

export default async function handler(req, res) {
  const token = req.cookies.token;
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const nickname = await redis.get(`nickname:${user.id}`);
    const banned = await isBlacklisted(user.id);
    return res.status(200).json({ user, nickname, banned });
  }

  if (req.method === 'POST') {
    const { nickname } = req.body;
    if (!nickname || containsBadWords(nickname)) {
      return res.status(400).json({ error: 'Никнейм содержит запрещенные слова!' });
    }
    await redis.set(`nickname:${user.id}`, nickname);
    return res.status(200).json({ message: 'Никнейм сохранен!' });
  }
}