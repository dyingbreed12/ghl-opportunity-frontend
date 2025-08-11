import React, { useEffect, useState, useRef } from 'react';
import OpportunitiesTable from './components/OpportunitiesTable';
import './App.css';
import { io } from 'socket.io-client';

const API_URL = 'https://ghl-opportunity-dashboard.onrender.com';

function App() {
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const socketRef = useRef(null);

  const fetchOpportunities = () => {
    fetch(`${API_URL}/api/opportunities`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(fetchedData => {
        if (Array.isArray(fetchedData)) {
          setOpportunitiesData(fetchedData);
        } else {
          setOpportunitiesData([]);
        }
      })
      .catch(err => {
        // You can optionally log error here, but no UI handling
        console.error('Fetch error:', err);
        setOpportunitiesData([]);
      });
  };

  useEffect(() => {
    fetchOpportunities();

    socketRef.current = io(API_URL);
    socketRef.current.on('opportunitiesUpdated', () => {
      console.log('Received opportunitiesUpdated event, refreshing data...');
      fetchOpportunities();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1 style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>Project Rootbeer Board</h1>
      <OpportunitiesTable data={opportunitiesData} />
    </div>
  );
}

export default App;
