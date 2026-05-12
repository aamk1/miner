import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const { userId } = req.query;

    // 1. 读取用户积分请求 (GET)
    if (req.method === 'GET') {
        if (!userId) return res.status(400).json({ error: '缺少用户标识 userId' });
        const balance = await kv.get(`user:${userId}:bal`) || "0.0000";
        return res.status(200).json({ balance });
    }

    // 2. 保存用户积分请求 (POST)
    if (req.method === 'POST') {
        const { userId, balance } = req.body;
        if (!userId || balance === undefined) return res.status(400).json({ error: '无效的数据参数' });
        await kv.set(`user:${userId}:bal`, balance.toString());
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: '方法不被允许' });
}
