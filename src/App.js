function App() {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  };

  const boxStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  return (
    <div style={pageStyle}>
      <div style={boxStyle}>
        <h1>🚧 Service Suspended 🚧</h1>
        <p>This site is temporarily unavailable. Please check back later.</p>
      </div>
    </div>
  );
}

export default App;
