import axios from 'axios';

const baseURL = String(import.meta.env.VITE_BASE_API)

export const api = axios.create({
  baseURL: 'http://127.0.0.1:4000'
});
