import React from 'react';
// In a real app, you would import from your components directory:
// import PublicationsList from './components/PublicationsList';

// For this example, we're importing from the main project
import PublicationsList from '../../src/components/PublicationsList';
import './App.css';

function App(): JSX.Element {
  // In a real app, you would get this from environment variables or config
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'https://your-api-gateway-url.amazonaws.com/Prod';

  return (
    <div className="App">
      <header className="App-header">
        <h1>Digital Promise Research Publications</h1>
        <p>Explore categorized research publications</p>
      </header>
      
      <main>
        <PublicationsList 
          apiEndpoint={apiEndpoint}
        />
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2024 Digital Promise. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 