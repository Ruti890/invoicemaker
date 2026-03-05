import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Eye, Trash, Download, Search, FileText, Calendar, DollarSign, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Invoices = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/invoices');
            setInvoices(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await api.delete(`/invoices/${id}`);
                fetchInvoices();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDownload = async (id) => {
        try {
            const res = await api.get(`/invoices/${id}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
            alert('Error downloading PDF');
        }
    };

    const filteredInvoices = invoices.filter(invoice =>
        invoice.number.toString().includes(searchTerm) ||
        (invoice.Client && invoice.Client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
                    <p className="text-gray-400">Manage and track your invoices</p>
                </div>
                <Link
                    to="/invoices/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} className="mr-2" />
                    Create Invoice
                </Link>
            </div>

            <div className="bg-[#111] rounded-2xl shadow-lg border border-gray-800 mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search invoices by number or client..."
                        className="w-full bg-[#1a1a1a] border border-gray-800 text-white pl-10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-gray-400 py-8">Loading invoices...</div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No invoices found</div>
                ) : (
                    filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="bg-[#111] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all shadow-lg flex flex-col md:flex-row items-center justify-between group">
                            <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mr-4">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Invoice #{invoice.number}</h3>
                                    <p className="text-gray-400 text-sm">{invoice.Client ? invoice.Client.name : 'Unknown Client'}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Calendar size={16} className="mr-2" />
                                    {new Date(invoice.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-white font-bold">
                                    <DollarSign size={16} className="mr-1 text-green-500" />
                                    {isNaN(parseFloat(invoice.total)) ? '0.00' : parseFloat(invoice.total).toFixed(2)}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Edit Invoice"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(invoice.id)}
                                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        title="Download PDF"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Invoice"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Invoices;
