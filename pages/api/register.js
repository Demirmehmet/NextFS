// pages/api/register.js

import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // Zorunlu alanları kontrol et
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        try {
            // Kullanıcı var mı kontrolü
            const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

            if (existingUser.rows.length > 0) {
                return res.status(409).json({ message: 'Username is already taken' });
            }

            // şifreyi hashleyip kaydet
            const hashedPassword = bcrypt.hashSync(password, 10);

            await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2)',
                [username, hashedPassword]
            );

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

    return res.status(405).end();
}
