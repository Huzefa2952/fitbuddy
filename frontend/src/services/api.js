// Simple API helper for backend requests in the FitBuddy starter app.
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;
