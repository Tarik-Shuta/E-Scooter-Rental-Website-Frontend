import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Ride {
    id: number;
    scooterId: number;
    userId: number;
    startTime: string;
    endTime: string;
    duration: number;
    totalCost: number | string | null;
    status: 'active' | 'completed' | 'cancelled' | string;
    user?: {
        id: number;
        email: string;
        name: string;
    };
}

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const AdminRides: React.FC = () => {
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRides();
    }, []);

    const fetchRides = async () => {
        try {
            const response = await api.get('/admindashboard/rides');
            setRides(response.data);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load rides');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const formatCost = (cost: number | string | null): string => {
        if (cost === null || cost === undefined) return '$0.00';
        const numCost = typeof cost === 'string' ? parseFloat(cost) : cost;
        if (isNaN(numCost) || !isFinite(numCost)) return '$0.00';
        return `$${numCost.toFixed(2)}`;
    };

    const formatDuration = (duration: number | null | undefined): string => {
        if (!duration && duration !== 0) return '0 min';
        return `${duration} min`;
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-600';
            case 'active':
                return 'bg-blue-600';
            case 'cancelled':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-200">Loading rides...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#242424] p-4 md:p-6 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">All Rides</h1>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/admindashboard')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {rides.length === 0 ? (
                    <div className="bg-[#2e2e2e] rounded-xl shadow-sm p-8 text-center">
                        <p className="text-lg text-gray-400">No rides found</p>
                    </div>
                ) : (
                    <div className="bg-[#2e2e2e] rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-[#333333]">
                                <tr>
                                    {['ID', 'User', 'Scooter ID', 'Start Time', 'Duration', 'Cost', 'Status'].map((header) => (
                                        <th
                                            key={header}
                                            className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                {rides.map((ride) => (
                                    <tr key={ride.id} className="hover:bg-[#3a3a3a] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{ride.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{ride.user?.name || ride.user?.email || 'Unknown'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{ride.scooterId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(ride.startTime)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDuration(ride.duration)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatCost(ride.totalCost)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                                ride.status
                            )}`}
                        >
                          {ride.status}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-[#333333] border-t border-gray-700">
                            <p className="text-sm text-gray-300">
                                Showing <span className="font-medium">{rides.length}</span> rides
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRides;
