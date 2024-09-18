import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if the user is logged in by checking if the token exists
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set to true if token exists
    }, [router.pathname]); // Rerun the check whenever the route changes

    const handleLogout = () => {
        // Remove token from localStorage and redirect to login page
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f5f5f5' }}>
                <nav>
                    <Link href="/dashboard">Dashboard</Link>
                    {/* Add other navigation links as needed */}
                </nav>

                {isLoggedIn && (
                    <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                        Logout
                    </button>
                )}
            </header>

            <main>{children}</main>

            <footer style={{ padding: '10px', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                <p>Calorie Tracking App © 2024</p>
            </footer>
        </div>
    );
}
