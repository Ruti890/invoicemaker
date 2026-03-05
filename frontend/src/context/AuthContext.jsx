import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // withCredentials is true in api.js, so the cookie is sent automatically IF it exists
                const res = await api.get('/auth/me'); // updated route from /auth to /auth/me
                setUser(res.data);
            } catch (err) {
                // If 401, it means no cookie or expired cookie, which is normal when not logged in
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        await api.post('/auth/login', { email, password });
        // The cookie is now set by the backend. We just fetch the user payload.
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
    };

    const register = async (name, email, password) => {
        await api.post('/auth/register', { name, email, password });
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
    };

    const logout = async () => {
        try {
            // Call the new logout endpoint to clear the httpOnly cookie
            await api.post('/auth/me');
        } catch (err) {
            console.error('Logout error', err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
