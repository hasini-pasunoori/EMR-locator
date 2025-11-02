import React, { useState, useEffect } from 'react';

const ResourceFinder = ({ user }) => {
  const [location, setLocation] = useState('');
  const [resourceType, setResourceType] = useState('hospital');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call for now
      setTimeout(() => {
        setResults([
          {
            id: 1,
            name: 'City General Hospital',
            type: 'hospital',
            address: '123 Main St, City, State',
            distance: '0.5 miles',
            phone: '(555) 123-4567',
            rating: 4.5
          },
          {
            id: 2,
            name: 'Emergency Medical Center',
            type: 'hospital',
            address: '456 Oak Ave, City, State',
            distance: '1.2 miles',
            phone: '(555) 987-6543',
            rating: 4.2
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="resource-finder">
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-4">
            <div className="search-panel p-4" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 className="text-white mb-4">
                <i className="fas fa-search me-2 text-danger"></i>
                Find Resources
              </h3>
              
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label className="form-label text-white">Resource Type</label>
                  <select 
                    className="form-control"
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                  >
                    <option value="hospital">Hospitals</option>
                    <option value="pharmacy">Pharmacies</option>
                    <option value="blood-bank">Blood Banks</option>
                    <option value="oxygen">Oxygen Suppliers</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-white">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary-red w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2"></i>
                      Search
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="col-lg-8">
            <div className="results-panel">
              {results.length > 0 ? (
                <div>
                  <h4 className="text-white mb-4">
                    Found {results.length} {resourceType}(s) near you
                  </h4>
                  
                  {results.map(result => (
                    <div key={result.id} className="result-card mb-3 p-4" style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h5 className="text-white mb-2">{result.name}</h5>
                          <p className="text-muted mb-1">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {result.address}
                          </p>
                          <p className="text-muted mb-1">
                            <i className="fas fa-phone me-2"></i>
                            {result.phone}
                          </p>
                          <p className="text-muted">
                            <i className="fas fa-route me-2"></i>
                            {result.distance}
                          </p>
                        </div>
                        <div className="col-md-4 text-end">
                          <div className="mb-2">
                            <span className="badge bg-warning">
                              <i className="fas fa-star me-1"></i>
                              {result.rating}
                            </span>
                          </div>
                          <div className="d-grid gap-2">
                            <button className="btn btn-primary-red btn-sm">
                              <i className="fas fa-directions me-2"></i>
                              Get Directions
                            </button>
                            <button className="btn btn-outline-light btn-sm">
                              <i className="fas fa-phone me-2"></i>
                              Call Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-search fa-3x mb-3"></i>
                  <h4>Search for medical resources</h4>
                  <p>Enter your location and select a resource type to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFinder;