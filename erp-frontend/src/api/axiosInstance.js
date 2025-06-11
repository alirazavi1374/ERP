import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // change this to your server IP when deploying
});

export default instance;
