const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/api'
    : 'https://rockxy-backend.onrender.com/api';

    window.API_URL = API_URL;