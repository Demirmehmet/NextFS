// pages/api/login.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {username, password} = req.body;

        try {
            // Query the database for the user
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({message: 'Invalid username or password'});
            }

            // Check if the password matches
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(401).json({message: 'Invalid username or password'});
            }

            // Generate JWT token
            const token = jwt.sign({username: user.username, id: user.id}, process.env.NEXT_PUBLIC_JWT_SECRET, {
                expiresIn: '1h',
            });

            // Send token back to client
            return res.status(200).json({token});
        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({message: 'Server error'});
        }
    }

    // Only POST requests allowed
    return res.status(405).end();
}
