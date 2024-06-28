import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_BASE_URL_PROD
      : process.env.REACT_APP_API_BASE_URL,
});

export default api;
