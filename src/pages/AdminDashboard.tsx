import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api.ts';

interface DashboardStats {
    totalUsers: number;
    totalRides: number;
    activeRides: number;
    totalRevenue: number;
}

interface User {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardStats();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axiosInstance.get('/admindashboard');
            setStats(response.data);

        } catch (err: any) {
            if (err.response?.status === 403) {
                navigate('/');
                return;
            }
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axiosInstance.get('/admindashboard/users');
            setUsers(response.data);

        } catch (err: any) {
            if (err.response?.status === 403) {
                navigate('/');
                return;
            }
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: number, newRole: 'user' | 'admin') => {
        try {

            await axiosInstance.put(`/admindashboard/users/${userId}/role`, { role: newRole });

            setUsers(users.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));

            alert('User role updated successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || 'Failed to update role');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const deleteUser = async (userId: number, userEmail: string) => {
        if (!window.confirm(`Are you sure you want to delete user: ${userEmail}? This action cannot be undone.`)) {
            return;
        }
        try {
            await axiosInstance.delete(`/admindashboard/users/${userId}`);

            setUsers(users.filter(user => user.id !== userId));

            alert('User deleted successfully');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete user';
            alert(`Error: ${errorMessage}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading && activeTab === 'dashboard') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded">
                    <strong>Error:</strong> {error}
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <header className="text-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">UrbanMove Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'dashboard'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'users'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            User Management
                        </button>
                    </nav>
                </div>

                {activeTab === 'dashboard' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-black overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="ml-5">
                                            <div className="text-sm font-medium text-white">Total Users</div>
                                            <div className="text-2xl font-semibold text-white">
                                                {stats?.totalUsers || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="ml-5">
                                            <div className="text-sm font-medium text-white">Total Rides</div>
                                            <div className="text-2xl font-semibold text-white">
                                                {stats?.totalRides || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">

                                        <div className="ml-5">
                                            <div className="text-sm font-medium text-white">Active Rides</div>
                                            <div className="text-2xl font-semibold text-white">
                                                {stats?.activeRides || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">

                                        <div className="ml-5">
                                            <div className="text-sm font-medium text-white">Total Revenue</div>
                                            <div className="text-2xl font-semibold text-white">
                                                {stats ? formatCurrency(stats.totalRevenue) : '0.00'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="bg-black shadow rounded-lg p-6 mb-8">
                            <h2 className="text-md font-semibold text-white mb-4">Quick Actions</h2>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/Adminrides')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                                >
                                    View All Rides
                                </button>

                            </div>
                        </div>


                        <div className="bg-black shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>

                        </div>
                    </>
                ) : (

                    <div className="bg-black shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-white">User Management</h2>
                                <div className="text-sm text-white">
                                    Total: {users.length} users
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-6 text-center">Loading users...</div>
                        ) : users.length === 0 ? (
                            <div className="p-6 text-center text-white  ">No users found</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-black">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-black divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-950">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">
                                                    {user.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user.id, e.target.value as 'user' | 'admin')}
                                                    className="text-sm border border-gray-300 rounded px-2 py-1 bg-black"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => alert(`View user ${user.id} details`)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(user.id, user.email)}
                                                    className="text-red-600 hover:text-red-900 ml-3">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}


                        <div className="px-6 py-4 border-t border-gray-200 bg-black">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-white">Total Users</div>
                                    <div className="text-xl font-semibold">{users.length}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-white">Admins</div>
                                    <div className="text-xl font-semibold text-green-600">
                                        {users.filter(u => u.role === 'admin').length}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Regular Users</div>
                                    <div className="text-xl font-semibold text-blue-600">
                                        {users.filter(u => u.role === 'user').length}
                                    </div>
                                </div>
                                <div>


                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;