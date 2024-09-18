// pages/api/verifyToken.js
import jwt from 'jsonwebtoken';

//Serverside secret key kontrolü
export default function handler(req, res) {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        return res.status(200).json({ username: decoded.username });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
