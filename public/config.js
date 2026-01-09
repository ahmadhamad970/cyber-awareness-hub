// Configuration for API endpoints
// Update this file with your Render backend URL after deployment
const API_CONFIG = {
  // For local development
  // API_URL: 'http://localhost:3000'
  
  // For production - replace with your actual Render URL
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://cyber-awareness-hub.onrender.com'
};

// Helper function to make API calls
function getApiUrl(endpoint) {
  return `${API_CONFIG.API_URL}${endpoint}`;
}
