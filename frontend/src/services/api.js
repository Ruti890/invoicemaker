import axios from 'axios';

const api = axios.create({
    baseURL: 'https://invoicemaker-k61o.vercel.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
