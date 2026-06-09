import React, { useState, useEffect } from 'react';
import salonService from '../services/salonService';
import type { Salon, SalonMutateRequest } from '../types/salon';

const SalonList: React.FC = () => {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

    const [filterDistrict, setFilterDistrict] = useState<string>('');

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<SalonMutateRequest>({
        name: '', address: '', district: '', phoneNumber: '', website: '', servicesOffered: '', priceRange: '', rating: 0, numberOfReviews: 0
    });

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10); 
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        loadSalons();
    }, [currentPage, pageSize]);

    const loadSalons = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await salonService.getSalons(currentPage, pageSize);
            
            const salonsArray = data.content || data || [];
            setSalons(salonsArray);

            if (data.totalPages !== undefined) {
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error("Error fetching salons:", err);
            setError("Failed to load salons from the server.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(0);
    };

    const handleSelectSalon = async (id: number) => {
        try {
            setDetailsLoading(true);
            setIsEditing(false);
            const fullDetails = await salonService.getSalonById(id);
            setSelectedSalon(fullDetails);
        } catch (err) {
            console.error("Error fetching salon details:", err);
            alert("Failed to fetch salon details.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDeleteSalon = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this salon?")) return;
        
        try {
            await salonService.deleteSalon(id);
            setSalons(prevSalons => prevSalons.filter(s => s.id !== id));
            if (selectedSalon?.id === id) {
                setSelectedSalon(null);
            }
        } catch (err) {
            console.error("Error deleting salon:", err);
            alert("Failed to delete salon. Check server logs.");
        }
    };

    const startEditing = () => {
        if (!selectedSalon) return;
        setEditForm({
            name: selectedSalon.name || '',
            address: selectedSalon.address || '',
            district: selectedSalon.district || '',
            phoneNumber: selectedSalon.phoneNumber || '',
            website: selectedSalon.website || '',
            servicesOffered: selectedSalon.servicesOffered || '',
            priceRange: selectedSalon.priceRange || '',
            rating: selectedSalon.rating || 0,
            numberOfReviews: selectedSalon.numberOfReviews || 0
        });
        setIsEditing(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'rating' || name === 'numberOfReviews' ? Number(value) : value
        }));
    };

    const handleUpdateSubmit = async () => {
        if (!selectedSalon) return;
        try {
            const updatedSalon = await salonService.updateSalon(selectedSalon.id, editForm);
            setSelectedSalon(updatedSalon); 
            setSalons(prev => prev.map(s => s.id === updatedSalon.id ? updatedSalon : s)); // Aktualizujemy tabelę
            setIsEditing(false); 
        } catch (err) {
            console.error("Error updating salon:", err);
            alert("Failed to update salon.");
        }
    };

    if (loading) {
        return <div className="loading">Loading real data from PostgreSQL...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const filteredSalons = salons.filter(salon => 
        salon.district.toLowerCase().includes(filterDistrict.toLowerCase())
    );

    return (
        <div className="salon-container-layout">
            {/* Salon List Section */}
            <div className="salon-list-section">
                <div className="list-header">
                    <h2>Available Salons in Warsaw</h2>
                    <input 
                        type="text" 
                        placeholder="🔍 Filter by district (e.g. Mokotów)..." 
                        value={filterDistrict}
                        onChange={(e) => setFilterDistrict(e.target.value)}
                        className="filter-input"
                    />
                </div>
                
                <div className="table-responsive">
                    <table className="salon-table">
                        <thead>
                        </thead>
                        <tbody>
                            {filteredSalons.map((salon) => (
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
                            {filteredSalons.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No salons found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="pagination-controls">
                    <div className="page-size-selector">
                        <label>Show: </label>
                        <select value={pageSize} onChange={handlePageSizeChange}>
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                        </select>
                    </div>

                    <div className="page-navigation">
                        <button 
                            className="page-btn" 
                            disabled={currentPage === 0} 
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            ◀ Previous
                        </button>
                        <span className="page-info">
                            Page <strong>{currentPage + 1}</strong> of <strong>{totalPages === 0 ? 1 : totalPages}</strong>
                        </span>
                        <button 
                            className="page-btn" 
                            disabled={currentPage >= totalPages - 1 || totalPages === 0} 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next ▶
                        </button>
                    </div>
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
                            {isEditing ? (
                                <div className="edit-form-container">
                                    <h3>Edit Salon</h3>
                                    
                                    <label>Name</label>
                                    <input name="name" value={editForm.name} onChange={handleEditChange} />

                                    <label>District</label>
                                    <input name="district" value={editForm.district} onChange={handleEditChange} />

                                    <label>Address</label>
                                    <input name="address" value={editForm.address} onChange={handleEditChange} />

                                    <label>Phone Number</label>
                                    <input name="phoneNumber" value={editForm.phoneNumber} onChange={handleEditChange} />

                                    <label>Website</label>
                                    <input name="website" value={editForm.website} onChange={handleEditChange} />

                                    <label>Services Offered</label>
                                    <input name="servicesOffered" value={editForm.servicesOffered} onChange={handleEditChange} />

                                    <div className="edit-row">
                                        <div className="edit-col">
                                            <label>Price Range</label>
                                            <input name="priceRange" value={editForm.priceRange} onChange={handleEditChange} />
                                        </div>
                                        <div className="edit-col">
                                            <label>Rating</label>
                                            <input type="number" step="0.1" name="rating" value={editForm.rating} onChange={handleEditChange} />
                                        </div>
                                    </div>

                                    <div className="action-buttons-container split-buttons">
                                        <button className="save-btn" onClick={handleUpdateSubmit}>Save Changes</button>
                                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
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

                                    <div className="action-buttons-container multi-action">
                                        <button className="edit-btn" onClick={startEditing}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteSalon(selectedSalon.id)}>Delete</button>
                                        <button className="close-details-btn" onClick={() => setSelectedSalon(null)}>Close details</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalonList;