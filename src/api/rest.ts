import axios from 'axios';

let rest = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL
});

export default rest;
