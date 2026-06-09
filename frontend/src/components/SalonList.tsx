import React, { useState, useEffect } from 'react';
import salonService from '../services/salonService';

const SalonList = () => {
    const [salons, setSalons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalons();
    }, []);

    const fetchSalons = async () => {
        try {
            setLoading(true);
            const data = await salonService.getSalons(0, 100);
            setSalons(data.content);
        } catch (error) {
            alert("Nie udało się połączyć z backendem. Upewnij się, że Spring Boot działa!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Ładowanie danych z bazy PostgreSQL...</div>;
    }

    return (
        <div className="salon-list-container">
            <h2>Dostępne salony w Warszawie</h2>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nazwa Salonu</th>
                            <th>Dzielnica</th>
                            <th>Ceny</th>
                            <th>Ocena</th>
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