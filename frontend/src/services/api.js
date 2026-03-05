import axios from 'axios';

const api = axios.create({
    baseURL: 'https://invoicemaker-k61o.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
