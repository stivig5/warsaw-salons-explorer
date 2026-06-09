import React, { useState, useEffect } from 'react';
import salonService from '../services/salonService';
import type { Salon } from '../types/salon';

const SalonList: React.FC = () => {
    // Strongly typed states
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSalons();
    }, []);

    const loadSalons = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetching first page (0) with up to 100 items
            const data = await salonService.getSalons(0, 100);
            setSalons(data.content);
        } catch (err) {
            console.error("Error fetching salons:", err);
            setError("Failed to load salons from the server.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading real data from PostgreSQL...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="salon-list-container">
            <h2>Available Salons in Warsaw</h2>
            <div className="table-responsive">
                <table className="salon-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>District</th>
                            <th>Price Range</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salons.map((salon) => (
                            <tr key={salon.id}>
                                <td>{salon.id}</td>
                                <td><strong>{salon.name}</strong></td>
                                <td>{salon.district}</td>
                                <td>{salon.priceRange}</td>
                                <td>{salon.rating} ⭐</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalonList;