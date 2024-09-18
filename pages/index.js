
import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from "../components/Layout";
import apiClient from "../lib/axios";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const res = await apiClient.post('/login', { username, password });
        const { token } = res.data;
        localStorage.setItem('token', token);
        await router.push('/dashboard');
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        setError(message);
    }
  };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard'); // Redirect to dashboard if already logged in
        }
    }, []);

  return (
      <Layout>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <Link href="/register">Register</Link>
      </Layout>
  );
}
