import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import './index.css'; // Custom styles
import { ThemeProvider } from './context/ThemeContext';
// Create the root element for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
<React.StrictMode>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</React.StrictMode>,
);
