import React, { useState, useEffect } from 'react';
import salonService from '../services/salonService';
import type { Salon } from '../types/salon';

const SalonList: React.FC = () => {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

    useEffect(() => {
        loadSalons();
    }, []);

    const loadSalons = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await salonService.getSalons(0, 100);
            
            const salonsArray = data.content || data || [];
            setSalons(salonsArray);
        } catch (err) {
            console.error("Error fetching salons:", err);
            setError("Failed to load salons from the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSalon = async (id: number) => {
        try {
            setDetailsLoading(true);
            const fullDetails = await salonService.getSalonById(id);
            setSelectedSalon(fullDetails);
        } catch (err) {
            console.error("Error fetching salon details:", err);
            alert("Failed to fetch salon details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading real data from PostgreSQL...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="salon-container-layout">
            {/* Salon List Section */}
            <div className="salon-list-section">
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
                                <tr 
                                    key={salon.id} 
                                    onClick={() => handleSelectSalon(salon.id)}
                                    className={`salon-row ${selectedSalon?.id === salon.id ? 'active-row' : ''}`}
                                >
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

            {/* Salon Details Section */}
            <div className="salon-details-section">
                {detailsLoading && <div className="details-box loading-box">Loading details...</div>}
                
                {!detailsLoading && !selectedSalon && (
                    <div className="details-box empty-box">
                        <h2>Salon Details</h2>
                        <p>Click on any salon from the list to see its full details.</p>
                    </div>
                )}

                {!detailsLoading && selectedSalon && (
                    <div className="salon-details-card">
                        <div className="salon-details-body">
                            <div className="salon-details-header">
                                <h3>{selectedSalon.name}</h3>
                                <span className="details-badge">{selectedSalon.district}</span>
                            </div> 
                            
                            <h4 className="details-sub-header">Location & Contact</h4>
                            
                            <div className="details-data-row">
                                <span className="details-data-label">📍 Address</span>
                                <span className="details-data-value">{selectedSalon.address}</span>
                            </div>

                            <div className="details-data-row">
                                <span className="details-data-label">📞 Phone</span>
                                <span className="details-data-value">{selectedSalon.phoneNumber}</span>
                            </div>

                            {selectedSalon.website && (
                                <div className="details-data-row">
                                    <span className="details-data-label">🌐 Website</span>
                                    <span className="details-data-value">
                                        <a href={selectedSalon.website} target="_blank" rel="noopener noreferrer" className="visit-website-link">
                                            Visit website
                                        </a>
                                    </span>
                                </div>
                            )}

                            <h4 className="details-sub-header">Details & Rating</h4>
                            
                            <div className="details-data-row">
                                <span className="details-data-label">✂️ Services</span>
                                <span className="details-data-value">{selectedSalon.servicesOffered}</span>
                            </div>

                            <div className="details-data-row">
                                <span className="details-data-label">💰 Price range</span>
                                <span className="details-data-value">{selectedSalon.priceRange}</span>
                            </div>

                            <div className="details-data-row">
                                <span className="details-data-label">⭐ Rating</span>
                                <span className="details-data-value">
                                    <span className="rating-stars">{"★".repeat(Math.round(selectedSalon.rating))}</span>
                                    {selectedSalon.rating} / 5.0 ({selectedSalon.numberOfReviews} reviews)
                                </span>
                            </div>

                            <div className="action-buttons-container">
                                <button className="close-details-btn" onClick={() => setSelectedSalon(null)}>
                                    Close details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalonList;