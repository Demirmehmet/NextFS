// pages/api/calorieEntry.js
import jwt from 'jsonwebtoken';
import pool from '../../lib/db';

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        const userId = decoded.id;

        if (req.method === 'GET') {
            const { rows } = await pool.query('SELECT * FROM calorie_entries WHERE user_id = $1', [userId]);
            return res.status(200).json({ entries: rows });
        }

        if (req.method === 'POST') {
            const { meal, calories } = req.body;

            const { rows } = await pool.query(
                'INSERT INTO calorie_entries (user_id, meal, calories) VALUES ($1, $2, $3) RETURNING *',
                [userId, meal, calories]
            );
            return res.status(201).json(rows[0]);
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
