import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ userId }) => {
    const [history, setHistory] = useState([]);
    const [newSearch, setNewSearch] = useState({ searchType: 'donor', query: '' });

    // Fetch search history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`/api/users/history/${userId}`);
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history', error);
            }
        };
        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    // Add new search to history
    const addSearch = async () => {
        if (!newSearch.query.trim()) return; // Prevent empty queries

        try {
            await axios.post('/api/users/add-history', {
                userId,
                ...newSearch,
            });
            setNewSearch({ searchType: 'donor', query: '' });
            setHistory((prev) => [
                ...prev,
                { ...newSearch, date: new Date().toISOString() },
            ]);
        } catch (error) {
            console.error('Error adding search', error);
        }
    };

    // Delete search from history
    const deleteSearch = async (historyId) => {
        try {
            await axios.delete('/api/users/delete-history', {
                data: { userId, historyId },
            });
            setHistory((prev) => prev.filter((item) => item._id !== historyId));
        } catch (error) {
            console.error('Error deleting history', error);
        }
    };

    return (
        <div className="dashboard">
            <h2>User Dashboard</h2>
            <div className="add-search">
                <h3>Add Search</h3>
                <select
                    value={newSearch.searchType}
                    onChange={(e) => setNewSearch({ ...newSearch, searchType: e.target.value })}
                >
                    <option value="donor">Donor</option>
                    <option value="hospital">Hospital</option>
                </select>
                <input
                    type="text"
                    placeholder="Search Query"
                    value={newSearch.query}
                    onChange={(e) => setNewSearch({ ...newSearch, query: e.target.value })}
                />
                <button onClick={addSearch}>Add</button>
            </div>
            <div className="search-history">
                <h3>Search History</h3>
                <ul>
                    {history.map((item) => (
                        <li key={item._id}>
                            {item.searchType.toUpperCase()}: {item.query} ({new Date(item.date).toLocaleString()})
                            <button onClick={() => deleteSearch(item._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;

