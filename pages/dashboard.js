
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from "../components/Layout";
import apiClient from "../lib/axios";

export default function Dashboard() {
    const [meal, setMeal] = useState('');
    const [calories, setCalories] = useState('');
    const [calorieEntries, setCalorieEntries] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const router = useRouter();


    // Fetch calorie entries and total calories
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
            return;
        }

        const fetchCalorieEntries = async () => {
            try {
                const res = await apiClient.get('/calorieEntry');
                const { entries } = res.data;

                setCalorieEntries(entries);
                const total = entries.reduce((sum, entry) => sum + entry.calories, 0);
                setTotalCalories(total);
            } catch (error) {
                console.error('Error fetching calorie entries:', error);
            }
        };

        fetchCalorieEntries();
    }, [router]);

    // Handle new calorie entry submission
    const handleAddEntry = async (e) => {
        e.preventDefault();

        try {
            const res = await apiClient.post('/calorieEntry', { meal, calories });

            const newEntry = res.data;
            setCalorieEntries([...calorieEntries, newEntry]);

            // Update total calories
            setTotalCalories(totalCalories + parseInt(calories));

            // Clear form
            setMeal('');
            setCalories('');
        } catch (error) {
            console.error('Error adding calorie entry:', error);
        }
    };

    return (
        <Layout>
            <h1>Dashboard</h1>

            {/* Calorie Entry Form */}
            <form onSubmit={handleAddEntry}>
                <input
                    type="text"
                    placeholder="Meal"
                    value={meal}
                    onChange={(e) => setMeal(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    required
                />
                <button type="submit">Add Entry</button>
            </form>

            {/* Display Calorie Entries */}
            <h2>Calorie Entries</h2>
            <ul>
                {calorieEntries.map((entry, index) => (
                    <li key={index}>
                        {entry.meal}: {entry.calories} calories
                    </li>
                ))}
            </ul>

            {/* Total Calories */}
            <h3>Total Calories: {totalCalories}</h3>
        </Layout>
    );
}
