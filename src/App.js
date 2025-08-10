import React, { useEffect, useState, useRef } from 'react';
import OpportunitiesTable from './components/OpportunitiesTable';
import './App.css';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000';  // Adjust if needed

const sampleData = [
  {
    Id: 1,
    OpportunityId: 'OPP001',
    CompensationType: 'Fixed',
    PropertyAddress: '123 Main St',
    PropertyType: 'Residential',
    DealType: 'Sale',
    AskingPrice: 250000,
    AssignmentFee: 5000,
    ContractedPrice: 255000,
    JVShare: '50%',
    OptionPeriodExpiration: '2025-09-30T00:00:00Z',
    ClosingDate: '2025-10-15T00:00:00Z',
    Access: 'Lockbox',
    LockboxCode: 'LBX123',
    ShowingTime: '9am - 5pm',
    Quality: 'High',
    MarketingLink: 'https://example.com/marketing',
    PicturesLink: 'https://example.com/pictures',
    Wholesaler: 'John Doe',
    Notes: 'Urgent sale',
  },
  {
    Id: 2,
    OpportunityId: 'OPP002',
    CompensationType: 'Percentage',
    PropertyAddress: '456 Oak Ave',
    PropertyType: 'Commercial',
    DealType: 'Lease',
    AskingPrice: 500000,
    AssignmentFee: 10000,
    ContractedPrice: 510000,
    JVShare: '30%',
    OptionPeriodExpiration: null,
    ClosingDate: null,
    Access: 'Agent',
    LockboxCode: '',
    ShowingTime: 'By Appointment',
    Quality: 'Medium',
    MarketingLink: '',
    PicturesLink: '',
    Wholesaler: 'Jane Smith',
    Notes: 'Potential tenant interested',
  },
  // add more objects as needed
];

function App() {
  const [data, setData] = useState(sampleData);
  const [loading, setLoading] = useState(false); // No loading initially
  const [error, setError] = useState(null);

  const socketRef = useRef(null);

  const fetchOpportunities = () => {
    setLoading(true);
    fetch(`${API_URL}/api/opportunities`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(fetchedData => {
        // Keep sampleData if backend data empty
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setData(fetchedData);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOpportunities();

    // Initialize socket connection
    socketRef.current = io(API_URL);

    // Listen for update event from backend
    socketRef.current.on('opportunitiesUpdated', () => {
      console.log('Received opportunitiesUpdated event, refreshing data...');
      fetchOpportunities();
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (loading) return <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1 style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>Project Rootbeer Board</h1>
      <OpportunitiesTable data={data} />
    </div>
  );
}

export default App;
