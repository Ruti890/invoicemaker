import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FileText, DollarSign, Shield } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalInvoices: 0, totalRevenue: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data:', err);
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    if (loading) return <div className="text-center text-gray-400 py-8">Loading Admin Panel...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Shield className="mr-3 text-red-500" size={32} />
                Admin Panel
            </h1>
            <p className="text-gray-400 mb-8">System-wide overview and user management.</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-lg flex items-center">
                    <div className="p-4 bg-blue-500/10 rounded-xl mr-4">
                        <Users size={32} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-lg flex items-center">
                    <div className="p-4 bg-purple-500/10 rounded-xl mr-4">
                        <FileText size={32} className="text-purple-500" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Invoices</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalInvoices || 0}</p>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 shadow-lg flex items-center">
                    <div className="p-4 bg-green-500/10 rounded-xl mr-4">
                        <DollarSign size={32} className="text-green-500" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">${(stats?.totalRevenue || 0).toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">Registered Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#1a1a1a] text-gray-400 text-sm uppercase">
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id} className="text-gray-300 hover:bg-[#1a1a1a] transition-colors">
                                        <td className="p-4 font-medium text-white">{user.name}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">No users found or error loading data.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
