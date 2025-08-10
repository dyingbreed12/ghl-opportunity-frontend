import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const API_URL = 'https://ghl-opportunity-dashboard.onrender.com';
  // const API_URL = 'http://localhost:5000';
  const fetchItems = async () => {
    const res = await fetch(`${API_URL}/api/items`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!name) return alert('Enter a name');
    await fetch(`${API_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    fetchItems();
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Items</h1>
      <input
        type="text"
        placeholder="New item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
